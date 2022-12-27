import { useRouter } from "next/router"
import Pusher, { Channel } from "pusher-js"
import { useEffect, useState } from "react"
import type {
  TChannelConnectedUsers,
  TChannelInteraction,
  TChannelMessage,
} from "~~types/channel"

import { useAppSelector } from "@store/hooks"

import ChannelPostSection from "./ChannelPostsSection"
import ChannelUserList from "./ChannelUserList"

const ChannelMainWindow = () => {
  const router = useRouter()

  const selectUserId = useAppSelector((state) => state.user.id)
  const selectUsername = useAppSelector((state) => state.user.username)
  const selectChannelId = useAppSelector((state) => state.channel.id)

  const [posts, setPosts] = useState<
    Array<TChannelMessage | TChannelInteraction>
  >([])
  const [connectedUser, setConnectedUser] = useState<TChannelConnectedUsers>({
    [selectUserId]: {
      id: selectUserId,
      username: selectUsername,
    },
  })

  const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  })
  const [pusherChannel, setPusherChannel] = useState<Channel>()

  useEffect(() => {
    if (!selectUsername) {
      router.push("/")
      return
    }

    fetch(`/api/channel/${selectChannelId}/users`)
      .then((res) => res.json())
      .then((data) => {
        const updatedConnectedUsers = { ...connectedUser }
        data.content.forEach((user: { id: string; username: string }) => {
          updatedConnectedUsers[user.id] = {
            id: user.id,
            username: user.username,
          }
        })
        setConnectedUser(updatedConnectedUsers)
      })

    const channel = pusherClient.subscribe(`channel.${selectChannelId}`)
    channel.bind("message", (data: TChannelMessage) => {
      setPosts((prev) => [...prev, data])
    })
    channel.bind("connect/disconnect", (data: TChannelInteraction) => {
      setPosts((prev) => [...prev, data])

      const updatedConnectedUsers = { ...connectedUser }
      if (data.type === "CONNECT") {
        updatedConnectedUsers[data.userId] = {
          id: data.userId,
          username: data.username,
        }
      } else {
        delete updatedConnectedUsers[data.userId]
      }
      setConnectedUser(updatedConnectedUsers)
    })

    setPusherChannel(channel)

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [])

  async function onDisconnectButtonClick() {
    const res = await fetch("/api/channel/disconnect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + selectUserId,
      },
      body: JSON.stringify({ channelId: selectChannelId }),
    })

    if (res.status === 200) {
      pusherClient.unsubscribe(`channel.${selectChannelId}`)
      router.push("/")
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-white border-4 border-solid border-white rounded-xl overflow-hidden">
      <div className="w-full flex flex-row justify-between bg-green-800">
        <h3 className="px-4 font-semibold text-lg text-white text-center">
          Connected to: {selectChannelId || "Channel-ID"}
        </h3>
        <button
          onClick={onDisconnectButtonClick}
          className="px-4 text-white bg-green-600 hover:bg-green-700 active:bg-green-800"
        >
          Disconnect
        </button>
      </div>
      <div className="w-full h-full flex flex-row divide-x divide-green-600">
        <ChannelUserList connectedUser={connectedUser} />
        <ChannelPostSection posts={posts} />
      </div>
    </div>
  )
}

export default ChannelMainWindow

import type { NextPage } from "next"
import router from "next/router"
import { Channel } from "pusher-js"
import { useEffect, useState } from "react"
import {
  TChannelConnectedUsers,
  TChannelInteraction,
  TChannelMessage,
} from "~~types/channel"

import ChannelHeader from "@components/channel/ChannelHeader"
import ChannelMainSection from "@components/channel/ChannelMainSection"
import ChannelSubHeader from "@components/channel/ChannelSubHeader"
import { PUSHER } from "@core/pusher"
import { useAppSelector } from "@store/hooks"

const ChannelPage: NextPage = () => {
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

    const channel = PUSHER.subscribe(`channel.${selectChannelId}`)
    setPusherChannel(channel)

    return () => {
      setPusherChannel(undefined)
    }
  }, [])

  useEffect(() => {
    if (!pusherChannel) return

    pusherChannel.bind("message", (data: TChannelMessage) => {
      setPosts((prev) => [...prev, data])
      console.log(selectChannelId)
    })
    pusherChannel.bind("connect/disconnect", (data: TChannelInteraction) => {
      setPosts((prev) => [...prev, data])

      if (data.type === "CONNECT") {
        setConnectedUser((prev) => ({
          ...prev,
          [data.userId]: {
            id: data.userId,
            username: data.username,
          },
        }))
      } else {
        setConnectedUser((prev) => {
          const updatedConnectedUsers = { ...prev }
          delete updatedConnectedUsers[data.userId]
          return updatedConnectedUsers
        })
      }
    })

    return () => {
      pusherChannel.unbind_all()
      pusherChannel.unsubscribe()
    }
  }, [pusherChannel])

  return (
    <div className="h-screen flex flex-col">
      <ChannelHeader />
      <ChannelSubHeader pusherChannel={pusherChannel!} />
      <ChannelMainSection connectedUser={connectedUser} posts={posts} />
    </div>
  )
}

export default ChannelPage

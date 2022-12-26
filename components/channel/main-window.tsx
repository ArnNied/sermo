import { useRouter } from "next/router"
import Pusher, { Channel } from "pusher-js"
import { FormEvent, useEffect, useState } from "react"

import { useAppSelector } from "@store/hooks"

import ChannelMessageForm from "./message-form"
import ChannelMessageWindow from "./message-window"
import ChannelUserList from "./user-list"

type TMessage = {
  type: string
  sender: string
  message: string
  timestamp: number
}

type TConnectDisconnect = {
  type: string
  username: string
  timestamp: number
}

const ChannelMainWindow = () => {
  const router = useRouter()
  const selectUserId = useAppSelector((state) => state.user.id)
  const selectUsername = useAppSelector((state) => state.user.username)
  const selectChannelId = useAppSelector((state) => state.channel.id)

  const [messages, setMessages] = useState<
    Array<TMessage | TConnectDisconnect>
  >([])

  const [connectedUser, setConnectedUser] = useState({
    [selectUserId]: {
      id: selectUserId,
      username: selectUsername,
    },
  })

  const pusherClient = new Pusher("222a5569391c6d1461b9", {
    cluster: "ap1",
  })
  let pusherChannel: Channel

  useEffect(() => {
    if (!selectUsername) {
      router.push("/")
      return
    }

    pusherChannel = pusherClient.subscribe(`channel.${selectChannelId}`)
    pusherChannel.bind("message", (data: TMessage) => {
      setMessages((prev) => [...prev, data])
      alert(JSON.stringify(data))
    })
    pusherChannel.bind("connect/disconnect", (data: TConnectDisconnect) => {
      setMessages((prev) => [...prev, data])
      alert(JSON.stringify(data))
    })

    console.log("connected")

    return () => {
      pusherChannel.unbind_all()
      pusherChannel.unsubscribe()
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

    const req = (await res.json()).content

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
        <ChannelUserList
          connectedUser={connectedUser}
          selectUserId={selectUserId}
        />
        <ChannelMessageWindow
          messages={messages}
          selectChannelId={selectChannelId}
          selectUserId={selectUserId}
          selectUsername={selectUsername}
        />
      </div>
    </div>
  )
}

export default ChannelMainWindow

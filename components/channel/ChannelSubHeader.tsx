import Link from "next/link"
import { useRouter } from "next/router"
import { Channel } from "pusher-js"

import { useAppSelector } from "@store/hooks"

type TChannelSubHeader = {
  pusherChannel: Channel
  showUsers: boolean
  setShowUsers: () => void
}

const ChannelSubHeader = ({
  pusherChannel,
  showUsers,
  setShowUsers,
}: TChannelSubHeader) => {
  const router = useRouter()
  const selectChannelId = useAppSelector((state) => state.channel.id)
  const selectUserId = useAppSelector((state) => state.user.id)

  async function onDisconnectButtonClick() {
    await fetch("/api/channel/disconnect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + selectUserId,
      },
      body: JSON.stringify({ channelId: selectChannelId }),
    })

    // Unbind all events and unsubscribe from the channel
    // regardless of the response status code
    pusherChannel!.unbind_all()
    pusherChannel!.unsubscribe()
    pusherChannel!.disconnect()

    router.replace("/")
  }

  return (
    <div className="w-screen flex flex-row justify-between items-center px-8 md:px-24 py-1 bg-secondary-base">
      <button
        onClick={setShowUsers}
        className="block lg:hidden text-white hover:text-gray-200 active:text-gray-400"
      >
        {showUsers ? "Hide" : "Show"} Users
      </button>
      <a
        target="_blank"
        href="https://github.com/ArnNied/sermo"
        rel="noopener noreferrer"
        className="text-white hover:text-gray-200 active:text-gray-400"
      >
        About
      </a>
      <button
        onClick={onDisconnectButtonClick}
        className="text-white hover:text-gray-200 active:text-gray-400"
      >
        Disconnect
      </button>
    </div>
  )
}

export default ChannelSubHeader

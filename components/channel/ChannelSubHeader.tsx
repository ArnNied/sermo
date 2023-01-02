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
    const res = await fetch("/api/channel/disconnect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + selectUserId,
      },
      body: JSON.stringify({ channelId: selectChannelId }),
    })

    // If the user is disconnected from the channel, unbind all events and
    // unsubscribe from the channel
    if (res.status === 200) {
      pusherChannel!.unbind_all()
      pusherChannel!.unsubscribe()
      pusherChannel!.disconnect()

      router.replace("/")
    }
  }

  return (
    <div className="w-screen flex flex-row justify-between items-center px-8 md:px-24 py-1 bg-secondary-base">
      <button onClick={setShowUsers} className="block lg:hidden text-white">
        {showUsers ? "Hide" : "Show"} Users
      </button>
      <Link href="https://github.com/ArnNied/sermo" className="text-white">
        About
      </Link>
      <button onClick={onDisconnectButtonClick} className="text-white">
        Disconnect
      </button>
    </div>
  )
}

export default ChannelSubHeader

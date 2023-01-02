import Link from "next/link"
import { useRouter } from "next/router"
import { Channel } from "pusher-js"

import { useAppSelector } from "@store/hooks"

type TChannelSubHeader = {
  pusherChannel: Channel
}

const ChannelSubHeader = ({ pusherChannel }: TChannelSubHeader) => {
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
    <div className="w-screen flex flex-row justify-between px-24 py-1 bg-secondary-base">
      <div className="flex flex-row items-center">
        <Link href="https://github.com/ArnNied/sermo" className="text-white">
          About
        </Link>
      </div>
      <div className="flex items-center text-white">
        <button onClick={onDisconnectButtonClick}>Disconnect</button>
      </div>
    </div>
  )
}

export default ChannelSubHeader

import type { NextPage } from "next"

import ChannelHeader from "@components/channel/ChannelHeader"
import ChannelMainWindow from "@components/channel/ChannelMainWindow"

const ChannelPage: NextPage = () => {
  return (
    <div className="h-screen flex flex-col px-16 py-4 space-y-4">
      <ChannelHeader />
      <ChannelMainWindow />
    </div>
  )
}

export default ChannelPage

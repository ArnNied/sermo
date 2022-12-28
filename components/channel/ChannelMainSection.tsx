import type {
  TChannelConnectedUsers,
  TChannelInteraction,
  TChannelMessage,
} from "~~types/channel"

import ChannelPostsSection from "./ChannelPostsSection"
import ChannelUserList from "./ChannelUserList"

type TChannelMainSectionProps = {
  connectedUser: TChannelConnectedUsers
  posts: Array<TChannelMessage | TChannelInteraction>
}

const ChannelMainSection = ({
  connectedUser,
  posts,
}: TChannelMainSectionProps) => {
  return (
    <div className="w-full h-full min-h-0 flex flex-row px-36">
      <ChannelUserList connectedUser={connectedUser} />
      <ChannelPostsSection posts={posts} />
    </div>
  )
}

export default ChannelMainSection

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
  showUsers: boolean
}

const ChannelMainSection = ({
  connectedUser,
  posts,
  showUsers,
}: TChannelMainSectionProps) => {
  return (
    <div className="w-full h-full min-h-0 flex flex-row md:px-12 xl:px-36">
      <ChannelUserList connectedUser={connectedUser} showUsers={showUsers} />
      <ChannelPostsSection posts={posts} showUsers={showUsers} />
    </div>
  )
}

export default ChannelMainSection

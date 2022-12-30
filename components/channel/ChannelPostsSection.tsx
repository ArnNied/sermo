import type { TChannelInteraction, TChannelMessage } from "~~types/channel"

import { useAppSelector } from "@store/hooks"

import ChannelMessageForm from "./ChannelMessageForm"
import ChannelPostInteraction from "./ChannelPostInteraction"
import ChannelPostMessage from "./ChannelPostMessage"

type TChannelPostSectionProps = {
  posts: Array<TChannelMessage | TChannelInteraction>
}

const ChannelPostSection = ({ posts }: TChannelPostSectionProps) => {
  const selectUserId = useAppSelector((state) => state.user.id)

  return (
    <div className="w-9/12 flex flex-col px-8">
      <div className="h-full flex flex-col py-2 space-y-1 overflow-y-auto">
        {posts.map((post, index) => {
          if (post.type === "MESSAGE") {
            const message = post as TChannelMessage
            return (
              <ChannelPostMessage
                key={index}
                message={message.message}
                userId={message.userId}
                username={message.username}
                timestamp={message.timestamp}
                self={message.userId === selectUserId}
              />
            )
          } else if (post.type === "CONNECT" || post.type === "DISCONNECT") {
            const interaction = post as TChannelInteraction
            return (
              <ChannelPostInteraction
                key={index}
                type={interaction.type}
                username={interaction.username}
              />
            )
          }
        })}
      </div>
      <ChannelMessageForm />
    </div>
  )
}

export default ChannelPostSection

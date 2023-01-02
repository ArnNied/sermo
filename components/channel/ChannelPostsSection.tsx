import { useEffect } from "react"
import type { TChannelInteraction, TChannelMessage } from "~~types/channel"

import { useAppSelector } from "@store/hooks"

import ChannelMessageForm from "./ChannelMessageForm"
import ChannelPostInteraction from "./ChannelPostInteraction"
import ChannelPostMessage from "./ChannelPostMessage"

type TChannelPostSectionProps = {
  posts: Array<TChannelMessage | TChannelInteraction>
  showUsers: boolean
}

const ChannelPostSection = ({ posts, showUsers }: TChannelPostSectionProps) => {
  const selectUsername = useAppSelector((state) => state.user.username)

  return (
    <div
      id="channel-post-section"
      className={`w-full lg:w-9/12 lg:!flex flex-col px-2 sm:px-4 md:px-8 ${
        showUsers ? "hidden" : "flex"
      }`}
    >
      <div className="h-full flex flex-col py-2 space-y-1 overflow-y-auto">
        {posts.map((post, index) => {
          if (post.type === "MESSAGE") {
            const message = post as TChannelMessage
            return (
              <ChannelPostMessage
                key={index}
                message={message.message}
                username={message.username}
                timestamp={message.timestamp}
                self={message.username === selectUsername}
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

import { useEffect, useState } from "react"
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
  const [atBottom, setAtBottom] = useState(true)

  // Scroll to bottom whenever `posts` changes
  useEffect(() => {
    const channelPostSection = document.getElementById("channel-post-section")
    if (!channelPostSection) return

    // If the user is already at the bottom or the new post is from the user
    // scroll to the bottom on new post
    // If the user is not at the bottom, do not scroll to the bottom
    if (atBottom || posts[posts.length - 1].username === selectUsername) {
      channelPostSection.scrollTo({
        top: channelPostSection.scrollHeight,
        behavior: "smooth",
      })
      setAtBottom(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts])

  function handleScroll(e: React.UIEvent<HTMLDivElement, UIEvent>) {
    const target = e.target as HTMLDivElement
    setAtBottom(target.scrollHeight - target.scrollTop === target.clientHeight)
  }

  return (
    <div
      className={`w-full lg:w-9/12 lg:!flex flex-col px-2 sm:px-4 md:px-8 ${
        showUsers ? "hidden" : "flex"
      }`}
    >
      <div
        id="channel-post-section"
        onScroll={handleScroll}
        className="h-full flex flex-col py-2 space-y-1 overflow-y-auto"
      >
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

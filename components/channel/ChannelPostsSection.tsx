import ChannelMessageForm from "./ChannelMessageForm"
import ChannelPostInteraction from "./ChannelPostInteraction"
import ChannelPostMessage from "./ChannelPostMessage"

type TMessage = {
  type: string
  sender: string
  username: string
  message: string
  timestamp: number
}

type TInteraction = {
  type: "CONNECT" | "DISCONNECT"
  username: string
  timestamp: number
}

type TChannelPostSectionProps = {
  posts: Array<TMessage | TInteraction>
  selectChannelId: string
  selectUserId: string
  selectUsername: string
}

const ChannelPostSection = ({
  posts,
  selectChannelId,
  selectUserId,
  selectUsername,
}: TChannelPostSectionProps) => {
  return (
    <div className="w-9/12 flex flex-col">
      <div className="h-full flex flex-col py-2 space-y-1">
        {posts.map((post, index) => {
          if (post.type === "MESSAGE") {
            const message = post as TMessage
            return (
              <ChannelPostMessage
                key={index}
                message={message.message}
                username={message.username}
                timestamp={message.timestamp}
                self={message.sender == selectUserId}
              />
            )
          } else if (post.type === "CONNECT" || post.type === "DISCONNECT") {
            const interaction = post as TInteraction
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
      <ChannelMessageForm
        selectChannelId={selectChannelId}
        selectUserId={selectUserId}
      />
    </div>
  )
}

export default ChannelPostSection

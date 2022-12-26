import ChannelMessageForm from "./message-form"

type TMessage = {
  type: string
  sender: string
  message: string
  timestamp: number
}

type TConnectDisconnect = {
  type: string
  username: string
  timestamp: number
}

type TChannelMessageWindowProps = {
  messages: Array<TMessage | TConnectDisconnect>
  selectChannelId: string
  selectUserId: string
  selectUsername: string
}

const ChannelMessageWindow = ({
  messages,
  selectChannelId,
  selectUserId,
  selectUsername,
}: TChannelMessageWindowProps) => {
  return (
    <div className="w-9/12 flex flex-col">
      <div className="h-full flex flex-col">
        {messages.map((message, index) => {
          if (message.type === "MESSAGE") {
            message = message as TMessage
            return (
              <div
                key={index}
                className={`p-2 flex flex-row ${
                  message.sender === selectUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-2 py-1 rounded ${
                    message.sender === selectUserId
                      ? "bg-green-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {message.message}
                </div>
              </div>
            )
          } else if (
            message.type === "CONNECT" ||
            message.type === "DISCONNECT"
          ) {
            message = message as TConnectDisconnect
            return (
              <div
                key={index}
                className={`p-1 flex flex-row justify-center ${
                  message.username === selectUsername
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.type === "CONNECT" ? (
                  <div className="rounded text-gray-500">
                    {message.username} has joined the channel
                  </div>
                ) : (
                  <div className="rounded text-gray-500">
                    {message.username} has left the channel
                  </div>
                )}
              </div>
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

export default ChannelMessageWindow

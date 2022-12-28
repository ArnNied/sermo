type TMessageProps = {
  message: string
  username: string
  timestamp: number
  self: boolean
}

const Message = ({ message, username, timestamp, self }: TMessageProps) => {
  return (
    <div
      className={`px-2 flex flex-col ${self ? "items-end" : "justify-start"}`}
    >
      <p className="text-sm text-white">{self ? "Me" : username}</p>
      <div
        className={`w-fit max-w-md flex flex-col px-2 py-1 text-white rounded ${
          self ? "bg-primary-darker" : "bg-quaternary-base"
        }`}
      >
        <p className="whitespace-pre-line">{message}</p>
      </div>
    </div>
  )
}

export default Message

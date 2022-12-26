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
      <p className="text-sm text-gray-500">{self ? "Me" : username}</p>
      <div
        className={`flex flex-col px-2 py-1 rounded w-fit max-w-md ${
          self ? "bg-green-600 text-white" : "bg-gray-200"
        }`}
      >
        <p className="whitespace-pre-line">{message}</p>
      </div>
    </div>
  )
}

export default Message

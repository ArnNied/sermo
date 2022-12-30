import parse from "html-react-parser"
import * as Jidenticon from "jdenticon"

type TMessageProps = {
  message: string
  userId: string
  username: string
  timestamp: number
  self: boolean
}

const Message = ({
  message,
  userId,
  username,
  timestamp,
  self,
}: TMessageProps) => {
  return (
    <div
      className={`px-2 flex space-x-2 ${
        self
          ? "flex-row-reverse items-end space-x-reverse"
          : "flex-row justify-start"
      }`}
    >
      <div className="h-full flex items-start pt-1">
        {parse(Jidenticon.toSvg(userId, 24, { backColor: "#FFF" }))}
      </div>
      <div className="flex flex-col">
        <p className={`text-sm text-white ${self ? "text-end" : "text-start"}`}>
          {self ? "Me" : username}
        </p>
        <div
          className={`w-fit max-w-md flex flex-col px-2 py-1 text-white rounded ${
            self ? "bg-primary-darker" : "bg-quaternary-base"
          }`}
        >
          <p className="whitespace-pre-line">{message}</p>
        </div>
      </div>
    </div>
  )
}

export default Message

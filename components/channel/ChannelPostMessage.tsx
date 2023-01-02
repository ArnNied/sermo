import parse from "html-react-parser"
import * as Jidenticon from "jdenticon"
import moment from "moment"
import { useEffect, useState } from "react"

type TMessageProps = {
  message: string
  username: string
  timestamp: number
  self: boolean
}

const Message = ({ message, username, timestamp, self }: TMessageProps) => {
  const [humanizedTimestamp, setHumanizedTimestamp] = useState<string>(
    moment(timestamp).fromNow()
  )

  useEffect(() => {
    // Update the timestamp every second
    const interval = setInterval(() => {
      setHumanizedTimestamp(moment(timestamp).fromNow())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div
      className={`px-2 flex space-x-2 ${
        self
          ? "flex-row-reverse items-end pl-20 space-x-reverse"
          : "flex-row justify-start pr-20"
      }`}
    >
      <div className="h-full flex items-start pt-1">
        {parse(Jidenticon.toSvg(username, 24, { backColor: "#FFF" }))}
      </div>
      <div className="flex flex-col min-w-0">
        <p className={`text-sm text-white ${self ? "text-end" : "text-start"}`}>
          {self ? "Me" : username}
        </p>
        <div
          className={`min-w-0 w-fit md:max-w-sm xl:max-w-md flex flex-col px-2 py-1 text-white rounded ${
            self ? "bg-primary-darker" : "bg-quaternary-base"
          }`}
        >
          <p className="whitespace-pre-line break-words">{message}</p>
          <p className="text-xs text-gray-200 text-end">{humanizedTimestamp}</p>
        </div>
      </div>
    </div>
  )
}

export default Message

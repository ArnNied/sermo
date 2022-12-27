import { FormEvent, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"

import { useAppSelector } from "@store/hooks"

const ChannelMessageForm = () => {
  const selectUserId = useAppSelector((state) => state.user.id)
  const selectChannelId = useAppSelector((state) => state.channel.id)

  const [textMessage, setTextMessage] = useState("")
  const [canSend, setCanSend] = useState(true)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!canSend) return

    setCanSend(false)

    setTextMessage("")

    fetch("/api/message/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + selectUserId,
      },
      body: JSON.stringify({
        channelId: selectChannelId,
        message: textMessage,
      }),
    })

    setTimeout(() => {
      setCanSend(true)
    }, 150)
  }

  return (
    <div className="w-full flex p-2 bg-green-800">
      <form onSubmit={handleSubmit} className="w-full flex flex-row">
        <TextareaAutosize
          minRows={1}
          maxRows={3}
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          className="w-full px-2 py-1 border border-solid border-green-600 rounded-tl-lg rounded-bl-lg"
        />
        <button
          type="submit"
          className="px-2 py-1 bg-green-600 hover:bg-green-700 active:bg-green-800 border border-solid border-green-600 text-white rounded-tr-lg rounded-br-lg"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default ChannelMessageForm

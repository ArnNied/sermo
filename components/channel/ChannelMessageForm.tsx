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

    // Prevent spamming
    setCanSend(false)

    // Clear the text area
    setTextMessage("")

    // Send the message to the server
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

    // Re-enable the send button after 150ms
    setTimeout(() => {
      setCanSend(true)
    }, 150)
  }

  return (
    <div className="w-full flex py-4">
      <form onSubmit={handleSubmit} className="w-full flex flex-row">
        <TextareaAutosize
          minRows={1}
          maxRows={3}
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          className="w-full px-2 py-1 rounded-tl rounded-bl focus:outline-none"
        />
        <button
          type="submit"
          className="px-2 py-1 bg-quaternary-base hover:bg-quaternary-base active:bg-quaternary-base text-white rounded-tr rounded-br"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default ChannelMessageForm

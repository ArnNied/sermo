import { FormEvent, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"

import { useAppSelector } from "@store/hooks"

const ChannelMessageForm = () => {
  const selectUserId = useAppSelector((state) => state.user.id)
  const selectChannelId = useAppSelector((state) => state.channel.id)

  const [textMessage, setTextMessage] = useState("")
  const [canSend, setCanSend] = useState(true)

  function handleSubmit(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault()

    if (!canSend) return

    // Prevent sending empty messages
    if (!textMessage) return

    // Prevent spamming
    setCanSend(false)

    // Clear the text area after sending the message
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
      <form
        name="connect-form"
        onSubmit={handleSubmit}
        className="w-full flex flex-row"
      >
        <TextareaAutosize
          minRows={1}
          maxRows={3}
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          className="w-full px-2 py-1 rounded-tl rounded-bl focus:outline-none"
          onKeyDown={(e) => {
            // If the user presses enter, submit the form
            if (e.key == "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
        />
        <button
          type="submit"
          name="send-message"
          className="w-[32px] h-[32px] px-2 py-1.5 bg-quaternary-base hover:bg-quaternary-dark active:bg-quaternary-darker text-white rounded-tr rounded-br"
        >
          {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="fill-white"
          >
            <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
          </svg>
        </button>
      </form>
    </div>
  )
}

export default ChannelMessageForm

import { FormEvent, useState } from "react"

type TChanelMessageFormProps = {
  selectChannelId: string
  selectUserId: string
}

const ChannelMessageForm = ({
  selectChannelId,
  selectUserId,
}: TChanelMessageFormProps) => {
  const [textMessage, setTextMessage] = useState("")

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const res = fetch("/api/message/", {
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
  }

  return (
    <div className="w-full flex p-2 bg-green-800">
      <form onSubmit={handleSubmit} className="w-full flex flex-row">
        {/* <input
                  type="text"
                  className="w-full px-2 py-1 border border-solid border-green-600 rounded-tl-lg rounded-bl-lg"
                /> */}
        <textarea
          onChange={(e) => setTextMessage(e.target.value)}
          rows={1}
          className="w-full px-2 py-1 border border-solid border-green-600 rounded-tl-lg rounded-bl-lg"
        ></textarea>
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

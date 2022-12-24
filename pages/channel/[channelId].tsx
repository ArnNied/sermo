import type { NextPage } from "next"
import { useRouter } from "next/router"
import { FormEvent, useEffect, useState } from "react"

import { nanoid } from "@reduxjs/toolkit"

import { useAppSelector } from "../../store/hooks"

const Channel: NextPage = () => {
  const router = useRouter()
  const selectUserId = useAppSelector((state) => state.user.id)
  const selectUsername = useAppSelector((state) => state.user.username)
  const selectChannelId = useAppSelector((state) => state.channel.id)

  const [connectedUser, setConnectedUser] = useState({
    [selectUserId]: {
      id: selectUserId,
      username: selectUsername,
    },
  })

  useEffect(() => {
    if (!selectUsername) {
      router.push("/")
    }
  }, [])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }
  return (
    <div className="h-screen flex flex-col px-16 py-4 space-y-4">
      <div className="flex flex-row items-center">
        <h1 className="p-2 font-bold text-5xl text-white border-r-4 border-solid border-white">
          SERMO
        </h1>
        <h2 className="p-2 font-semibold text text-white">
          Straightforward and No BS Messaging
        </h2>
      </div>
      <div className="w-full h-full flex flex-col bg-white border-4 border-solid border-white rounded-xl overflow-hidden">
        <div className="w-full bg-green-800">
          <h3 className="font-bold text-lg text-white text-center">
            Connected to: {selectChannelId || "Channel-ID"}
          </h3>
        </div>
        <div className="w-full h-full flex flex-row divide-x divide-green-600">
          <div className="h-full max-h-full w-3/12 flex flex-col overflow-y-auto">
            {Object.values(connectedUser).map((user) => (
              <div className="p-3 border-l border-b border-green-600">
                {user.username} {user.id === selectUserId && "(You)"}
              </div>
            ))}
          </div>
          <div className="w-9/12 flex flex-col">
            <div className="h-full flex flex-col"></div>
            <div className="w-full flex p-2 bg-green-800">
              <form onSubmit={handleSubmit} className="w-full flex flex-row">
                <input
                  type="text"
                  className="w-full px-2 py-1 border border-solid border-green-600 rounded-tl-lg rounded-bl-lg"
                />
                <button
                  type="submit"
                  className="p-1 bg-green-600 hover:bg-green-700 active:bg-green-800 border border-solid border-green-600 text-white rounded-tr-lg rounded-br-lg"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Channel

import type { NextPage } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { FormEvent } from "react"
import { useState } from "react"

import { useAppDispatch } from "../store/hooks"
import { updateId, updateUsername } from "../store/userSlice"

// import { incrementByAmount } from "../store/userSlice"

type TErrors = {
  username?: string
  channelId?: string
  misc?: string
}

const Home: NextPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [username, setUsername] = useState("")
  const [channelId, setChannelId] = useState("")
  const [errors, setErrors] = useState<TErrors>()

  async function validateForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const tempErr: TErrors = {}

    if (!username) {
      tempErr.username = "Username is required"
    } else if (username.includes(" ")) {
      tempErr.username = "Username cannot contain spaces"
    } else if (username.length > 16) {
      tempErr.username = "Username cannot be longer than 16 characters"
    }

    if (!channelId) {
      tempErr.channelId = "Channel ID is required"
    } else if (!channelId.match(/^[a-z0-9\-]*$/i)) {
      tempErr.channelId =
        "Channel ID must only contain 'a-Z', '0-9' and '-' characters"
    } else if (channelId.length > 32) {
      tempErr.channelId = "Channel ID must be less than 32 characters"
    }

    if (Object.keys(tempErr).length === 0) {
      const res = await fetch("/api/user/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      }).catch(() => {
        tempErr.misc = "Something went wrong"
      })

      if (res?.status === 201) {
        const data = await res.json()

        dispatch(updateId(data.id))
        dispatch(updateUsername(username))

        const channelRes = await fetch("/api/channel/connect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: data.id,
            channelId: channelId,
          }),
        }).catch(() => {
          tempErr.misc = "Something went wrong"
        })

        if (channelRes?.status === 201) {
          router.push(`/channel/${channelId}`)
        } else {
          tempErr.misc = res?.statusText
        }
      } else {
        tempErr.misc = res?.statusText
      }
    }
    setErrors(tempErr)
  }

  return (
    <div className="flex flex-row">
      <div className="relative w-7/12 h-screen">
        <div className="relative w-full h-screen">
          <Image src="/index/index.jpg" layout="fill" />
        </div>
        <div className="absolute bottom-0 left-0 text-white">
          Photo by{" "}
          <a
            href="https://unsplash.com/@ninjason?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            className="text-blue-600 hover:text-blue-700"
          >
            Jason Leung
          </a>{" "}
          on{" "}
          <a
            href="https://unsplash.com/s/photos/chat?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            className="text-blue-600 hover:text-blue-700"
          >
            Unsplash
          </a>
        </div>
      </div>
      <div className="w-5/12 h-screen flex flex-col justify-center p-2 md:p-4 lg:p-8 xl:p-16 bg-green-600 space-y-4">
        <div className="flex flex-col">
          <h1 className="font-bold text-6xl text-white text-center">SERMO</h1>
          <h2 className="font-semibold text-white text-center">
            Lightweight and No BS Messaging
          </h2>
        </div>
        <div className="flex mx-8 p-4 bg-white rounded-xl">
          <form
            method="POST"
            onSubmit={(e) => validateForm(e)}
            className="w-full space-y-4"
          >
            <div className="flex flex-col space-y-1">
              <label htmlFor="usernameInput" className="font-bold">
                Username
              </label>
              <input
                id="usernameInput"
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                className="px-1 py-px border-b-2 border-solid border-green-600 border-opacity-50 focus:border-opacity-100 outline-none"
              />
              {errors?.username && (
                <p className="text-sm text-red-600">{errors.username}</p>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="channelIdInput" className="font-bold">
                Channel ID
              </label>
              <input
                id="channelIdInput"
                type="text"
                placeholder="Channel-ID"
                onChange={(e) => setChannelId(e.target.value)}
                className="px-1 py-px border-b-2 border-solid border-green-600 border-opacity-50 focus:border-opacity-100 outline-none"
              />
              {errors?.channelId && (
                <p className="text-sm text-red-600">{errors.channelId}</p>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <button
                type="submit"
                className="p-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-lg text-white rounded"
              >
                Join/Create Channel
              </button>
              {errors?.misc && (
                <p className="text-sm text-red-600">{errors.misc}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Home

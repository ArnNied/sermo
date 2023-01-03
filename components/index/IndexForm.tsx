import { useRouter } from "next/router"
import { FormEvent } from "react"
import { useState } from "react"
import { TIndexFormErrors } from "~~types/index"

import { updateId as updateChannelId } from "@store/channelSlice"
import { useAppDispatch } from "@store/hooks"
import { updateId as updateUserId, updateUsername } from "@store/userSlice"

import IndexInput from "./IndexInput"

const IndexForm = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [username, setUsername] = useState("")
  const [channelId, setChannelId] = useState("")
  const [errors, setErrors] = useState<TIndexFormErrors>()

  async function validateForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Plahesolder for error handling
    const tempErr: TIndexFormErrors = {}

    // Validate username
    if (!username) {
      tempErr.username = "Username is required"
    } else if (username.includes(" ")) {
      tempErr.username = "Username cannot contain spaces"
    } else if (username.length > 16) {
      tempErr.username = "Username cannot be longer than 16 characters"
    }

    // Validate channel ID
    if (!channelId) {
      tempErr.channelId = "Channel ID is required"
    } else if (!channelId.match(/^[a-z0-9\-]*$/i)) {
      tempErr.channelId =
        "Channel ID must only contain 'a-Z', '0-9' and '-' characters"
    } else if (channelId.length > 32) {
      tempErr.channelId = "Channel ID must be less than 32 characters"
    }

    // If no errors, send request to server
    if (Object.keys(tempErr).length === 0) {
      let req, res

      // Attempt to connect to the channel
      try {
        req = await fetch("/api/channel/connect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            channelId: channelId,
          }),
        })
        res = await req?.json()
      } catch (err) {
        tempErr.misc = "Failed to connect to server"
      }

      if (req?.status === 200 || req?.status === 201) {
        //If successful, update the redux store and redirect to the channel page
        dispatch(updateUserId(res.content.user.id))
        dispatch(updateUsername(username))
        dispatch(updateChannelId(channelId))

        router.push(`/channel/${channelId}`)
      } else {
        tempErr.misc = res?.description || req?.statusText || "Unknown error"
      }
    }
    setErrors(tempErr)
  }

  return (
    <div className="w-full md:w-5/12 h-full md:h-screen flex flex-col justify-center p-2 md:p-4 lg:p-8 xl:p-16 bg-primary-base space-y-4">
      <div className="flex flex-col">
        <h1 className="font-bold text-6xl text-white text-center">SERMO</h1>
        <h2 className="font-semibold text-white text-center">
          Lightweight and No BS Messaging
        </h2>
      </div>
      <div className="flex mx-8 p-4 bg-white rounded-lg">
        <form
          method="POST"
          onSubmit={(e) => validateForm(e)}
          className="w-full space-y-4"
        >
          <IndexInput
            id="usernameInput"
            error={errors?.username}
            display="Username"
            onChangeHandler={setUsername}
          />
          <IndexInput
            id="channelIdInput"
            error={errors?.channelId}
            display="Channel ID"
            onChangeHandler={setChannelId}
          />
          <div className="flex flex-col space-y-1">
            <button
              type="submit"
              className="p-1 bg-primary-base hover:bg-primary-dark active:bg-primary-darker text-lg text-white rounded"
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
  )
}

export default IndexForm

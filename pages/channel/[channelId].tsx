import moment from "moment"
import type { NextPage } from "next"
import router, { useRouter } from "next/router"
import { Channel } from "pusher-js"
import { useEffect, useState } from "react"
import {
  TChannelConnectedUsers,
  TChannelInteraction,
  TChannelMessage,
} from "~~types/channel"

import ChannelHeader from "@components/channel/ChannelHeader"
import ChannelMainSection from "@components/channel/ChannelMainSection"
import ChannelSubHeader from "@components/channel/ChannelSubHeader"
import { PUSHER } from "@core/pusher"
import { useAppSelector } from "@store/hooks"

const ChannelPage: NextPage = () => {
  const router = useRouter()

  const { channelId } = router.query

  const selectUsername = useAppSelector((state) => state.user.username)

  const [showUsers, setShowUsers] = useState(false)
  const [posts, setPosts] = useState<
    Array<TChannelMessage | TChannelInteraction>
  >([])
  const [connectedUser, setConnectedUser] = useState<TChannelConnectedUsers>([
    selectUsername,
  ])
  const [pusherChannel, setPusherChannel] = useState<Channel>()
  const [lastActive, setLastActive] = useState<number>(moment.now())
  const [afkAlerted, setAfkAlerted] = useState(false)

  // Fetch connected users to populate the the UI and subscribe to the channel
  useEffect(() => {
    if (!router.isReady) return

    if (!selectUsername && channelId) {
      router.replace(`/?channel=${channelId}`)
      return
    }

    fetch(`/api/channel/${channelId}/users`)
      .then((res) => res.json())
      .then((data) => {
        data = data.content.filter(
          (username: string) => username !== selectUsername
        )
        setConnectedUser([selectUsername, ...data])
      })

    const channel = PUSHER.subscribe(`channel.${channelId}`)
    setPusherChannel(channel)

    // Unsubscribe from the channel when the component unmounts
    return () => {
      setPusherChannel(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  // Bind to pusher events
  useEffect(() => {
    if (!pusherChannel) return

    pusherChannel.bind("message", (data: TChannelMessage) => {
      setPosts((prev) => [...prev, data])

      if (data.username !== selectUsername) {
        setLastActive(data.timestamp)
      }
    })

    pusherChannel.bind("connect/disconnect", (data: TChannelInteraction) => {
      setPosts((prev) => [...prev, data])

      if (data.type === "CONNECT") {
        setConnectedUser((prev) => [...prev, data.username])
      } else {
        setConnectedUser((prev) =>
          prev.filter((username) => username !== data.username)
        )
      }
    })

    // Unbind all events and unsubscribe from the channel when the component unmounts
    return () => {
      pusherChannel.unbind_all()
      pusherChannel.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pusherChannel])

  // redirect to home page if the user is afk after 1 hour
  useEffect(() => {
    const interval = setInterval(() => {
      if (!afkAlerted && moment.now() - lastActive > 1000 * 60 * 60) {
        setAfkAlerted(true)
        alert("You have been inactive for 1 hour. Redirecting to home page.")
        router.replace("/")
      }
    }, 1000) // 1 seconds

    return () => {
      clearInterval(interval)
    }
  })

  return (
    <div className="h-screen flex flex-col">
      <ChannelHeader />
      <ChannelSubHeader
        pusherChannel={pusherChannel!}
        showUsers={showUsers}
        setShowUsers={() => setShowUsers((prev) => !prev)}
      />
      <ChannelMainSection
        connectedUser={connectedUser}
        posts={posts}
        showUsers={showUsers}
      />
    </div>
  )
}

export default ChannelPage

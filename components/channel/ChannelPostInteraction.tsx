type TChannelPostInteractionProps = {
  type: "CONNECT" | "DISCONNECT"
  username: string
}

const ChannelPostInteraction = ({
  type,
  username,
}: TChannelPostInteractionProps) => {
  return (
    <div className="w-full rounded">
      {type === "CONNECT" ? (
        <p className="text-sm text-white text-center">
          {username} has joined the channel
        </p>
      ) : (
        <p className="text-sm text-white text-center">
          {username} has left the channel
        </p>
      )}
    </div>
  )
}

export default ChannelPostInteraction

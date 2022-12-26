import type { TChannelConnectedUsers } from "~~types/channel"

type TChannelUserListProps = {
  connectedUser: TChannelConnectedUsers
  selectUserId: string
}

const ChannelUserList = ({
  connectedUser,
  selectUserId,
}: TChannelUserListProps) => {
  return (
    <div className="h-full max-h-full w-3/12 flex flex-col overflow-y-auto">
      {Object.values(connectedUser).map((user, index) => (
        <div key={index} className="p-3 border-l border-b border-green-600">
          {user.username} {user.id === selectUserId && "(You)"}
        </div>
      ))}
    </div>
  )
}

export default ChannelUserList

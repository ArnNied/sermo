import type { TChannelConnectedUsers } from "~~types/channel"

import { useAppSelector } from "@store/hooks"

type TChannelUserListProps = {
  connectedUser: TChannelConnectedUsers
}

const ChannelUserList = ({ connectedUser }: TChannelUserListProps) => {
  const selectUserId = useAppSelector((state) => state.user.id)

  return (
    <div className="h-full max-h-full w-3/12 flex flex-col overflow-y-auto">
      {Object.values(connectedUser).map((user, index) => (
        <div key={index} className="p-3 border-l border-b border-green-600">
          {user.username} {user.id === selectUserId && "(Me)"}
        </div>
      ))}
    </div>
  )
}

export default ChannelUserList

import type { TChannelConnectedUsers } from "~~types/channel"

import { useAppSelector } from "@store/hooks"

type TChannelUserListProps = {
  connectedUser: TChannelConnectedUsers
}

const ChannelUserList = ({ connectedUser }: TChannelUserListProps) => {
  const selectUserId = useAppSelector((state) => state.user.id)

  return (
    <div className="w-3/12 flex flex-col overflow-y-auto bg-quaternary-base">
      <h4 className="p-4 font-bold text-white border-b-2 border-quaternary-darker">
        Connected Users:{" "}
      </h4>
      {Object.values(connectedUser).map((user, index) => (
        <div key={index} className="p-3 text-white">
          {user.username} {user.id === selectUserId && "(Me)"}
        </div>
      ))}
    </div>
  )
}

export default ChannelUserList

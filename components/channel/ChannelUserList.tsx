import parse from "html-react-parser"
import * as Jidenticon from "jdenticon"
import { useEffect } from "react"
import type { TChannelConnectedUsers } from "~~types/channel"

import { useAppSelector } from "@store/hooks"

type TChannelUserListProps = {
  connectedUser: TChannelConnectedUsers
  showUsers: boolean
}

const ChannelUserList = ({
  connectedUser,
  showUsers,
}: TChannelUserListProps) => {
  const selectUsername = useAppSelector((state) => state.user.username)

  return (
    <div
      id="channel-users-section"
      className={`w-full lg:w-3/12 lg:!flex flex-col overflow-y-auto bg-quaternary-base ${
        showUsers ? "flex" : "hidden"
      }`}
    >
      <h4 className="p-4 font-bold text-white border-b-2 border-quaternary-darker">
        Connected Users:{" "}
      </h4>
      {connectedUser.map((username, index) => (
        <div
          key={index}
          className="flex flex-row items-center px-3 py-2 space-x-4"
        >
          <div className="w-[42px]">
            {parse(Jidenticon.toSvg(username, 42, { backColor: "#FFF" }))}
          </div>
          <p className="text-white break-words">
            {username} {username === selectUsername && "(Me)"}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ChannelUserList

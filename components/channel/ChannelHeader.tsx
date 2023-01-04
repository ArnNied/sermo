import { useAppSelector } from "@store/hooks"

const ChannelHeader = () => {
  const selectChannelId = useAppSelector((state) => state.channel.id)

  return (
    <div className="w-screen flex flex-row justify-between px-8 md:px-16 py-2 lg:py-4 bg-primary-base">
      <div className="flex flex-row items-center">
        <h1 className="p-2 font-bold text-2xl md:text-4xl text-white md:border-r-4 border-solid border-white">
          SERMO
        </h1>
        <h2 className="p-2 font-semibold hidden md:block text-base text-white">
          Straightforward and No BS Messaging
        </h2>
      </div>
      <div className="flex items-center overflow-hidden">
        <h3 className="text-white md:text-lg">
          Connected to: <span className="font-bold">{selectChannelId}</span>
        </h3>
      </div>
    </div>
  )
}

export default ChannelHeader

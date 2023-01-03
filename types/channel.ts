export type TChannelMessage = {
  type: "MESSAGE"
  username: string
  message: string
  timestamp: number
}

export type TChannelInteraction = {
  type: "CONNECT" | "DISCONNECT"
  username: string
  timestamp: number
}

export type TChannelConnectedUsers = Array<string>

export type TChannel = {
  id: string
  createdAt: number
  connectedUsers: TChannelConnectedUsers
}

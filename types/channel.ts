export type TChannelMessage = {
  type: "MESSAGE"
  sender: string
  username: string
  message: string
  timestamp: number
}

export type TChannelInteraction = {
  type: "CONNECT" | "DISCONNECT"
  userId: string
  username: string
  timestamp: number
}

export type TChannel = {
  id: string
  createdAt: number
  connectedUsers: string[]
}

export type TChannelConnectedUsers = {
  [userId: string]: {
    id: string
    username: string
  }
}

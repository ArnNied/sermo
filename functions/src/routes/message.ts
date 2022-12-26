import { Request, Response } from "express"
import express from "express"

import { admin } from "../core"
import { pusher } from "../core"
import { userRequired } from "../middleware/common"
import { preMessageSend } from "../middleware/message"
import { getBearerToken } from "../utils"

const router = express.Router()

// Send message to a channel
async function sendMessage(req: Request, res: Response) {
  const userId = getBearerToken(req.headers.authorization)
  const channelId = req.body.channelId
  const message = req.body.message

  const channel = await admin
    .firestore()
    .collection("channels")
    .doc(channelId)
    .get()

  if (channel.exists) {
    const user = await admin.firestore().collection("users").doc(userId).get()

    if (channel.data()!.connectedUsers.includes(userId)) {
      await admin.firestore().collection("users").doc(userId).update({
        lastActive: Date.now(),
      })

      pusher.trigger(`channel.${channelId}`, "message", {
        type: "MESSAGE",
        sender: user.data()!.username,
        username: user.data()!.username,
        message: message,
        timestamp: Date.now(),
      })

      return res.status(201).json({
        status: "CREATED",
        description: "Message successfully sent",
        content: message,
      })
    } else {
      return res.status(401).json({
        status: "UNAUTHORIZED",
        description: "User not connected to channel",
      })
    }
  } else {
    return res.status(404).json({
      status: "ERROR",
      description: "Channel does not exist",
    })
  }
}

router.use(userRequired)
router.post("/", preMessageSend, sendMessage)

export default router

import { Request, Response } from "express"
import express from "express"
import moment from "moment"

import { admin } from "../core"
import { PUSHER } from "../core"
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

    const now = moment().valueOf()
    await admin.firestore().collection("users").doc(userId).update({
      lastActive: now,
    })

    // Check if user is connected to channel
    if (user.data()!.connectedTo === channelId) {
      PUSHER.trigger(`channel.${channelId}`, "message", {
        type: "MESSAGE",
        username: user.data()!.username,
        message: message,
        timestamp: now,
      })

      return res.status(201).json({
        status: "CREATED",
        description: "Message successfully sent",
        content: { message: message, timestamp: now },
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

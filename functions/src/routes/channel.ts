// import cors from "cors"
import { Request, Response } from "express"
import express from "express"

import { admin } from "../core"
import { channelValidateBody, deleteEmptyChannels } from "../middleware/channel"
import { userRequired } from "../middleware/common"
import { getBearerToken } from "../utils"

const router = express.Router()

// List all available channel
async function getAllChannel(req: Request, res: Response) {
  const query = await admin.firestore().collection("channels").get()

  const listOfChannels = query.docs.map((doc) => {
    return {
      id: doc.id,
      createdAt: doc.data().createdAt,
      connectedUsers: doc.data().connectedUsers,
    }
  })

  return res.status(200).json({
    status: "OK",
    description: "List of all channel",
    content: listOfChannels,
  })
}

// Create a new channel if it doesn't exist
// If it exists, connect the user to the channel
async function connectToChannel(req: Request, res: Response) {
  const userId = getBearerToken(req.headers.authorization)
  const channelId = req.body.channelId

  let channel = await admin
    .firestore()
    .collection("channels")
    .doc(channelId)
    .get()

  if (channel.exists) {
    if (channel.data()!.connectedUsers.includes(userId)) {
      return res.status(200).json({
        status: "OK",
        description: "User already connected to channel",
      })
    } else {
      await admin
        .firestore()
        .collection("channels")
        .doc(channelId)
        .update({
          connectedUsers: [...channel.data()!.connectedUsers, userId],
        })

      return res.status(200).json({
        status: "OK",
        description: "User successfully connected to channel",
      })
    }
  } else {
    const now = Date.now()

    const newChannel = {
      id: channelId,
      createdAt: now,
      connectedUsers: [userId],
    }
    await admin
      .firestore()
      .collection("channels")
      .doc(channelId)
      .set({
        createdAt: now,
        connectedUsers: [userId],
      })

    return res.status(201).json({
      status: "CREATED",
      description: "Channel successfully created",
      content: newChannel,
    })
  }
}

// Disconnect the user from the channel
async function disconnectFromChannel(req: Request, res: Response) {
  const channelId = req.body.channelId
  const userId = getBearerToken(req.headers.authorization)

  let channel = await admin
    .firestore()
    .collection("channels")
    .doc(channelId)
    .get()

  if (channel.exists) {
    if (channel.data()!.connectedUsers.includes(userId)) {
      await admin
        .firestore()
        .collection("channels")
        .doc(channelId)
        .update({
          connectedUsers: channel
            .data()!
            .connectedUsers.filter((user: string) => user !== userId),
        })

      return res.status(200).json({
        status: "OK",
        description: "User successfully disconnected from channel",
      })
    } else {
      return res.status(200).json({
        status: "OK",
        description: "User already disconnected from channel or not connected",
      })
    }
  } else {
    return res.status(404).json({
      status: "ERROR",
      description: "Channel not found",
    })
  }
}

router.get("/", getAllChannel)
router.use(userRequired, channelValidateBody, deleteEmptyChannels)
router.post("/connect", connectToChannel)
router.post("/disconnect", disconnectFromChannel)

export default router

// import cors from "cors"
import { Request, Response } from "express"
import express from "express"

import { admin, pusher } from "../core"
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

async function getChannel(req: Request, res: Response) {
  const channelId = req.params.channelId

  const channel = await admin
    .firestore()
    .collection("channels")
    .doc(channelId)
    .get()

  if (channel.exists) {
    return res.status(200).json({
      status: "OK",
      description: "Channel retrieved",
      content: channel.data(),
    })
  } else {
    return res.status(404).json({
      status: "ERROR",
      description: "Channel does not exist",
    })
  }
}

async function getChannelUsers(req: Request, res: Response) {
  const channelId = req.params.channelId

  const channel = await admin
    .firestore()
    .collection("channels")
    .doc(channelId)
    .get()

  if (channel.exists) {
    return res.status(200).json({
      status: "OK",
      description: "List of users in channel",
      content: channel.data()!.connectedUsers,
    })
  } else {
    return res.status(404).json({
      status: "ERROR",
      description: "Channel does not exist",
    })
  }
}

// Create a new channel if it doesn't exist
// If it exists, connect the user to the channel
async function connectToChannel(req: Request, res: Response) {
  const userId = getBearerToken(req.headers.authorization)
  const channelId = req.body.channelId

  const channel = await admin
    .firestore()
    .collection("channels")
    .doc(channelId)
    .get()

  const user = await admin.firestore().collection("users").doc(userId).get()

  if (channel.exists) {
    if (channel.data()!.connectedUsers.includes(user.data()!.username)) {
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
          connectedUsers: [
            ...channel.data()!.connectedUsers,
            user.data()!.username,
          ],
        })

      pusher.trigger(`channel.${channelId}`, "connect/disconnect", {
        type: "CONNECT",
        username: user.data()!.username,
        timestamp: Date.now(),
      })

      return res.status(200).json({
        status: "OK",
        description: "User successfully connected to channel",
        content: channel.data(),
      })
    }
  } else {
    const now = Date.now()
    const newChannel = {
      id: channelId,
      createdAt: now,
      connectedUsers: [user.data()!.username],
    }
    await admin
      .firestore()
      .collection("channels")
      .doc(channelId)
      .set({
        createdAt: now,
        connectedUsers: [user.data()!.username],
      })

    pusher.trigger(`channel.${channelId}`, "connect/disconnect", {
      type: "CONNECT",
      username: user.data()!.username,
      timestamp: Date.now(),
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

  const channel = await admin
    .firestore()
    .collection("channels")
    .doc(channelId)
    .get()

  const user = await admin.firestore().collection("users").doc(userId).get()

  if (channel.exists) {
    if (channel.data()!.connectedUsers.includes(user.data()!.username)) {
      await admin
        .firestore()
        .collection("channels")
        .doc(channelId)
        .update({
          connectedUsers: channel
            .data()!
            .connectedUsers.filter(
              (connectedUser: string) => connectedUser !== user.data()!.username
            ),
        })

      await admin.firestore().collection("users").doc(userId).delete()

      pusher.trigger(`channel.${channelId}`, "connect/disconnect", {
        type: "DISCONNECT",
        username: user.data()!.username,
        timestamp: Date.now(),
      })

      return res.status(200).json({
        status: "OK",
        description: "User successfully disconnected from channel",
      })
    } else {
      const channel = await admin
        .firestore()
        .collection("channels")
        .doc(channelId)
        .get()

      return res.status(200).json({
        status: "OK",
        description: "User already disconnected from channel or not connected",
        content: channel.data(),
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
router.get("/:channelId", getChannel)
router.get("/:channelId/users", getChannelUsers)
router.use(userRequired, channelValidateBody, deleteEmptyChannels)
router.post("/connect", connectToChannel)
router.post("/disconnect", disconnectFromChannel)

export default router

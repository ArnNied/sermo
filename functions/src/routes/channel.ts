// import cors from "cors"
import { Request, Response } from "express"
import express from "express"
import moment from "moment"
import { nanoid } from "nanoid"

import { PUSHER, admin } from "../core"
import { channelValidateBody, deleteEmptyChannels } from "../middleware/channel"
import { userRequired } from "../middleware/common"
import { getBearerToken } from "../utils"

const router = express.Router()

// List all available channel
async function getAllChannel(req: Request, res: Response) {
  const query = await admin.firestore().collection("channels").get()

  const connectedUsers = await admin.firestore().collection("users").get()

  const listOfChannels = query.docs.map((channelDoc) => ({
    id: channelDoc.id,
    ...channelDoc.data(),
    connectedUsers: connectedUsers.docs
      .map((userDoc) =>
        userDoc.data().username && userDoc.data().connectedTo === channelDoc.id
          ? userDoc.data().username
          : null
      )
      .filter((username) => username !== null),
  }))

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

  const connectedUsers = await admin
    .firestore()
    .collection("users")
    .where("connectedTo", "==", channelId)
    .get()

  // Check if channel exists
  if (channel.exists) {
    return res.status(200).json({
      status: "OK",
      description: "Channel retrieved",
      content: {
        ...channel.data(),
        connectedUsers: connectedUsers.docs.map(
          (userDoc) => userDoc.data().username
        ),
      },
    })
  } else {
    return res.status(404).json({
      status: "ERROR",
      description: "Channel does not exist",
    })
  }
}

// List all users in a channel
async function getChannelUsers(req: Request, res: Response) {
  const channelId = req.params.channelId

  const channel = await admin
    .firestore()
    .collection("channels")
    .doc(channelId)
    .get()

  const connectedUsers = await admin
    .firestore()
    .collection("users")
    .where("connectedTo", "==", channelId)
    .get()

  if (channel.exists) {
    return res.status(200).json({
      status: "OK",
      description: "List of users in channel",
      content: connectedUsers.docs.map((userDoc) => userDoc.data().username),
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
  const channelId = req.body.channelId
  const username = req.body.username

  // Check if username is valid
  if (!username) {
    return res.status(400).json({
      status: "ERROR",
      description: "Username field is required",
    })
  } else if (typeof username !== "string") {
    return res.status(400).json({
      status: "ERROR",
      description: "Username field must be string",
    })
  } else if (username.includes(" ")) {
    return res.status(400).json({
      status: "ERROR",
      description: "Username cannot contain spaces",
    })
  } else if (username.length > 16) {
    return res.status(400).json({
      status: "ERROR",
      description: "Username field must be less than 16 characters",
    })
  }

  const usernameTaken = await admin
    .firestore()
    .collection("users")
    .where("connectedTo", "==", channelId)
    .where("username", "==", username)
    .get()

  // Check if a username is already taken in the channel
  if (!usernameTaken.empty) {
    return res.status(400).json({
      status: "ERROR",
      description: "Username already taken",
    })
  }

  // Generate a unique id for the user
  let generatedId = `user-${nanoid(16)}`
  while (
    (await admin.firestore().collection("users").doc(generatedId).get()).exists
  ) {
    generatedId = `user-${nanoid(16)}`
  }

  const now = moment().valueOf()
  const newUser = {
    id: generatedId,
    username: username,
    createdAt: now,
    lastActive: now,
  }

  // Create a new user
  await admin.firestore().collection("users").doc(generatedId).set({
    username: username,
    createdAt: now,
    lastActive: now,
    connectedTo: channelId,
  })

  const channel = await admin
    .firestore()
    .collection("channels")
    .doc(channelId)
    .get()

  if (channel.exists) {
    const connectedUsers = await admin
      .firestore()
      .collection("users")
      .where("connectedTo", "==", channelId)
      .get()

    // Send a pusher event to notify the channel that a new user has connected
    PUSHER.trigger(`channel.${channelId}`, "connect/disconnect", {
      type: "CONNECT",
      username: username,
      timestamp: moment().valueOf(),
    })

    return res.status(200).json({
      status: "OK",
      description: "User successfully connected to channel",
      content: {
        channel: {
          id: channelId,
          ...channel.data(),
          connectedUsers: connectedUsers.docs.map(
            (userDoc) => userDoc.data().username
          ),
        },
        user: newUser,
      },
    })
  } else {
    // If channel doesn't exist, create a new channel and connect the user to it
    const now = moment().valueOf()
    const newChannel = {
      id: channelId,
      createdAt: now,
      connectedUsers: [username],
    }
    await admin.firestore().collection("channels").doc(channelId).set({
      createdAt: now,
    })

    return res.status(201).json({
      status: "CREATED",
      description: "Channel successfully created",
      content: {
        channel: newChannel,
        user: newUser,
      },
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
    // Check if user is connected to the channel in the first place
    if (user.data()!.connectedTo === channelId) {
      // Delete the user
      await admin.firestore().collection("users").doc(userId).delete()

      // Send a pusher event to notify the channel that a user has disconnected
      PUSHER.trigger(`channel.${channelId}`, "connect/disconnect", {
        type: "DISCONNECT",
        username: user.data()!.username,
        timestamp: moment().valueOf(),
      })

      return res.status(200).json({
        status: "OK",
        description: "User successfully disconnected from channel",
      })
    } else {
      return res.status(200).json({
        status: "OK",
        description: "User not connected",
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
router.use(channelValidateBody, deleteEmptyChannels)
router.post("/connect", connectToChannel)
router.use(userRequired)
router.post("/disconnect", disconnectFromChannel)

export default router

import { Request, Response } from "express"
import express from "express"
import { nanoid } from "nanoid"

import { admin } from "../core"

const router = express.Router()

// List all user
async function getAllUser(req: Request, res: Response) {
  const query = await admin.firestore().collection("users").get()

  const listOfUsers = query.docs.map((doc) => {
    return {
      id: doc.id,
      username: doc.data().username,
      createdAt: doc.data().createdAt,
      lastActive: doc.data().lastActive,
    }
  })

  return res.status(200).json({
    status: "OK",
    description: "List of all user",
    content: listOfUsers,
  })
}

async function createNewUser(req: Request, res: Response) {
  const username = req.body.username

  if (!username) {
    return res.status(400).json({
      status: "ERROR",
      description: '"username" field is required',
    })
  } else if (typeof username !== "string") {
    return res.status(400).json({
      status: "ERROR",
      description: '"username" field must be string',
    })
  }

  const userExist = await admin
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get()

  if (!userExist.empty) {
    return res.status(400).json({
      status: "ERROR",
      description: "Username already taken",
    })
  }

  let generatedId = `user-${nanoid(16)}`

  while (
    (await admin.firestore().collection("users").doc(generatedId).get()).exists
  ) {
    generatedId = `user-${nanoid(16)}`
  }

  const now = Date.now()

  const newUser = {
    id: generatedId,
    username: username,
    createdAt: now,
    lastActive: now,
  }
  await admin.firestore().collection("users").doc(generatedId).set({
    username: username,
    createdAt: now,
    lastActive: now,
  })

  return res.status(201).json({
    status: "CREATED",
    description: "User successfully created",
    content: newUser,
  })
}

router.get("/", getAllUser)
router.post("/", createNewUser)

export default router

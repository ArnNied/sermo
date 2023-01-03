import { Request, Response } from "express"
import express from "express"

import { admin } from "../core"

const router = express.Router()

// List all user
async function getAllUser(req: Request, res: Response) {
  const query = await admin.firestore().collection("users").get()

  const listOfUsers = query.docs.map((userDoc) => {
    return {
      id: userDoc.id,
      ...userDoc.data(),
    }
  })

  return res.status(200).json({
    status: "OK",
    description: "List of all user",
    content: listOfUsers,
  })
}

router.get("/", getAllUser)

export default router

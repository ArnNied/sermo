import { NextFunction, Request, Response } from "express"

import { admin } from "../core"

// Requires a channelId field in the request body
export async function channelValidateBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const channelId = req.body.channelId

  if (!channelId) {
    return res.status(400).json({
      status: "ERROR",
      description: '"channelId" field are required',
    })
  } else if (typeof channelId !== "string") {
    return res.status(400).json({
      status: "ERROR",
      description: '"channelId" field must be string',
    })
  } else {
    return next()
  }
}

// Delete channels that have no connected users
export async function deleteEmptyChannels(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const emptyChannel = await admin
    .firestore()
    .collection("channels")
    .where("connectedUsers", "==", [])
    .get()

  const batch = admin.firestore().batch()

  emptyChannel.docs.forEach((doc) => {
    batch.delete(doc.ref)
  })

  await batch.commit()

  return next()
}

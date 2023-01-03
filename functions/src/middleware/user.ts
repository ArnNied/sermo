import { NextFunction, Request, Response } from "express"
import moment from "moment"

import { USER_MAX_AGE_IN_MS } from "../config"
import { PUSHER, admin } from "../core"

// Delete users that have not been active for more than 24 hours
export async function deleteStaleUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const staleUsers = await admin
    .firestore()
    .collection("users")
    .where("lastActive", "<", moment().valueOf() - USER_MAX_AGE_IN_MS)
    .get()

  const batch = admin.firestore().batch()

  staleUsers.docs.forEach((userDoc) => {
    const userRef = admin.firestore().collection("users").doc(userDoc.id)

    PUSHER.trigger(
      `channel.${userDoc.data().connectedTo}`,
      "connect/disconnect",
      {
        type: "DISCONNECT",
        username: userDoc.data().username,
        timestamp: moment().valueOf(),
      }
    )

    batch.delete(userRef)
  })

  await batch.commit()

  return next()
}

import { NextFunction, Request, Response } from "express"
import moment from "moment"

import { USER_MAX_AGE_IN_MS } from "../config"
import { admin } from "../core"

// Delete users that have not been active for more than 24 hours
export async function deleteStaleUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const usersToBeDeleted = await admin
    .firestore()
    .collection("users")
    .where("lastActive", "<", moment().valueOf() - USER_MAX_AGE_IN_MS)
    .get()

  const usersToBeDeletedArray = usersToBeDeleted.docs.map(
    (doc) => doc.data().username
  )

  const channelsContainingUsersToBeDeleted = await admin
    .firestore()
    .collection("channels")
    .where(
      "connectedUsers",
      "array-contains-any",
      usersToBeDeletedArray.length > 0 ? usersToBeDeletedArray : [""]
    )
    .get()

  const batch = admin.firestore().batch()

  usersToBeDeleted.docs.forEach((doc) => {
    batch.delete(doc.ref)
  })

  channelsContainingUsersToBeDeleted.docs.forEach((channel) => {
    batch.update(channel.ref, {
      connectedUsers: channel
        .data()
        .connectedUsers.filter(
          (user: string) => !usersToBeDeletedArray.includes(user)
        ),
    })
  })

  await batch.commit()

  return next()
}

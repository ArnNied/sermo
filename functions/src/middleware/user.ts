import { NextFunction, Request, Response } from "express"

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
    .where("lastActive", "<", Date.now() - USER_MAX_AGE_IN_MS)
    .get()

  const usersToBeDeletedArray = usersToBeDeleted.docs.map((doc) => doc.id)

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

  channelsContainingUsersToBeDeleted.docs.forEach((doc) => {
    batch.update(doc.ref, {
      connectedUsers: doc
        .data()
        .connectedUsers.filter(
          (userId: string) =>
            !usersToBeDeleted.docs.map((doc) => doc.id).includes(userId)
        ),
    })
  })

  await batch.commit()

  return next()
}

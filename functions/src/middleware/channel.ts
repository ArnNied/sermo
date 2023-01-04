import {NextFunction, Request, Response} from "express";

import {admin} from "../core";

// Requires a channelId field in the request body
export async function channelValidateBody(
    req: Request,
    res: Response,
    next: NextFunction
) {
  const channelId = req.body.channelId;

  if (!channelId) {
    return res.status(400).json({
      status: "ERROR",
      description: "Channel ID field is required",
    });
  } else if (typeof channelId !== "string") {
    return res.status(400).json({
      status: "ERROR",
      description: "Channel ID field must be string",
    });
  } else if (!channelId.match(/^[a-z0-9-]*$/i)) {
    return res.status(400).json({
      status: "ERROR",
      description:
        "Channel ID must only contain 'a-Z', '0-9' and '-' characters",
    });
  } else if (channelId.length > 32) {
    return res.status(400).json({
      status: "ERROR",
      description: "Channel ID field must be less than 32 characters",
    });
  } else {
    return next();
  }
}

// Delete channels that have no connected users
export async function deleteEmptyChannels(
    req: Request,
    res: Response,
    next: NextFunction
) {
  const users = await admin.firestore().collection("users").get();
  const populatedChannelIds = users.docs.map(
      (userDoc) => userDoc.data().connectedTo
  );

  const channels = await admin.firestore().collection("channels").get();
  const channelIds = channels.docs.map((channelDoc) => channelDoc.id);

  const channelsToDelete = channelIds.filter(
      (channelId) => !populatedChannelIds.includes(channelId)
  );

  const batch = admin.firestore().batch();

  channelsToDelete.forEach((channelId) => {
    const channelRef = admin.firestore().collection("channels").doc(channelId);
    batch.delete(channelRef);
  });

  await batch.commit();

  return next();
}

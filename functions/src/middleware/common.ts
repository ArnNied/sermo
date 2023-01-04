import {NextFunction, Request, Response} from "express";
import moment from "moment";

import {admin} from "../core";
import {getBearerToken} from "../utils";

// Requires a valid user token
// A user token is received when a user is created
export async function userRequired(
    req: Request,
    res: Response,
    next: NextFunction
) {
  if (!req.headers.authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: `Expected (Bearer <token>). Received: ${req.headers.authorization}`, // eslint-disable-line max-len
    });
  }

  const userId = getBearerToken(req.headers.authorization);

  const user = await admin
      .firestore()
      .collection("users")
      .doc(userId || "-")
      .get();

  if (!user.exists) {
    return res.status(404).json({
      status: "ERROR",
      description: "User has not been created",
    });
  } else {
    await admin.firestore().collection("users").doc(userId).update({
      lastActive: moment().valueOf(),
    });
    return next();
  }
}

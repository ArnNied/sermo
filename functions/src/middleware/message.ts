import { NextFunction, Request, Response } from "express"

// Requires a channelId and message field in the request body
export async function preMessageSend(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const channelId = req.body.channelId || ""
  const message = req.body.message || ""

  if (!channelId || !message) {
    return res.status(400).json({
      status: "ERROR",
      description: '"channelId" and "message" fields are required',
    })
  } else if (typeof channelId !== "string" || typeof message !== "string") {
    return res.status(400).json({
      status: "ERROR",
      description: '"channelId" and "message" fields must be string',
    })
  } else {
    return next()
  }
}

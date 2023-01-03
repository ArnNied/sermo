import cors from "cors"
import express from "express"
import * as admin from "firebase-admin"
import Pusher from "pusher"

import { deleteStaleUser } from "./middleware/user"

const app = express()

app.use(express.json())
app.use(cors({ origin: true }))
app.use(deleteStaleUser)

// The Firebase Admin SDK to access Firestore.
admin.initializeApp()

const PUSHER = new Pusher({
  appId: process.env.PUSHER_APP_ID || "your_pusher_app_id",
  key: process.env.PUSHER_KEY || "your_pusher_key",
  secret: process.env.PUSHER_SECRET || "your_pusher_secret",
  cluster: process.env.PUSHER_CLUSTER || "your_pusher_cluster",
  useTLS: true,
})

export { admin, PUSHER, app }

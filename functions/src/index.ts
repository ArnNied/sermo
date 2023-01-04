import * as functions from "firebase-functions";

import {FUNCTIONS_REGION} from "./config";
import {app} from "./core";
import {deleteStaleUser} from "./middleware/user";
import channelRoute from "./routes/channel";
import messageRoute from "./routes/message";
import userRoute from "./routes/user";

app.use(deleteStaleUser);
app.use("/channel", channelRoute);
app.use("/message", messageRoute);
app.use("/user", userRoute);

export default functions.region(FUNCTIONS_REGION).https.onRequest(app);

import { configureStore } from "@reduxjs/toolkit"

import channelReducer from "./channelSlice"
import userReducer from "./userSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    channel: channelReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

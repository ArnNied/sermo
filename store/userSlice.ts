import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface IUserState {
  id: string
  username: string
}

const initialState: IUserState = {
  id: "",
  username: "",
}

export const userSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    updateId: (state, action: PayloadAction<string>) => {
      state.id = action.payload
    },
    updateUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload
    },
  },
})

export const { updateId, updateUsername } = userSlice.actions

export default userSlice.reducer

import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface IChannelState {
  id: string
}

const initialState: IChannelState = {
  id: "",
}

export const channelSlice = createSlice({
  name: "channel",
  initialState: initialState,
  reducers: {
    updateId: (state, action: PayloadAction<string>) => {
      state.id = action.payload
    },
  },
})

export const { updateId } = channelSlice.actions

export default channelSlice.reducer

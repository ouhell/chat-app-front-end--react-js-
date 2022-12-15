import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { HostName } from "../../client/ApiClient";

const ChatSlice = createSlice({
  name: "chatReducer",
  initialState: {
    chatSocket: io(HostName),
    counter: 50000,
  },
  reducers: {
    increment: (state, action) => {
      state.counter = state.counter + 1;
    },
  },
});

export const ChatActions = ChatSlice.actions;

export default ChatSlice;

import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const ChatSlice = createSlice({
  name: "chatReducer",
  initialState: {
    chatSocket: io("http://localhost:5000"),
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

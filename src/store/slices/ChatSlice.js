import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { HostName } from "../../client/ApiClient";

const ChatSlice = createSlice({
  name: "chatReducer",
  initialState: {
    chatSocket: io(HostName),
    isNavOpen: "false",
  },
  reducers: {
    OpenNav: (state, action) => {
      if (state.isNavOpen === "false") {
        state.isNavOpen = "true";
        return;
      }
      state.isNavOpen = "false";
    },
  },
});

export const ChatActions = ChatSlice.actions;

export default ChatSlice;

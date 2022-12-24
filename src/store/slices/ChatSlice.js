import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { HostName } from "../../client/ApiClient";

const socket = io(HostName);
const ChatSlice = createSlice({
  name: "chatReducer",
  initialState: {
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
    emit: function (state, action) {
      const event = action.payload.event;
      const data = action.payload.data;
      socket.emit(event, data);
    },
    off: function (state, action) {
      const event = action.payload.event;

      socket.off(event);
    },
    on: function (state, action) {
      const event = action.payload.event;
      const callback = action.payload.callback;

      socket.on(event, callback);
    },
  },
});

export const ChatActions = ChatSlice.actions;

export default ChatSlice;

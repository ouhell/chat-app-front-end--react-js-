import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { HostName } from "../../client/ApiClient";

type ChatState = Record<string, never>;

const initialState: ChatState = {};

const socket = io(HostName);

const ChatSlice = createSlice({
  name: "chatReducer",
  initialState: structuredClone(initialState),
  reducers: {
    emit: (
      _,
      action: PayloadAction<{
        event: string;
        data: unknown;
      }>,
    ) => {
      const event = action.payload.event;
      const data = action.payload.data;

      socket.emit(event, data);
    },
    off: function (_, action: PayloadAction<{ event: string }>) {
      const event = action.payload.event;

      socket.removeAllListeners(event);
    },
    offAll: () => {
      socket.removeAllListeners();
    },
    on: (
      _,
      {
        payload: { event, callback },
      }: PayloadAction<{ event: string; callback: (...args: any[]) => void }>,
    ) => {
      socket.removeAllListeners(event);
      socket.on(event, callback);
    },
    resetState: (state) => {
      socket.removeAllListeners();
      state = structuredClone(initialState);
      return state;
    },
  },
});

export const ChatActions = ChatSlice.actions;

export default ChatSlice;

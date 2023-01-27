import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { HostName } from "../../client/ApiClient";

const socket = io(HostName);
const ChatSlice = createSlice({
  name: "chatReducer",
  initialState: {
    conversations: {},
  },
  reducers: {
    openNav: (state, action) => {
      state.isNavOpen = "true";
    },
    closeNav: (state, action) => {
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
    setConversationMessages: (state, action) => {
      const { conversation_id, conversationData } = action.payload;
      state.conversations[conversation_id] = conversationData;
    },
    addMessage: (state, action) => {
      const { conversation_id, newMessage } = action.payload;
      let newMessages = [];
      if (state.conversations[conversation_id]) {
        newMessages = [...state.conversations[conversation_id]];
      }

      newMessages.push(newMessage);
      state.conversations[conversation_id] = newMessages;
    },
    replaceMessage: (state, action) => {
      const { conversation_id, id, newMessage } = action.payload;
      if (!state.conversations[conversation_id]) return;
      const newMessages = [...state.conversations[conversation_id]];
      const index = newMessages.findIndex((message) => message._id === id);
      if (index < 0) return;

      newMessages[index] = newMessage;

      state.conversations[conversation_id] = newMessages;
    },
  },
});

export const ChatActions = ChatSlice.actions;

export default ChatSlice;

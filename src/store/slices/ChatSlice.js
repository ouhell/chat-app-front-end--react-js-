import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { HostName } from "../../client/ApiClient";

const socket = io(HostName);
const ChatSlice = createSlice({
  name: "chatReducer",
  initialState: {
    conversations: {},
    contacts: [],
    publicConvos: [],
  },
  reducers: {
    openNav: (state, action) => {
      state.isNavOpen = "true";
    },
    closeNav: (state, action) => {
      state.isNavOpen = "false";
    },

    emit: (state, action) => {
      const event = action.payload.event;
      const data = action.payload.data;
      socket.emit(event, data);
    },
    off: (state, action) => {
      const event = action.payload.event;

      socket.off(event);
    },
    on: (state, action) => {
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
    deleteMessage: (state, action) => {
      const { conversation_id, id } = action.payload;
      if (!state.conversations[conversation_id]) return;
      const newMessages = state.conversations[conversation_id].filter(
        (message) => message._id !== id
      );

      state.conversations[conversation_id] = newMessages;
    },
    setContacts: (state, action) => {
      state.contacts = action.payload;
    },
    addContact: (state, action) => {
      const { newContact } = action.payload;
      const newContacts = [...state.contacts];
      newContacts.push(newContact);
      state.contacts = newContacts;
    },
    removeContact: (state, action) => {
      const { contactId } = action.payload;

      state.contacts = state.contacts.filter(
        (contact) => contact._id !== contactId
      );
    },
    setPublicConvos: (state, action) => {
      state.publicConvos = action.payload;
    },
  },
});

export const ChatActions = ChatSlice.actions;

export default ChatSlice;

import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { HostName } from "../../client/ApiClient";

const initialState = {
  conversations: {},
  contacts: {},
  publicConvos: [],
  requests: {
    loaded: false,
    data: [],
  },
};
const generateState = () => {
  const initialState = {
    conversations: {},
    contacts: {},
    publicConvos: [],
    requests: {
      loaded: false,
      data: [],
    },
  };
  return initialState;
};

const socket = io(HostName);
socket.re;
const ChatSlice = createSlice({
  name: "chatReducer",
  initialState: { ...initialState },
  reducers: {
    emit: (state, action) => {
      const event = action.payload.event;
      const data = action.payload.data;

      socket.emit(event, data);
    },
    off: function (state, action) {
      const event = action.payload.event;

      socket.removeAllListeners(event);
    },
    offAll: () => {
      socket.removeAllListeners();
    },
    on: (state, { payload: { event, callback } }) => {
      socket.removeAllListeners(event);
      socket.on(event, callback);
    },
    setConversation: (state, action) => {
      const { conversation_id, data } = action.payload;
      state.conversations[conversation_id] = data;
    },
    setConversationMessages: (state, action) => {
      const { conversation_id, newMessages } = action.payload;
      if (state.conversations[conversation_id])
        state.conversations[conversation_id].messages = newMessages;
    },
    removeConversation: (state, action) => {
      const { conversationId } = action.payload;
      const newConversations = { ...state.conversations };
      delete newConversations[conversationId];
      state.conversations = newConversations;
    },
    addMessage: (state, action) => {
      const { conversation_id, newMessage } = action.payload;
      let newMessages = [];
      if (state.conversations[conversation_id]) {
        newMessages = [...state.conversations[conversation_id].messages];
        newMessages.push(newMessage);
        state.conversations[conversation_id].messages = newMessages;
      }
    },
    replaceMessage: (state, action) => {
      const { conversation_id, id, newMessage } = action.payload;
      if (!state.conversations[conversation_id]) return;
      const newMessages = [...state.conversations[conversation_id].messages];
      const index = newMessages.findIndex((message) => message._id === id);
      if (index < 0) return;
      newMessage.trueId = newMessage._id;
      newMessage._id = id;
      newMessages[index] = newMessage;

      state.conversations[conversation_id].messages = newMessages;
    },
    deleteMessage: (state, action) => {
      const { conversation_id, id } = action.payload;
      if (!state.conversations[conversation_id]) return;
      const newMessages = state.conversations[conversation_id].messages.filter(
        (message) => message._id !== id
      );

      state.conversations[conversation_id].messages = newMessages;
    },
    setContacts: (state, action) => {
      const contactList = action.payload;
      let newContacts = {};

      contactList.forEach((contact) => {
        newContacts[contact._id] = contact;
      });
      state.contacts = newContacts;
    },
    addContact: (state, action) => {
      const { newContact } = action.payload;
      state.contacts[newContact._id] = newContact;
    },
    removeContact: (state, action) => {
      const { contactId } = action.payload;
      const newContacts = { ...state.contacts };
      delete newContacts[contactId];
      state.contacts = newContacts;
    },
    setPublicConvos: (state, action) => {
      state.publicConvos = action.payload;
    },
    setRequests: (state, action) => {
      const data = action.payload;
      state.requests.data = data;
      state.requests.loaded = true;
    },
    removeRequest: (state, action) => {
      const requestId = action.payload;
      const newRequests = [...state.requests.data];
      const index = newRequests.findIndex((req) => req._id === requestId);
      if (index < 0) return;
      newRequests.splice(index, 1);
      state.requests.data = newRequests;
    },
    addRequest: (state, action) => {
      const newRequest = action.payload;
      const newRequests = [...state.requests.data];
      newRequests.push(newRequest);
      state.requests.data = newRequests;
    },
    resetState: (state, action) => {
      socket.removeAllListeners();
      return generateState();
    },
  },
});

export const ChatActions = ChatSlice.actions;

export default ChatSlice;

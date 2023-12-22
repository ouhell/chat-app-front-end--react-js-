import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { HostName } from "../../client/ApiClient";
import { MessagesPayload } from "../../client/responseTypes/messageResponses";

type ChatState = {
  conversations: {
    [id: string]: {
      conversation: Conversation;
      messages: Message[];
      props: {
        loadedLast: boolean;
      };
    };
  };
  contacts: {
    [id: string]: Contact;
  };
  publicConvos: Conversation[];
  requests: {
    loaded: boolean;
    data: Request[];
  };
};

type AddMessageContent = {
  conversation_id: string;
  newMessage: Message;
};

const initialState: ChatState = {
  conversations: {},
  contacts: {},
  publicConvos: [],
  requests: {
    loaded: false,
    data: [],
  },
};

const socket = io(HostName);

const ChatSlice = createSlice({
  name: "chatReducer",
  initialState: structuredClone(initialState),
  reducers: {
    emit: (
      _,
      action: PayloadAction<{
        event: string;
        data: any;
      }>
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
      }: PayloadAction<{ event: string; callback: (...args: any[]) => any }>
    ) => {
      socket.removeAllListeners(event);
      socket.on(event, callback);
    },
    setConversation: (state, action: PayloadAction<MessagesPayload>) => {
      const { conversation, messages } = action.payload;
      const set = new Set<string>();
      const newMessages = [
        ...messages.data,
        ...(state.conversations[conversation._id]?.messages ?? []),
      ].filter((msg) => {
        if (set.has(msg._id)) return false;
        set.add(msg._id);
        return true;
      });

      state.conversations[conversation._id] = {
        conversation: conversation,
        messages: newMessages,
        props: {
          loadedLast:
            !!state.conversations[conversation._id]?.props.loadedLast ||
            messages.isLastPage,
        },
      };
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
    addMessage: (state, action: PayloadAction<AddMessageContent>) => {
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
    setContacts: (state, action: PayloadAction<Contact[]>) => {
      const contactList = action.payload;
      const newContacts: ChatState["contacts"] = {};

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
    setUserBanned: (
      state,
      action: PayloadAction<{
        bannedUser: string;
        conversationId: string;
      }>
    ) => {
      const { bannedUser, conversationId } = action.payload;
      if (!state.conversations[conversationId]) return;
      state.conversations[conversationId].conversation.blocked.push(bannedUser);
    },
    setUserUnbanned: (
      state,
      action: PayloadAction<{
        bannedUser: string;
        conversationId: string;
      }>
    ) => {
      const { bannedUser, conversationId } = action.payload;
      if (!state.conversations[conversationId]) return;
      state.conversations[conversationId].conversation.blocked =
        state.conversations[conversationId].conversation.blocked.filter(
          (usr) => usr !== bannedUser
        );
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

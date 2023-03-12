import axios from "axios";

const isdev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export const HostName = isdev
  ? "http://localhost:5000"
  : window.location.origin;

console.log("Hostname", HostName);

export const getConversation = (conversationId, accessToken) => {
  return axios.get("api/messagerie/messages/" + conversationId, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};

export const sendTextMessage = (message, conversationId, accessToken) => {
  return axios.post(
    "api/messagerie/messages/" + conversationId,
    {
      message,
    },
    {
      headers: {
        authorization: "Bearer " + accessToken,
      },
    }
  );
};

export const sendImage = (formData, conversationId, accessToken) => {
  return axios.post("api/messagerie/image/" + conversationId, formData, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const sendVoiceMessage = (formData, conversationId, accessToken) => {
  return axios.post("api/messagerie/voice/" + conversationId, formData, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};

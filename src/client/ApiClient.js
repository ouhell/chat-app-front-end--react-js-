import axios from "axios";

const isdev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export const HostName = isdev
  ? "http://localhost:4000"
  : window.location.origin;

console.log("Hostname", HostName);

export const getConversation = (conversationId, accessToken) => {
  return axios.get("api/messages/" + conversationId, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};

export const sendTextMessage = (message, conversationId, accessToken) => {
  return axios.post(
    "api/messages/" + conversationId,
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
  return axios.post(`api/messages/${conversationId}/image`, formData, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const sendVoiceMessage = (formData, conversationId, accessToken) => {
  return axios.post(`api/messages/${conversationId}/voice`, formData, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const deleteMessageApi = (accessToken, messageId) => {
  return axios.delete("api/messages/" + messageId, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};

export const getPublicConversations = (accessToken) => {
  return axios.get("api/users/conversations/public ", {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};

export const getContacts = (accessToken) => {
  return axios.get("api/users/contacts", {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const addContact = (accessToken, requestId) => {
  return axios.post("api/users/contacts/" + requestId, null, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const deleteContact = (accessToken, contactId) => {
  return axios.delete("api/users/contacts/" + contactId, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};

export const blackListUser = (accessToken, userId) => {
  return axios.patch(`/contacts/${userId}/blacklist`, null, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const blockContact = (accessToken, contactId) => {
  return axios.patch(`/contacts/${contactId}/block`, null, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const unblockContact = (accessToken, contactId) => {
  return axios.patch(`/contacts/${contactId}/unblock`, null, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};

export const getContactRequests = (accessToken) => {
  return axios.get("api/users/requests", {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const addContactRequest = (accessToken, destinatorId) => {
  return axios.post("/api/users/requests/" + destinatorId, null, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const deleteContactRequest = (accessToken, requestId) => {
  return axios.delete("api/users/requests/" + requestId, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};

export const getContactCandidates = (accessToken, searchtext) => {
  return axios.get(
    "/api/users/candidates/contacts?search=" + searchtext.trim(),
    {
      headers: {
        authorization: "Bearer " + accessToken,
      },
    }
  );
};

export const getProfileData = (accessToken) => {
  return axios.get("api/users/profile", {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const updateProfileData = (accessToken, updateData) => {
  return axios.patch("api/users/profile", updateData, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const updateProfilePicture = (accessToken, image) => {
  const data = new FormData();
  data.append("profile_pic", image);

  return axios.put("api/users/profile/picture", data, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};

export const getContactProfileData = (accessToken, conversationId) => {
  return axios.get(`/api/users/profile/${conversationId}/contact`, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};

export const apiLogin = (signinData) => {
  return axios.post("api/auth/login", {
    identifier: signinData.identifier.value.trim(),
    password: signinData.password.value.trim(),
  });
};
export const apiSignup = (userData) => {
  return axios.post("api/auth/signup", userData);
};
export const apiCheckUsernameExists = (username) => {
  return axios.get("/api/auth/check/username/" + username);
};
export const apiCheckEmailExists = (email) => {
  return axios.get("/api/auth/check/email/" + email);
};

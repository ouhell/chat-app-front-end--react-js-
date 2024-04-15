import axios from "axios";
import { MessagesPayload } from "./responseTypes/messageResponses";

const isdev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export const HostName = isdev
  ? "http://192.168.1.5:8080"
  : window.location.origin;

console.log("host :::", HostName);

console.log("Hostname", HostName);

export const getConversation = (
  conversationId: string,
  accessToken: string,
  params?: {
    skip: number;
    [key: string]: string | number;
  }
) => {
  const urlParams = new URLSearchParams();
  if (params)
    for (const key in params) {
      urlParams.append(key, params[key] as string);
    }

  return axios.get<MessagesPayload>(
    "api/messages/" + conversationId + "?" + urlParams.toString(),
    {
      headers: {
        authorization: "Bearer " + accessToken,
      },
    }
  );
};

export const sendTextMessage = (
  message: string,
  conversationId: string,
  accessToken: string
) => {
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

export const sendImage = (
  formData: FormData,
  conversationId: string,
  accessToken: string
) => {
  return axios.post(`api/messages/${conversationId}/image`, formData, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const sendVoiceMessage = (
  formData: FormData,
  conversationId: string,
  accessToken: string
) => {
  return axios.post(`api/messages/${conversationId}/voice`, formData, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const deleteMessageApi = (accessToken: string, messageId: string) => {
  return axios.delete("api/messages/" + messageId, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};

export const getPublicConversations = (accessToken: string) => {
  return axios.get("api/users/conversations/public ", {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};

export const getContacts = (accessToken: string) => {
  return axios.get("api/users/contacts", {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const addContact = (accessToken: string, requestId: string) => {
  return axios.post("api/users/contacts/" + requestId, null, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const deleteContact = (accessToken: string, contactId: string) => {
  return axios.delete("api/users/contacts/" + contactId, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};

export const blackListUser = (accessToken: string, userId: string) => {
  return axios.patch(`/api/users//contacts/${userId}/blacklist`, null, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const blockContact = (accessToken: string, contactId: string) => {
  return axios.patch(`/api/users/contacts/${contactId}/block`, null, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const unblockContact = (accessToken: string, contactId: string) => {
  return axios.patch(`/api/users/contacts/${contactId}/unblock`, null, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};

export const getContactRequests = (accessToken: string) => {
  return axios.get("api/users/requests", {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const addContactRequest = (
  accessToken: string,
  destinatorId: string
) => {
  return axios.post("/api/users/requests/" + destinatorId, null, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const deleteContactRequest = (
  accessToken: string,
  requestId: string
) => {
  return axios.delete("api/users/requests/" + requestId, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};

export const getContactCandidates = (
  accessToken: string,
  searchtext: string
) => {
  return axios.get(
    "/api/users/candidates/contacts?search=" + searchtext.trim(),
    {
      headers: {
        authorization: "Bearer " + accessToken,
      },
    }
  );
};

export const getProfileData = (accessToken: string) => {
  return axios.get("api/users/profile", {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const updateProfileData = (
  accessToken: string,
  updateData: { [key: string]: string }
) => {
  return axios.patch("api/users/profile", updateData, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};
export const updateProfilePicture = (accessToken: string, image: File) => {
  const data = new FormData();
  data.append("profile_pic", image);

  return axios.put("api/users/profile/picture", data, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};

export const getContactProfileData = (
  accessToken: string,
  conversationId: string
) => {
  return axios.get(`/api/users/profile/${conversationId}/contact`, {
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
};

export const apiLogin = (signinData: {
  identifier: string;
  password: string;
}) => {
  return axios.post("api/auth/login", {
    identifier: signinData.identifier.trim(),
    password: signinData.password.trim(),
  });
};

export const oauthLogin = (id_token = "<none>") => {
  return axios.post("/api/auth/login/oauth/google", {
    id_token: id_token,
  });
};
export const apiSignup = (userData: {
  username: string;
  personal_name: string;
  email: string;
  password: string;
}) => {
  return axios.post("api/auth/signup", userData);
};
export const apiCheckUsernameExists = (username: string) => {
  return axios.get("/api/auth/check/username/" + username);
};
export const apiCheckEmailExists = (email: string) => {
  return axios.get("/api/auth/check/email/" + email);
};

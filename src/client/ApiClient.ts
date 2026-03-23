import axios from "axios";
import { MessagesPayload } from "./responseTypes/messageResponses";
import type { UserData } from "../store/slices/AuthSlice";

const isdev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export const HostName = isdev
  ? "http://localhost:8080"
  : window.location.origin;

console.log("host :::", HostName);

console.log("Hostname", HostName);

export const getConversation = (
  conversationId: string,

  params?: {
    skip: number;
    [key: string]: string | number;
  },
) => {
  const urlParams = new URLSearchParams();
  if (params)
    for (const key in params) {
      urlParams.append(key, params[key] as string);
    }

  return axios.get<MessagesPayload>(
    "api/messages/" + conversationId + "?" + urlParams.toString(),
    {
      withCredentials: true,
    },
  );
};

export const sendTextMessage = (message: string, conversationId: string) => {
  return axios.post(
    "api/messages/" + conversationId,
    {
      message,
    },
    {
      withCredentials: true,
    },
  );
};

export const sendImage = (formData: FormData, conversationId: string) => {
  return axios.post(`api/messages/${conversationId}/image`, formData, {
    withCredentials: true,
  });
};
export const sendVoiceMessage = (
  formData: FormData,
  conversationId: string,
) => {
  return axios.post(`api/messages/${conversationId}/voice`, formData, {
    withCredentials: true,
  });
};
export const deleteMessageApi = (messageId: string) => {
  return axios.delete("api/messages/" + messageId, {
    withCredentials: true,
  });
};

export const getPublicConversations = () => {
  return axios.get("api/users/conversations/public ", {
    withCredentials: true,
  });
};

export const getContacts = () => {
  return axios.get("api/users/contacts", {
    withCredentials: true,
  });
};
export const addContact = (requestId: string) => {
  return axios.post("api/users/contacts/" + requestId, null, {
    withCredentials: true,
  });
};
export const deleteContact = (contactId: string) => {
  return axios.delete("api/users/contacts/" + contactId, {
    withCredentials: true,
  });
};

export const blackListUser = (userId: string) => {
  return axios.patch(`/api/users//contacts/${userId}/blacklist`, null, {
    withCredentials: true,
  });
};
export const blockContact = (contactId: string) => {
  return axios.patch(`/api/users/contacts/${contactId}/block`, null, {
    withCredentials: true,
  });
};
export const unblockContact = (contactId: string) => {
  return axios.patch(`/api/users/contacts/${contactId}/unblock`, null, {
    withCredentials: true,
  });
};

export const getContactRequests = () => {
  return axios.get("api/users/requests", {
    withCredentials: true,
  });
};
export const addContactRequest = (destinatorId: string) => {
  return axios.post("/api/users/requests/" + destinatorId, null, {
    withCredentials: true,
  });
};
export const deleteContactRequest = (requestId: string) => {
  return axios.delete("api/users/requests/" + requestId, {
    withCredentials: true,
  });
};

export const getContactCandidates = (searchtext: string) => {
  return axios.get(
    "/api/users/candidates/contacts?search=" + searchtext.trim(),
    {
      withCredentials: true,
    },
  );
};

export const getProfileData = () => {
  return axios.get("api/users/profile", {
    withCredentials: true,
  });
};
export const updateProfileData = (updateData: { [key: string]: string }) => {
  return axios.patch("api/users/profile", updateData, {
    withCredentials: true,
  });
};
export const updateProfilePicture = (image: File) => {
  const data = new FormData();
  data.append("profile_pic", image);

  return axios.put("api/users/profile/picture", data, {
    withCredentials: true,
  });
};

export const getContactProfileData = (conversationId: string) => {
  return axios.get(`/api/users/profile/${conversationId}/contact`, {
    withCredentials: true,
  });
};

export const apiRefresh = () => {
  return axios.post<UserData>("api/auth/refresh", null, {
    withCredentials: true,
  });
};

export const apiLogin = (signinData: {
  identifier: string;
  password: string;
}) => {
  return axios.post(
    "api/auth/login",
    {
      identifier: signinData.identifier.trim(),
      password: signinData.password.trim(),
    },
    {
      withCredentials: true,
    },
  );
};

export const apiLogout = () => {
  return axios.post("api/auth/logout", null, {
    withCredentials: true,
  });
};

export const oauthLogin = (id_token = "<none>") => {
  return axios.post<UserData>(
    "/api/auth/login/oauth/google",
    {
      id_token: id_token,
    },
    {
      withCredentials: true,
    },
  );
};
export const apiSignup = (userData: {
  username: string;
  personal_name: string;
  email: string;
  password: string;
}) => {
  return axios.post("api/auth/signup", userData, {
    withCredentials: true,
  });
};
export const apiCheckUsernameExists = (username: string) => {
  return axios.get("/api/auth/check/username/" + username);
};
export const apiCheckEmailExists = (email: string) => {
  return axios.get("/api/auth/check/email/" + email);
};

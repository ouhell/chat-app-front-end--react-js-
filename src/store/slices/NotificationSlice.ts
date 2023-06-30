import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";

const initialState = {};
const generateState = () => {
  const initialState = {};
  return initialState;
};

type NotificationConfig = {
  message: string;
  type: "success" | "info" | "error" | "warning";
};

/* const [api, contextHolder] = notification.useNotification(); */
const NotificationSlice = createSlice({
  name: "notificationReducer",
  initialState: { ...initialState },
  reducers: {
    notify: function (_, action: PayloadAction<NotificationConfig>) {
      notification[action.payload.type]({
        message: action.payload.message,
      });
    },
    resetState: (state) => {
      state = structuredClone(generateState());
      return state;
    },
  },
});

export const NotifActions = NotificationSlice.actions;

export default NotificationSlice;

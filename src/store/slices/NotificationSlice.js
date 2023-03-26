import { createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";

const initialState = {};
const generateState = () => {
  const initialState = {};
  return initialState;
};

/* const [api, contextHolder] = notification.useNotification(); */
const NotificationSlice = createSlice({
  name: "notificationReducer",
  initialState: { ...initialState },
  reducers: {
    notify: function (state, action) {
      notification[action.payload.type]({
        message: action.payload.message,
      });
    },
    resetState: (state, action) => {
      return generateState();
    },
  },
});

export const NotifActions = NotificationSlice.actions;

export default NotificationSlice;

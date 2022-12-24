import { createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";

/* const [api, contextHolder] = notification.useNotification(); */
const NotificationSlice = createSlice({
  name: "notificationReducer",
  initialState: {
    /* api,
    contextHolder, */
  },
  reducers: {
    notify: function (state, action) {
      notification[action.payload.type]({
        message: action.payload.message,
      });
    },
  },
});

export const NotifActions = NotificationSlice.actions;

export default NotificationSlice;

import { configureStore } from "@reduxjs/toolkit";
import AuthenticationSlice from "./slices/authenticationSlice";
import ChatSlice from "./slices/ChatSlice";
import NotificationSlice from "./slices/NotificationSlice";
const Store = configureStore({
  reducer: {
    chat: ChatSlice.reducer,
    auth: AuthenticationSlice.reducer,
    notif: NotificationSlice.reducer,
  },
  middleware: (getDefault) => {
    return getDefault({
      serializableCheck: {
        ignoreActions: [ChatSlice.actions],
      },
    });
  },
});
export default Store;

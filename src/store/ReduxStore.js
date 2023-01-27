import { configureStore } from "@reduxjs/toolkit";
import AuthenticationSlice from "./slices/authenticationSlice";
import ChatSlice from "./slices/ChatSlice";
import NotificationSlice from "./slices/NotificationSlice";
import ComponentSlice from "./slices/ComponentSlice";
const Store = configureStore({
  reducer: {
    chat: ChatSlice.reducer,
    auth: AuthenticationSlice.reducer,
    notif: NotificationSlice.reducer,
    component: ComponentSlice.reducer,
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

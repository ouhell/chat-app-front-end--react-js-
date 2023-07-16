import { configureStore } from "@reduxjs/toolkit";
import AuthenticationSlice from "./slices/AuthSlice";
import ChatSlice from "./slices/ChatSlice";
import NotificationSlice from "./slices/NotificationSlice";
import ComponentSlice from "./slices/ComponentSlice";
const store = configureStore({
  reducer: {
    chat: ChatSlice.reducer,
    auth: AuthenticationSlice.reducer,
    notif: NotificationSlice.reducer,
    component: ComponentSlice.reducer,
  },
  middleware: (getDefault) => {
    return getDefault({
      serializableCheck: {
        ignoreActions: true,
      },
    });
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;

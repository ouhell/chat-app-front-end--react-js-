import { configureStore } from "@reduxjs/toolkit";

import ChatSlice from "./slices/ChatSlice";
const Store = configureStore({
  reducer: ChatSlice.reducer,
  middleware: (getDefault) => {
    return getDefault({
      serializableCheck: {
        ignoreActions: [ChatSlice.actions.OpenNav],
      },
    });
  },
});
export default Store;

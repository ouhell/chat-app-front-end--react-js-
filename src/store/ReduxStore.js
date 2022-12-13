import { configureStore } from "@reduxjs/toolkit";
import ChatSlice from "./slices/ChatSlice";
const Store = configureStore({
  reducer: ChatSlice.reducer,
});
export default Store;

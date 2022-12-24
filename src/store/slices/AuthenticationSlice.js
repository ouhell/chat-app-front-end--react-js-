import { createSlice } from "@reduxjs/toolkit";

const AuthenticationSlice = createSlice({
  name: "authenticationReducer",
  initialState: {
    userData: JSON.parse(localStorage.getItem("userData")),
  },

  reducers: {
    login: function (state, action) {
      localStorage.setItem("userData", JSON.stringify(action.payload));
      state.userData = action.payload;
    },
    logout: function (state) {
      localStorage.removeItem("userData");
      state.userData = null;
    },
  },
});

export const AuthActions = AuthenticationSlice.actions;

export default AuthenticationSlice;

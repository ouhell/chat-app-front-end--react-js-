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
    setProfilePicture: (state, action) => {
      console.log("chhhhhhhhhhaaaaaaaaaaaaange profile PIC");
      localStorage.setItem(
        "userData",
        JSON.stringify({ ...state.userData, profile_picture: action.payload })
      );

      const newUserData = { ...state.userData };
      newUserData.profile_picture = action.payload;
      state.userData = newUserData;
    },
    setUsername: function (state, action) {
      console.log("chhhhhhhhhhaaaaaaaaaaaaange userNAME");
      localStorage.setItem(
        "userData",
        JSON.stringify({ ...state.userData, username: action.payload })
      );
      const newUserData = { ...state.userData };
      newUserData.username = action.payload;
      state.userData = newUserData;
    },
  },
});

export const AuthActions = AuthenticationSlice.actions;

export default AuthenticationSlice;

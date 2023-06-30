import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type UserData = {
  access_token: string;
  userRole: string;
  username: string;
  userId: string;
  profile_picture: string;
};

type AuthenticationState = {
  userData: UserData | null;
};

const initiate = (): AuthenticationState => {
  let userData: UserData | null = null;
  try {
    const stringifiedUserData = localStorage.getItem("userData");
    if (stringifiedUserData) userData = JSON.parse(stringifiedUserData);
  } catch (err) {
    localStorage.removeItem("userData");
  }
  return {
    userData: userData,
  };
};

const initialState: AuthenticationState = initiate();

const AuthenticationSlice = createSlice({
  name: "authenticationReducer",
  initialState: structuredClone(initialState),

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
      localStorage.setItem(
        "userData",
        JSON.stringify({ ...state.userData, profile_picture: action.payload })
      );

      const newUserData = structuredClone(state.userData) as UserData;
      newUserData.profile_picture = action.payload;
      state.userData = newUserData;
    },
    setUsername: function (state, action: PayloadAction<string>) {
      localStorage.setItem(
        "userData",
        JSON.stringify({ ...state.userData, username: action.payload })
      );
      const newUserData = structuredClone(state.userData) as UserData;
      newUserData.username = action.payload;
      state.userData = newUserData;
    },
    resetState: (state) => {
      state = structuredClone(initiate());
      return state;
    },
  },
});

export const AuthActions = AuthenticationSlice.actions;

export default AuthenticationSlice;

import { createSlice } from "@reduxjs/toolkit";

const ComponentSlice = createSlice({
  name: "componentReducer",
  initialState: {
    isNavOpen: "false",
  },
  reducers: {
    openNav: (state, action) => {
      state.isNavOpen = "true";
    },
    closeNav: (state, action) => {
      state.isNavOpen = "false";
    },
  },
});

export const ComponentActions = ComponentSlice.actions;

export default ComponentSlice;

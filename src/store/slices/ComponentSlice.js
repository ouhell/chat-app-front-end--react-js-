import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNavOpen: "false",
};

const ComponentSlice = createSlice({
  name: "componentReducer",
  initialState: initialState,
  reducers: {
    openNav: (state, action) => {
      state.isNavOpen = "true";
    },
    closeNav: (state, action) => {
      state.isNavOpen = "false";
    },
    resetState: (state, action) => {
      state = initialState;
    },
  },
});

export const ComponentActions = ComponentSlice.actions;

export default ComponentSlice;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNavOpen: false,
};

const ComponentSlice = createSlice({
  name: "componentReducer",
  initialState: structuredClone(initialState),
  reducers: {
    openNav: (state) => {
      state.isNavOpen = true;
    },
    closeNav: (state) => {
      state.isNavOpen = false;
    },
    resetState: (state) => {
      state = structuredClone(initialState);
      return state;
    },
  },
});

export const ComponentActions = ComponentSlice.actions;

export default ComponentSlice;

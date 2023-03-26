import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNavOpen: false,
};
const generateState = () => {
  const initialState = {
    isNavOpen: false,
  };
  return initialState;
};

const ComponentSlice = createSlice({
  name: "componentReducer",
  initialState: generateState(),
  reducers: {
    openNav: (state, action) => {
      state.isNavOpen = true;
    },
    closeNav: (state, action) => {
      state.isNavOpen = false;
    },
    resetState: (state, action) => {
      return generateState();
    },
  },
});

export const ComponentActions = ComponentSlice.actions;

export default ComponentSlice;

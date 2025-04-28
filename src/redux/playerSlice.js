import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  color: "#ff0000",
  score: 0,
  img: "",
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    login: (state, action) => {
      state.name = action.payload.name;
      state.color = action.payload.color;
      state.img = action.payload.img;
    },
    incrementScore: (state) => {
      state.score += 1;
    },
  },
});
export const { login, incrementScore } = playerSlice.actions;
export default playerSlice.reducer;

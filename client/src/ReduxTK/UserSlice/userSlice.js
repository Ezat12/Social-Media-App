import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const userSlice = createSlice({
  name: "UserSlice",
  initialState,
  reducers: {
    userRegister: (state, action) => {
      return state = action.payload;
    },
  },
});

export const { userRegister } = userSlice.actions;

export default userSlice.reducer;

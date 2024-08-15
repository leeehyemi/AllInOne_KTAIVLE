import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: null,
    isLoggedIn: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload;
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      state.email = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
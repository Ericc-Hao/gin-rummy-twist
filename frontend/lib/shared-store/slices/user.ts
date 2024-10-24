import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string;
  // password: string;
}

const initialState: UserState = {
  username: '',
  // password: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<{ username: string; password: string }>) => {
      state.username = action.payload.username;
      // state.password = action.payload.password;
    },
    clearUserInfo: (state) => {
      state.username = '';
      // state.password = '';
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;

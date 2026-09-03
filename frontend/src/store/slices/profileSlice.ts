import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IProfile } from '../../types/profile';

interface ProfileState {
  profile: IProfile | null;
  isLoading: boolean;
}

const initialState: ProfileState = {
  profile: {
    username: 'Test',
    firstName: 'Test',
    createdAt: Date.now(),
    lastName: 'Test',
    email: 'test@mail.ru',
    id: '42343',
    link: 'https://gergwejogj',
  },
  isLoading: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<IProfile>) => {
      state.profile = action.payload;
    },
    updateProfileFields: (state, action: PayloadAction<Partial<IProfile>>) => {
      if (state.profile) {
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
      }
    },
    clearProfile: (state) => {
      state.profile = null;
    },
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setProfile, updateProfileFields, clearProfile, setProfileLoading } =
  profileSlice.actions;
export default profileSlice.reducer;

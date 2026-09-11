import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IProfile, IProfileStats } from '../../types/profile';

interface ProfileState {
  profile: IProfile | null;
  stats: IProfileStats | null;
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
  // profile: null,
  // stats: null,
  stats: {
    raiting: 4,
    activeSkills: 2,
    closedSkills: 2,
    uniquePartners: 2,
    successSkills: 50,
  },
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
    setProfileStats: (state, action: PayloadAction<IProfileStats>) => {
      state.stats = action.payload;
    },
  },
});

export const { setProfile, updateProfileFields, clearProfile, setProfileStats } =
  profileSlice.actions;
export default profileSlice.reducer;

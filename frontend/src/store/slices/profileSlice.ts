import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IProfile, IProfileStats, IProfileView } from '../../types/profile';
import { MockProfile, MockProfileStats, MockProfileView } from '../../mock/profile';

interface ProfileState {
  profile: IProfile | null;
  stats: IProfileStats | null;
  profileView: IProfileView | null;
}

const initialState: ProfileState = {
  // profile: null,
  // stats: null,
  // profileView: null,

  profile: MockProfile,
  stats: MockProfileStats,
  profileView: MockProfileView[1],
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
    setProfileView: (state, action: PayloadAction<IProfileView>) => {
      state.profileView = action.payload;
    },
    clearProfileView: (state) => {
      state.profileView = null;
    },
  },
});

export const {
  setProfile,
  updateProfileFields,
  clearProfile,
  setProfileStats,
  setProfileView,
  clearProfileView,
} = profileSlice.actions;
export default profileSlice.reducer;

import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IProfile } from '../../types/profile';
import { authAPI } from '../../api/auth';

interface ProfileState {
  profile: IProfile | null;
  isLoading: boolean;
  // true после первой попытки получить профиль — до неё роутер не знает, вошёл ли пользователь
  isInitialized: boolean;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  isInitialized: false,
};

// Гость — не ошибка: при отсутствии сессии профиль просто остаётся пустым
export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
  try {
    return await authAPI.getMe();
  } catch {
    return null;
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<IProfile>) => {
      state.profile = action.payload;
      state.isInitialized = true;
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isLoading = false;
        state.isInitialized = true;
      });
  },
});

export const { setProfile, updateProfileFields, clearProfile, setProfileLoading } =
  profileSlice.actions;
export default profileSlice.reducer;

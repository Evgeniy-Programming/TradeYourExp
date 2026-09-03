import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import skillReducer from './slices/skillSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    skill: skillReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

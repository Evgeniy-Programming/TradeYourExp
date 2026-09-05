import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import skillReducer from './slices/skillSlice';
import appReducer from './slices/appSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    profile: profileReducer,
    skill: skillReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

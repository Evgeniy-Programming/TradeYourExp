import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IErrorMessage } from '../../types/error';
import type { IAlert } from '../../types/alert';

interface SkillState {
  alert: IAlert | null;
}

const initialState: SkillState = {
  alert: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<IErrorMessage>) => {
      state.alert = {
        type: 'error',
        ...action.payload,
      };
    },
  },
});

export const { setError } = appSlice.actions;
export default appSlice.reducer;

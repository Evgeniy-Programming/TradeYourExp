import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IErrorMessage } from '../../types/error';
import type { IAlert } from '../../types/alert';
import { parseError } from '../../utils/parseError';

interface SkillState {
  alert: IAlert | null;
}

const initialState: SkillState = {
  alert: null,
};

export const setErrorWithTimeout = createAsyncThunk(
  'app/setErrorWithTimeout',
  async (error: unknown, { dispatch }) => {
    dispatch(appSlice.actions.setError(parseError(error)));

    await new Promise((resolve) => setTimeout(resolve, 5000));

    dispatch(appSlice.actions.clearAlert());
  }
);

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
    clearAlert: (state) => {
      state.alert = null;
    },
  },
});

export const { clearAlert } = appSlice.actions;
export default appSlice.reducer;

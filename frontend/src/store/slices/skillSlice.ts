import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IEditSkill, ISkill, ISkillHistory, ISkillQuery } from '../../types/skill';
import { skillAPI } from '../../api/skill';

interface SkillState {
  skills: ISkill[];
  historySkills: ISkillHistory[];
  editSkill: IEditSkill | null;
  isLoading: boolean;
}

const initialState: SkillState = {
  skills: [],
  historySkills: [],
  editSkill: null,
  isLoading: false,
};

export const fetchSkills = createAsyncThunk('skill/fetchSkills', (query: ISkillQuery) =>
  skillAPI.getSkills(query)
);

export const fetchHistorySkills = createAsyncThunk('skill/fetchHistorySkills', () =>
  skillAPI.getMySkills()
);

export const skillSlice = createSlice({
  name: 'skill',
  initialState,
  reducers: {
    initEditSkill: (state) => {
      state.editSkill = {
        category: 'Наука, бизнес и саморазвитие',
        description: '',
        skill: '',
        exchange: '',
        contactType: 'site',
        contactValue: null,
      };
    },
    removeEditSkill: (state) => {
      state.editSkill = null;
    },
    setEditSkillField: (state, action: PayloadAction<Partial<IEditSkill>>) => {
      if (state.editSkill) {
        state.editSkill = {
          ...state.editSkill,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.skills = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchSkills.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchHistorySkills.fulfilled, (state, action) => {
        state.historySkills = action.payload;
      });
  },
});

export const { initEditSkill, setEditSkillField } = skillSlice.actions;
export default skillSlice.reducer;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IEditSkill, ISkill, ISkillHistory, SkillHistorySearchType } from '../../types/skill';
import { MockSkills, MockSkillsHistory } from '../../mock/skills';

interface SkillState {
  skills: ISkill[];
  historySkills: ISkillHistory[];
  historySkillsFilter: SkillHistorySearchType;
  editSkill: IEditSkill | null;
}

const initialState: SkillState = {
  skills: MockSkills,
  historySkills: MockSkillsHistory,
  historySkillsFilter: 'ALL',
  editSkill: null,
};

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
    setHistorySkillsFilter: (state, action: PayloadAction<SkillHistorySearchType>) => {
      state.historySkillsFilter = action.payload;
    },
  },
});

export const { initEditSkill, setEditSkillField, setHistorySkillsFilter } = skillSlice.actions;
export default skillSlice.reducer;

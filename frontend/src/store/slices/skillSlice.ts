import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IEditSkill, ISkill, ISkillHistory } from '../../types/skill';
import { MockSkills, MockSkillsHistory } from '../../mock/skills';

interface SkillState {
  skills: ISkill[];
  historySkills: ISkillHistory[];
  editSkill: IEditSkill | null;
}

const initialState: SkillState = {
  skills: MockSkills,
  historySkills: MockSkillsHistory,
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
  },
});

export const { initEditSkill, setEditSkillField } = skillSlice.actions;
export default skillSlice.reducer;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IEditSkill, ISkill } from '../../types/skill';
import { MockSkills } from '../../mock/skills';

interface SkillState {
  skills: ISkill[];
  editSkill: IEditSkill | null;
}

const initialState: SkillState = {
  skills: MockSkills,
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
        media: '',
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

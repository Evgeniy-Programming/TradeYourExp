import { createSlice } from '@reduxjs/toolkit';
import type { ISkill } from '../../types/skill';
import { MockSkills } from '../../mock/skills';

interface SkillState {
  skills: ISkill[];
}

const initialState: SkillState = {
  skills: MockSkills,
};

export const skillSlice = createSlice({
  name: 'skill',
  initialState,
  reducers: {},
});

// export const { } = skillSlice.actions;
export default skillSlice.reducer;

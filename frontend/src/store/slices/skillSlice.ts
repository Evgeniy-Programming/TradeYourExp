import { createSlice } from '@reduxjs/toolkit';
import type { ISkill } from '../../types/skill';

interface SkillState {
  skills: ISkill[];
}

const initialState: SkillState = {
  skills: [
    {
      id: '1',
      skill: 'Test skill',
      username: 'tester',
      category: 'test',
      exchange: 'Test skill 2',
    },
    {
      id: '12',
      skill: 'Test skill',
      username: 'tester',
      category: 'test',
      exchange: 'Test skill 2',
    },
    {
      id: '13',
      skill: 'Test skill',
      username: 'tester',
      category: 'test',
      exchange: 'Test skill 2',
    },
  ],
};

export const skillSlice = createSlice({
  name: 'skill',
  initialState,
  reducers: {},
});

// export const { } = skillSlice.actions;
export default skillSlice.reducer;

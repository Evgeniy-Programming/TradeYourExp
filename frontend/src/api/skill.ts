import { instance } from '.';
import type { IEditSkill } from '../types/skill';

export const skillAPI = {
  sendSkill: (data: IEditSkill) => instance.post('skills', data),
};

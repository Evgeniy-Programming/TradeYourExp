import { instance } from '.';
import type { IEditSkill } from '../types/skill';

export const skillAPI = {
  get: () => instance.get(`skills`),
  getMy: () => instance.get(`skills/my`),
  getByProfileId: (profileId: string) => instance.get(`skills/${profileId}`),
  sendSkill: (data: IEditSkill) => instance.post('skills', data),
};

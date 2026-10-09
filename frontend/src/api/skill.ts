import { instance, unwrap } from '.';
import { categoryCodes } from '../constants/categories';
import type {
  CategoryViewType,
  IEditSkill,
  ISkillHistory,
  ISkillQuery,
  ISkillStats,
  SkillSearchType,
} from '../types/skill';

// Бэкенд хранит категорию кодом (it, art, ...), а интерфейс показывает её название
type ApiSkill = Omit<ISkillHistory, 'category'> & { category: string };

const categoryByCode = Object.fromEntries(
  Object.entries(categoryCodes).map(([name, code]) => [code, name])
) as Record<string, CategoryViewType>;

const fromApi = (skill: ApiSkill): ISkillHistory => ({
  ...skill,
  category: categoryByCode[skill.category] ?? 'Все категории',
});

// 'Получить' — ищем среди того, чему учат; 'Обменять' — среди того, что хотят получить взамен
const searchIn: Record<SkillSearchType, string | undefined> = {
  Все: undefined,
  Получить: 'skill',
  Обменять: 'exchange',
};

export const skillAPI = {
  getSkills: ({ category, search, searchType = 'Все' }: ISkillQuery = {}) => {
    const params = {
      category: category && category !== 'Все категории' ? categoryCodes[category] : undefined,
      search: search?.trim() || undefined,
      searchIn: search?.trim() ? searchIn[searchType] : undefined,
    };
    return unwrap<ApiSkill[]>(instance.get('skills', { params })).then((skills) =>
      skills.map(fromApi)
    );
  },
  getMySkills: () =>
    unwrap<ApiSkill[]>(instance.get('skills/my')).then((skills) => skills.map(fromApi)),
  getStats: () => unwrap<ISkillStats>(instance.get('skills/my/stats')),
  sendSkill: (data: IEditSkill) =>
    unwrap<string>(
      instance.post('skills', {
        ...data,
        category: categoryCodes[data.category],
        contactValue: data.contactType === 'site' ? null : data.contactValue,
      })
    ),
  deleteSkill: (id: string) => unwrap<string>(instance.delete(`skills/${id}`)),
};

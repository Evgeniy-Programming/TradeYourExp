import axios from 'axios';
import { instance, unwrap } from '.';
import { categoryCodes } from '../constants/categories';
import type {
  CategoryViewType,
  ContactType,
  IEditSkill,
  ISkillHistory,
  ISkillQuery,
  ISkillStats,
} from '../types/skill';

// Запрос в формате бэкенда (backend/internal/models/skill.go: SkillFull)
interface ApiSkill {
  id: number;
  username: string;
  skill: string;
  exchange: string;
  category: string;
  description: string;
  created_at: string;
  media?: string;
}

const contactTypes: ContactType[] = ['site', 'telegram', 'vk', 'wechat'];

const categoryByCode = Object.fromEntries(
  Object.entries(categoryCodes).map(([name, code]) => [code, name])
) as Record<string, CategoryViewType>;

// Контакт бэкенд хранит в media строкой "Тип связи: <тип>, Имя: <ник>" (CreateSkillWithDesc)
const parseContact = (media = ''): Pick<ISkillHistory, 'contactType' | 'contactValue'> => {
  const match = media.match(/^Тип связи: (\S+), Имя: (.*)$/);
  const type = match?.[1] as ContactType | undefined;

  if (!match || !type || !contactTypes.includes(type)) {
    return { contactType: 'site', contactValue: null };
  }
  return { contactType: type, contactValue: match[2] };
};

const fromApiSkill = (skill: ApiSkill): ISkillHistory => ({
  id: String(skill.id),
  category: categoryByCode[skill.category] ?? 'Все категории',
  description: skill.description,
  skill: skill.skill,
  exchange: skill.exchange,
  ...parseContact(skill.media),
  username: skill.username,
  avatarUsername: null,
  createdAt: skill.created_at,
  // статусов запросов на бэкенде пока нет
  status: 'ACTIVE',
});

// Бэкенд отвечает 404, когда по фильтру ничего не нашлось
const listOrEmpty = (url: string) =>
  unwrap<ApiSkill[] | null>(instance.get(url))
    .then((skills) => (skills ?? []).map(fromApiSkill))
    .catch((error) => {
      if (axios.isAxiosError(error) && error.response?.status === 404) return [];
      throw error;
    });

const includes = (text: string, search: string) =>
  text.toLowerCase().includes(search.toLowerCase());

const getSkills = async ({ category, search = '', searchType = 'Все' }: ISkillQuery = {}) => {
  const query = search.trim();
  const code = category && category !== 'Все категории' ? categoryCodes[category] : undefined;

  let skills: ISkillHistory[];
  if (query) {
    skills = await listOrEmpty(`skills/filter/${encodeURIComponent(query)}`);
    if (code) skills = skills.filter((skill) => skill.category === category);
  } else if (code) {
    skills = await listOrEmpty(`skills/${code}`);
  } else {
    skills = await listOrEmpty('skills');
  }

  // 'Получить' — ищем среди того, чему учат; 'Обменять' — среди того, что хотят взамен
  if (query && searchType === 'Получить') {
    return skills.filter((skill) => includes(skill.skill, query));
  }
  if (query && searchType === 'Обменять') {
    return skills.filter((skill) => includes(skill.exchange, query));
  }
  return skills;
};

// Отдельной ручки «мои запросы» на бэкенде нет — фильтруем общую ленту по автору
const getUserSkills = async (username: string) =>
  (await getSkills()).filter((skill) => skill.username === username);

const getStats = async (username: string): Promise<ISkillStats> => {
  const skills = await getUserSkills(username);
  const now = new Date();
  const byMonth = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const count = skills.filter((skill) => skill.createdAt.slice(0, 7) === month).length;
    return { month, count };
  });

  return {
    total: skills.length,
    active: skills.filter((skill) => skill.status === 'ACTIVE').length,
    closed: skills.filter((skill) => skill.status === 'CLOSED').length,
    byMonth,
  };
};

export const skillAPI = {
  getSkills,
  getUserSkills,
  getStats,
  sendSkill: (data: IEditSkill, username: string) =>
    unwrap<string>(
      instance.post('skills/with-desc', {
        username,
        skill: data.skill,
        exchange: data.exchange,
        category: categoryCodes[data.category],
        description: data.description,
        contact_type: data.contactType,
        contact_value: data.contactType === 'site' ? '' : (data.contactValue ?? ''),
      })
    ),
};

import Block from '../../ui/Block/Block';
import AButtonSecondary from '../../ui/AButtonSecondary/AButtonSecondary';
import { Skill } from '../Skill/Skill';
import type { ISkillHistory } from '../../types/skill';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';

// TODO: заменить на данные из Redux / API по username
const buildMockDeals = (username: string): ISkillHistory[] => [
  {
    id: '1',
    category: 'Наука, бизнес и саморазвитие',
    description: 'Помогу с основами Python',
    skill: 'Python',
    exchange: 'Английский',
    contactType: 'site',
    contactValue: null,
    username,
    avatarUsername: null,
    createdAt: '2026-11-01T10:00:00Z',
    status: 'ACTIVE',
  },
  {
    id: '2',
    category: 'Творчество и дизайн',
    description: 'Нарисую логотип',
    skill: 'Дизайн логотипов',
    exchange: 'Вёрстка',
    contactType: 'telegram',
    contactValue: '@user',
    username,
    avatarUsername: null,
    createdAt: '2026-10-30T14:30:00Z',
    status: 'CLOSED',
  },
  {
    id: '3',
    category: 'Хобби, здоровье и образ жизни',
    description: 'Научу играть на гитаре',
    skill: 'Игра на гитаре',
    exchange: 'Китайский',
    contactType: 'site',
    contactValue: null,
    username,
    avatarUsername: null,
    createdAt: '2026-10-28T09:15:00Z',
    status: 'ACTIVE',
  },
];

export const ProfileAllDeals: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const deals = buildMockDeals(username ?? '');

  return (
    <Block className={style.deals}>
      <div className={style.deals__header}>
        <h2 className={style.deals__title}>
          Сделки
          {deals.length > 0 && <span className={style.deals__count}>{deals.length}</span>}
        </h2>
        <AButtonSecondary to="/profile/history" className={style.deals__all}>
          Вся история
        </AButtonSecondary>
      </div>

      {deals.length === 0 && <p className={style.deals__empty}>Сделок пока нет</p>}

      {deals.length > 0 && (
        <div className={style.deals__list}>
          {deals.map((deal) => (
            <Skill key={deal.id} skill={deal} />
          ))}
        </div>
      )}
    </Block>
  );
};

export default ProfileAllDeals;

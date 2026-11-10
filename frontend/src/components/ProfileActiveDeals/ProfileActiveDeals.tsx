import Block from '../../ui/Block/Block';
import AButtonSecondary from '../../ui/AButtonSecondary/AButtonSecondary';
import type { ISkillHistory } from '../../types/skill';
import style from './style.module.scss';
import { SkillHistory } from '../SkillHistory/SkillHistory';

// TODO: заменить на данные из Redux
const MOCK_DEALS: ISkillHistory[] = [
  {
    id: '1',
    category: 'Наука, бизнес и саморазвитие',
    description: 'Помогу с основами Python',
    skill: 'Python',
    exchange: 'Английский',
    contactType: 'site',
    contactValue: null,
    username: 'alice',
    avatarUsername: null,
    createdAt: '2026-11-01T10:00:00Z',
    status: 'ACTIVE',
  },
  {
    id: '2',
    category: 'Наука, бизнес и саморазвитие',
    description: 'Нарисую логотип',
    skill: 'Дизайн логотипов',
    exchange: 'Вёрстка',
    contactType: 'telegram',
    contactValue: '@bob',
    username: 'bob',
    avatarUsername: null,
    createdAt: '2026-10-30T14:30:00Z',
    status: 'ACTIVE',
  },
  {
    id: '3',
    category: 'Технологии и IT',
    description: 'Научу играть на гитаре',
    skill: 'Игра на гитаре',
    exchange: 'Китайский',
    contactType: 'site',
    contactValue: null,
    username: 'carol',
    avatarUsername: null,
    createdAt: '2026-10-28T09:15:00Z',
    status: 'ACTIVE',
  },
];

export const ProfileActiveDeals: React.FC = () => {
  const deals = MOCK_DEALS;

  return (
    <Block className={style.deals}>
      <div className={style.deals__header}>
        <h2 className={style.deals__title}>
          Активные сделки
          {deals.length > 0 && <span className={style.deals__count}>{deals.length}</span>}
        </h2>
        <AButtonSecondary to="/profile/history" className={style.deals__all}>
          Все сделки
        </AButtonSecondary>
      </div>

      {deals.length === 0 && <p className={style.deals__empty}>Активных сделок пока нет</p>}

      {deals.length > 0 && (
        <div className={style.deals__list}>
          {deals.map((deal) => (
            <SkillHistory key={deal.id} skill={deal} />
          ))}
        </div>
      )}
    </Block>
  );
};

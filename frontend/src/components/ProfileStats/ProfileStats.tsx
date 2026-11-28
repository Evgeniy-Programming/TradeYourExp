import Block from '../../ui/Block/Block';
import Stars from '../../ui/Stars/Stars';
import style from './style.module.scss';

// TODO: заменить на данные из Redux
const MOCK_STATS = {
  rating: 4.3,
  reviewsCount: 27,
  totalDeals: 42,
  activeDeals: 5,
  completedDeals: 37,
  successRate: 88, // %
};

export const ProfileStats: React.FC = () => {
  const stats = MOCK_STATS;

  return (
    <Block className={style.stats}>
      <h2 className={style.stats__title}>Статистика</h2>

      <div className={style.stats__grid}>
        <div className={style.stats__item}>
          <span className={style.stats__label}>Рейтинг</span>
          <div className={style.stats__rating}>
            <Stars value={stats.rating} size={22} showValue />
          </div>
          <span className={style.stats__hint}>{stats.reviewsCount} отзывов</span>
        </div>

        <div className={style.stats__item}>
          <span className={style.stats__label}>Всего сделок</span>
          <b className={style.stats__value}>{stats.totalDeals}</b>
        </div>

        <div className={style.stats__item}>
          <span className={style.stats__label}>Активных</span>
          <b className={style.stats__value}>{stats.activeDeals}</b>
        </div>

        <div className={style.stats__item}>
          <span className={style.stats__label}>Завершённых</span>
          <b className={style.stats__value}>{stats.completedDeals}</b>
        </div>

        <div className={style.stats__item}>
          <span className={style.stats__label}>Успешных</span>
          <b className={style.stats__value}>{stats.successRate}%</b>
        </div>
      </div>
    </Block>
  );
};

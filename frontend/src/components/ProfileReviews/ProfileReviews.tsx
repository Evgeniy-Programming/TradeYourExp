import { useState } from 'react';
import Block from '../../ui/Block/Block';
import Badge from '../../ui/Badge/Badge';
import AButtonSecondary from '../../ui/AButtonSecondary/AButtonSecondary';
import Stars from '../../ui/Stars/Stars';
import UserAvatarLink from '../UserAvatarLink/UserAvatarLink';
import style from './style.module.scss';

// TODO: заменить на данные из Redux
const MOCK_REVIEWS = [
  {
    id: '1',
    username: 'alice',
    profileAvatar: null,
    dealId: '1',
    dealTitle: 'Python ↔ Английский',
    rating: 5,
    text: 'Отличный обмен! Всё чётко, вовремя, объяснил сложные темы простыми словами.',
    createdAt: '2026-11-02T12:00:00Z',
  },
  {
    id: '2',
    username: 'bob',
    profileAvatar: null,
    dealId: '2',
    dealTitle: 'Дизайн логотипов ↔ Вёрстка',
    rating: 4,
    text: 'Хороший логотип, но правки заняли чуть больше времени. В целом рекомендую.',
    createdAt: '2026-10-29T18:40:00Z',
  },
  {
    id: '3',
    username: 'carol',
    profileAvatar: null,
    dealId: '3',
    dealTitle: 'Игра на гитаре ↔ Китайский',
    rating: 5,
    text: '',
    createdAt: '2026-10-27T08:20:00Z',
  },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

export const ProfileReviews: React.FC = () => {
  const reviews = MOCK_REVIEWS;
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Block className={style.reviews}>
      <div className={style.reviews__header}>
        <h2 className={style.reviews__title}>
          Отзывы
          {reviews.length > 0 && <span className={style.reviews__count}>{reviews.length}</span>}
        </h2>
        <AButtonSecondary to="/profile/reviews" className={style.reviews__all}>
          Все отзывы
        </AButtonSecondary>
      </div>

      {reviews.length === 0 && <p className={style.reviews__empty}>Отзывов пока нет</p>}

      {reviews.length > 0 && (
        <ul className={style.reviews__list}>
          {reviews.map((review) => {
            const isLong = review.text.length > 180;
            const isOpen = expanded[review.id] || !isLong;
            const shownText = isOpen ? review.text : `${review.text.slice(0, 180)}…`;

            return (
              <li key={review.id} className={style.reviews__item}>
                <div className={style.reviews__top}>
                  <UserAvatarLink
                    profileAvatar={review.profileAvatar}
                    profileId={review.username}
                    username={review.username}
                  />
                  <div className={style.reviews__meta}>
                    <Stars value={review.rating} size={16} />
                    <span className={style.reviews__date}>{formatDate(review.createdAt)}</span>
                  </div>
                </div>

                <Badge text={review.dealTitle} className={style.reviews__deal} />

                {review.text && (
                  <p className={style.reviews__text}>
                    {shownText}
                    {isLong && (
                      <button
                        type="button"
                        className={style.reviews__toggle}
                        onClick={() => toggleExpanded(review.id)}
                      >
                        {isOpen ? 'Свернуть' : 'Читать далее'}
                      </button>
                    )}
                  </p>
                )}

                {!review.text && (
                  <p className={style.reviews__text}>
                    <i>Пользователь не оставил текстовый отзыв</i>
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Block>
  );
};

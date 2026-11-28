import { useMemo, useState } from 'react';
import { ProfileViewLayout } from '../../layouts/ProfileViewLayout/ProfileViewLayout';
import Block from '../../ui/Block/Block';
import Badge from '../../ui/Badge/Badge';
import Stars from '../../ui/Stars/Stars';
import UserAvatarLink from '../../components/UserAvatarLink/UserAvatarLink';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';

type Review = {
  id: string;
  username: string;
  profileAvatar: string | null;
  dealTitle: string;
  rating: number;
  text: string;
  createdAt: string;
};

// TODO: заменить на данные из Redux (по profileId из useParams)
const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    username: 'alice',
    profileAvatar: null,
    dealTitle: 'Python ↔ Английский',
    rating: 5,
    text: 'Отличный обмен! Всё чётко, вовремя, объяснил сложные темы простыми словами.',
    createdAt: '2026-11-02T12:00:00Z',
  },
  {
    id: '2',
    username: 'bob',
    profileAvatar: null,
    dealTitle: 'Дизайн логотипов ↔ Вёрстка',
    rating: 4,
    text: 'Хороший логотип, но правки заняли чуть больше времени. В целом рекомендую.',
    createdAt: '2026-10-29T18:40:00Z',
  },
  {
    id: '3',
    username: 'carol',
    profileAvatar: null,
    dealTitle: 'Игра на гитаре ↔ Китайский',
    rating: 5,
    text: '',
    createdAt: '2026-10-27T08:20:00Z',
  },
  {
    id: '4',
    username: 'dave',
    profileAvatar: null,
    dealTitle: 'Фотография ↔ Испанский',
    rating: 3,
    text: 'Средне. Были задержки по времени, но результат приемлемый.',
    createdAt: '2026-10-20T10:15:00Z',
  },
  {
    id: '5',
    username: 'erin',
    profileAvatar: null,
    dealTitle: 'Копирайтинг ↔ Математика',
    rating: 2,
    text: 'Не всё понравилось, часть договорённостей не была выполнена.',
    createdAt: '2026-10-15T16:00:00Z',
  },
  {
    id: '6',
    username: 'frank',
    profileAvatar: null,
    dealTitle: 'Видеомонтаж ↔ Японский',
    rating: 1,
    text: 'Сделка сорвалась, к сожалению.',
    createdAt: '2026-10-10T09:30:00Z',
  },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

const FILTERS = [5, 4, 3, 2, 1] as const;
type Filter = (typeof FILTERS)[number] | 'ALL';

export const ReviewsViewPage = () => {
  const { username } = useParams<{ username: string }>();
  const reviews = MOCK_REVIEWS; // TODO: fetchReviewsByProfile(profileId)
  const [filter, setFilter] = useState<Filter>('ALL');

  const filteredReviews = useMemo(() => {
    const list = filter === 'ALL' ? reviews : reviews.filter((r) => r.rating === filter);

    return [...list].sort((a, b) => {
      const timeA = Date.parse(a.createdAt);
      const timeB = Date.parse(b.createdAt);
      if (Number.isNaN(timeA) || Number.isNaN(timeB)) return 0;
      return timeB - timeA;
    });
  }, [reviews, filter]);

  return (
    <ProfileViewLayout>
      <div className={style.reviews}>
        <div className={style.reviews__header}>
          <h2 className={style.reviews__title}>
            Отзывы {username}
            <span className={style.reviews__count}>{reviews.length}</span>
          </h2>
        </div>

        <div className={style.reviews__filters}>
          <button
            type="button"
            className={`${style.reviews__filter} ${filter === 'ALL' ? style.reviews__filter_active : ''}`}
            onClick={() => setFilter('ALL')}
          >
            Все
          </button>
          {FILTERS.map((rating) => (
            <button
              key={rating}
              type="button"
              className={`${style.reviews__filter} ${filter === rating ? style.reviews__filter_active : ''}`}
              onClick={() => setFilter(rating)}
            >
              {rating} <Stars value={rating} size={14} />
            </button>
          ))}
        </div>

        {filteredReviews.length === 0 ? (
          <div className={style.reviews__empty}>
            {filter === 'ALL' ? 'Отзывов пока нет' : `Нет отзывов с оценкой ${filter}`}
          </div>
        ) : (
          <ul className={style.reviews__list}>
            {filteredReviews.map((review) => (
              <li key={review.id}>
                <Block className={style.reviews__item}>
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

                  {review.text ? (
                    <p className={style.reviews__text}>{review.text}</p>
                  ) : (
                    <p className={style.reviews__text}>
                      <i>Пользователь не оставил текстовый отзыв</i>
                    </p>
                  )}
                </Block>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProfileViewLayout>
  );
};

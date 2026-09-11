import React from 'react';
import styles from './StarRaiting.module.scss';

interface StarRatingProps {
  rating: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const validRating = Math.min(Math.max(Math.floor(rating), 0), 5);

  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((index) => {
        const isActive = index <= validRating;

        return (
          <svg
            key={index}
            className={`${styles.star} ${isActive ? styles.isActive : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://w3.org"
          >
            <path
              d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
              fill="currentColor"
            />
          </svg>
        );
      })}
    </div>
  );
};

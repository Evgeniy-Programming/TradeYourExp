import React from 'react';

interface QuoteSVGProps {
  size?: number;
  color?: string;
}

const QuoteSVG: React.FC<QuoteSVGProps> = ({
  size = 30,
  color = 'var(--color-element-secondary)',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Левая верхняя кавычка */}
      <path
        d="M10 11C8.89543 11 8 10.1046 8 9V7C8 5.89543 8.89543 5 10 5H11C12.1046 5 13 5.89543 13 7V10C13 11.1046 12.1046 12 11 12H10V11Z"
        fill={color}
      />
      <path
        d="M8 15C8 13.8954 8.89543 13 10 13H11C12.1046 13 13 13.8954 13 15V17C13 18.1046 12.1046 19 11 19H10C8.89543 19 8 18.1046 8 17V15Z"
        fill={color}
      />

      {/* Правая верхняя кавычка */}
      <path
        d="M14 11C14 9.89543 14.8954 9 16 9H17C18.1046 9 19 9.89543 19 11V13C19 14.1046 18.1046 15 17 15H16C14.8954 15 14 14.1046 14 13V11Z"
        fill={color}
      />
      <path
        d="M16 15C14.8954 15 14 15.8954 14 17V18C14 19.1046 14.8954 20 16 20H17C18.1046 20 19 19.1046 19 18V17C19 15.8954 18.1046 15 17 15H16Z"
        fill={color}
      />
    </svg>
  );
};

export default QuoteSVG;

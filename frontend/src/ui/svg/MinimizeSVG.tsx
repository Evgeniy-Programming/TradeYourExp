import React from 'react';

interface MinimizeSVGProps {
  size?: number;
  color?: string;
}

const MinimizeSVG: React.FC<MinimizeSVGProps> = ({ size = 30, color = 'var(--color-element)' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Левый верхний: уголок в углу (4,4), диагональ из угла к центру */}
      <path
        d="M4 9V5C4 4.44772 4.44772 4 5 4H9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 4L9 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Правый верхний: уголок в углу (20,4) */}
      <path
        d="M15 4H19C19.5523 4 20 4.44772 20 5V9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 4L15 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Левый нижний: уголок в углу (4,20) */}
      <path
        d="M4 15V19C4 19.5523 4.44772 20 5 20H9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 20L9 15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Правый нижний: уголок в углу (20,20) */}
      <path
        d="M15 20H19C19.5523 20 20 19.5523 20 19V15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 20L15 15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MinimizeSVG;

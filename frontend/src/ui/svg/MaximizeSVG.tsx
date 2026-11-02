import React from 'react';

interface MaximizeSVGProps {
  size?: number;
  color?: string;
}

const MaximizeSVG: React.FC<MaximizeSVGProps> = ({ size = 30, color = 'var(--color-element)' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Левый верхний угол */}
      <path
        d="M4 9V5C4 4.44772 4.44772 4 5 4H9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 9L4 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Правый верхний угол */}
      <path
        d="M15 4H19C19.5523 4 20 4.44772 20 5V9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 9L20 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Левый нижний угол */}
      <path
        d="M4 15V19C4 19.5523 4.44772 20 5 20H9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 15L4 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Правый нижний угол */}
      <path
        d="M15 20H19C19.5523 20 20 19.5523 20 19V15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 15L20 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MaximizeSVG;

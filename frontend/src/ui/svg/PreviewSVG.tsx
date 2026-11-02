import React from 'react';

interface PreviewSVGProps {
  size?: number;
  color?: string;
}

const PreviewSVG: React.FC<PreviewSVGProps> = ({ size = 30, color = 'var(--color-element)' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Документ */}
      <path
        d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 2V8H20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Глаз */}
      <path
        d="M8 14C8 14 9.5 11 12 11C14.5 11 16 14 16 14C16 14 14.5 17 12 17C9.5 17 8 14 8 14Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="14" r="1" fill={color} />
    </svg>
  );
};

export default PreviewSVG;

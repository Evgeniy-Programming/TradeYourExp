interface ArrowSVGProps {
  size?: number;
  color?: string;
  rotate?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const ArrowSVG: React.FC<ArrowSVGProps> = ({
  size = 25,
  color = 'var(--color-element-secondary)',
  rotate = 90,
  direction,
}) => {
  const getRotation = () => {
    if (direction) {
      switch (direction) {
        case 'up':
          return 0;
        case 'right':
          return 90;
        case 'down':
          return 180;
        case 'left':
          return 270;
        default:
          return 0;
      }
    }
    return rotate;
  };

  const rotation = getRotation();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path
        d="M12 19V5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 12L12 5L19 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowSVG;

interface HeartSVGProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

const HeartSVG: React.FC<HeartSVGProps> = ({
  size = 30,
  color = 'var(--color-element-secondary)',
  filled = false,
}) => {
  if (!filled) {
    color = 'var(--color-element-secondary)';
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill={filled ? color : 'none'}
      xmlns="http://www.w3.org/2000/svg"
      className="svg-hover"
    >
      <path
        d="M15 26.35L13.55 25.03C8.4 20.36 5 17.28 5 13.5C5 10.42 7.42 8 10.5 8C12.24 8 13.91 8.81 15 10.09C16.09 8.81 17.76 8 19.5 8C22.58 8 25 10.42 25 13.5C25 17.28 21.6 20.36 16.45 25.04L15 26.35Z"
        stroke={filled ? 'none' : color}
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default HeartSVG;

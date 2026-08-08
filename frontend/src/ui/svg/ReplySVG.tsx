interface ReplySVGProps {
  size?: number;
  color?: string;
}

const ReplySVG: React.FC<ReplySVGProps> = ({
  size = 30,
  color = 'var(--color-element-secondary)',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="svg-hover"
    >
      <path
        d="M9.5 19.5L4.5 14.5L9.5 9.5M4.5 14.5H19.5C21.1569 14.5 22.5 15.8431 22.5 17.5V20.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ReplySVG;

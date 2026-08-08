interface HeadingSVGProps {
  size?: number;
  color?: string;
}

const HeadingSVG: React.FC<HeadingSVGProps> = ({
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
      <path d="M4 6H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M4 18H12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export default HeadingSVG;

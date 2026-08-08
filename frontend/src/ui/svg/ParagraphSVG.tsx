interface ParagraphSVGProps {
  size?: number;
  color?: string;
}

const ParagraphSVG: React.FC<ParagraphSVGProps> = ({
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
      <path d="M8 6H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M4 10H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M4 14H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M4 18H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path
        d="M4 8L6 6L4 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ParagraphSVG;

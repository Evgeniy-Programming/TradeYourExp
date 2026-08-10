interface SuccessSVGProps {
  size?: number;
  color?: string;
}

const SuccessSVG: React.FC<SuccessSVGProps> = ({
  size = 30,
  color = 'var(--color-alert-success-text)',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <path
        d="M9 12L11 14L15 10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SuccessSVG;

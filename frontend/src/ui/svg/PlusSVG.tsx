interface PlusSVGProps {
  size?: number;
  color?: string;
  loading?: boolean;
}

const PlusSVG: React.FC<PlusSVGProps> = ({
  size = 30,
  color = 'var(--color-element-secondary)',
  loading = false,
}) => {
  if (loading) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2" strokeDasharray="4 4" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 5V19" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export default PlusSVG;

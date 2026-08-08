interface DotsHorizontalSVGProps {
  size?: number;
  color?: string;
}

const DotsSVG: React.FC<DotsHorizontalSVGProps> = ({
  size = 25,
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
      <circle cx="5" cy="12" r="2" fill={color} />
      <circle cx="12" cy="12" r="2" fill={color} />
      <circle cx="19" cy="12" r="2" fill={color} />
    </svg>
  );
};

export default DotsSVG;

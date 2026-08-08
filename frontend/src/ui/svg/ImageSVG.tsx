interface ImageSVGProps {
  size?: number;
  color?: string;
}

const ImageSVG: React.FC<ImageSVGProps> = ({
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
      <rect x="2" y="2" width="20" height="20" rx="2" stroke={color} strokeWidth="2" />
      <circle cx="16" cy="8" r="2" stroke={color} strokeWidth="2" />
      <path
        d="M2 18L6 14L10 18L14 12L18 16L22 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ImageSVG;

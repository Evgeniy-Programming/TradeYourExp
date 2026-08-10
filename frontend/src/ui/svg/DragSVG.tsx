interface DragSVGProps {
  size?: number;
  color?: string;
}

const DragSVG: React.FC<DragSVGProps> = ({
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
      <circle cx="9" cy="7" r="1.5" fill={color} />
      <circle cx="15" cy="7" r="1.5" fill={color} />

      <circle cx="9" cy="12" r="1.5" fill={color} />
      <circle cx="15" cy="12" r="1.5" fill={color} />

      <circle cx="9" cy="17" r="1.5" fill={color} />
      <circle cx="15" cy="17" r="1.5" fill={color} />
    </svg>
  );
};

export default DragSVG;

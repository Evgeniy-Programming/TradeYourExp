interface LikeSVGProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

const LikeSVG: React.FC<LikeSVGProps> = ({
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
        d="M9 23.5H7C6.46957 23.5 5.96086 23.2893 5.58579 22.9142C5.21071 22.5391 5 22.0304 5 21.5V13.5C5 12.9696 5.21071 12.4609 5.58579 12.0858C5.96086 11.7107 6.46957 11.5 7 11.5H9M9 23.5V11.5M9 23.5L16 23.5C17.0609 23.5 18.0783 23.0786 18.8284 22.3284C19.5786 21.5783 20 20.5609 20 19.5V18.5C20 17.9797 20.1896 17.4775 20.5279 17.0858L22.5279 14.5858C22.8194 14.2409 23 13.798 23 13.34V12.66C23 11.7391 22.2609 11 21.34 11H17.5C16.9477 11 16.5 10.5523 16.5 10V7.5C16.5 5.84315 15.1569 4.5 13.5 4.5C12.9477 4.5 12.5 4.94772 12.5 5.5V11.5"
        stroke={filled ? 'none' : color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LikeSVG;

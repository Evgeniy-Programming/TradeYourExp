interface DislikeSVGProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

const DislikeSVG: React.FC<DislikeSVGProps> = ({
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
        d="M9 6.5H7C6.46957 6.5 5.96086 6.71071 5.58579 7.08579C5.21071 7.46086 5 7.96957 5 8.5V16.5C5 17.0304 5.21071 17.5391 5.58579 17.9142C5.96086 18.2893 6.46957 18.5 7 18.5H9M9 6.5V18.5M9 6.5L16 6.5C17.0609 6.5 18.0783 6.92143 18.8284 7.67157C19.5786 8.42172 20 9.43913 20 10.5V11.5C20 12.0203 20.1896 12.5225 20.5279 12.9142L22.5279 15.4142C22.8194 15.7591 23 16.202 23 16.66V17.34C23 18.2609 22.2609 19 21.34 19H17.5C16.9477 19 16.5 19.4477 16.5 20V22.5C16.5 24.1569 15.1569 25.5 13.5 25.5C12.9477 25.5 12.5 25.0523 12.5 24.5V18.5"
        stroke={filled ? 'none' : color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DislikeSVG;

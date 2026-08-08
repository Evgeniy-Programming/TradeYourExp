interface CommentSVGProps {
  size?: number;
  color?: string;
}

const CommentSVG: React.FC<CommentSVGProps> = ({
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
        d="M25 7.5H5C4.17157 7.5 3.5 8.17157 3.5 9V21C3.5 21.8284 4.17157 22.5 5 22.5H11.5L13.5 24.5H16.5L18.5 22.5H25C25.8284 22.5 26.5 21.8284 26.5 21V9C26.5 8.17157 25.8284 7.5 25 7.5Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <path d="M9 13.5H21M9 17.5H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export default CommentSVG;

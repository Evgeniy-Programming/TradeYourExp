interface UserSVGProps {
  size?: number;
  color?: string;
}

const UserSVG: React.FC<UserSVGProps> = ({ size = 30, color = 'var(--color-element)' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="2 3 12 11"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="5" r="2" />
      <path d="M3 13C3 10.7909 4.79086 9 7 9H9C11.2091 9 13 10.7909 13 13V13H3Z" />
    </svg>
  );
};

export default UserSVG;

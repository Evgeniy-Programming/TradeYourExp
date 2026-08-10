interface SendSVGProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

const SendSVG: React.FC<SendSVGProps> = ({ size = 20, color = '#fff' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M27.5 5L14.5 18M27.5 5L19.5 27.5L14.5 18M27.5 5L2.5 12.5L14.5 18"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SendSVG;

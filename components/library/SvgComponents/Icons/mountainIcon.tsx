interface MountainIconProps {
  height?: string;
  width?: string;
  fill?: string;
}
export const MountainIcon = ({
  width = '22',
  height = '24',
  fill = 'black',
}: MountainIconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    fill='none'
    viewBox="0 0 24 24"
  >
    <path
      d='M7 1L11 9L16 4L21 19H1L7 1Z'
      stroke={fill}
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

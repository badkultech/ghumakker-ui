interface LandMarkIconProps {
  height?: string;
  width?: string;
  fill?: string;
}
export const LandMarkIcon = ({
  width = '16',
  height = '23',
  fill = 'black',
}: LandMarkIconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    viewBox='0 0 24 24'
    fill='none'
  >
    <path
      d='M7 2H17V5H20V9H22V11H21V20H22V22H2V20H3V11H2V9H4V5H7V2ZM9 5H15V4H9V5ZM5 11V20H8V14H16V20H19V11H5ZM18 9V7H6V9H18ZM14 20V16H10V20H14Z'
      fill={fill}
    />
  </svg>
);

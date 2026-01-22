interface FastTravelIconProps {
  height?: string;
  width?: string;
  fill?: string;
}
export const FastTravelIcon = ({
  width = '18',
  height = '14',
  fill = 'black',
}: FastTravelIconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    fill='none'
  >
    <mask
      id='mask0_96_327'
      style={{ maskType: 'luminance' }}
      maskUnits='userSpaceOnUse'
      x='0'
      y='0'
      width='18'
      height='14'
    >
      <path
        d='M7 1H1'
        stroke='white'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7 5H1'
        stroke='white'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7 9H1'
        stroke='white'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7 13H1'
        stroke='white'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M17 7C17 3.69 13.5 0.75 8.75 0.75C8.25 0.75 7 3.5 7 7C7 10.5 8.25 13.25 8.75 13.25C13.5 13.25 17 10.31 17 7Z'
        stroke='black'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M17 7C17 3.69 13.5 0.75 8.75 0.75C8.25 0.75 7 3.5 7 7C7 10.5 8.25 13.25 8.75 13.25C13.5 13.25 17 10.31 17 7Z'
        stroke='white'
        strokeWidth='1.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </mask>
    <g mask='url(#mask0_96_327)'>
      <path d='M20 -5H-4V19H20V-5Z' fill={fill} />
    </g>
  </svg>
);

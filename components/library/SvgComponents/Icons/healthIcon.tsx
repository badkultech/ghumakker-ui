interface HealthIconProps {
  height?: string;
  width?: string;
  fill?: string;
}
export const HealthIcon = ({
  width = '24',
  height = '24',
  fill = 'black',
}: HealthIconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    // viewBox='0 0 24 24'
    fill='none'
  >
    <path
      d='M17.3091 21.3736L12.5554 17.0536C9.93255 14.4445 13.7846 9.47136 17.3091 13.5479C20.916 9.55365 24.6857 14.5251 22.0628 17.0536L17.3091 21.3736Z'
      stroke={fill}
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M1.06445 10.4365H3.40788L6.53302 15.9051L13.5633 2.62451L16.6885 8.8748'
      stroke={fill}
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

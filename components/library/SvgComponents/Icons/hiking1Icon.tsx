interface Hiking1IconProps {
  height?: string;
  width?: string;
  fill?: string;
}
export const Hiking1Icon = ({
  width = '22',
  height = '24',
  fill = 'black',
}: Hiking1IconProps) => {
  // Default fill fallback and convert CSS color string to rgba —
  // For simplicity, we assume fill is hex or named color recognized by browser.

  //
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width={width}
      height={height}
      fill='none'
      viewBox="0 0 24 24"
    >
      <rect
        width={width}
        height={height}
        fill='url(#pattern_hiking1_icon0_1435_10784)'
      />
      <defs>
        <pattern
          id='pattern_hiking1_icon0_1435_10784'
          patternContentUnits='objectBoundingBox'
          width='1'
          height='1'
        >
          <use
            xlinkHref='#image_hiking1_icon0_1435_10784'
            transform='scale(0.0078125)'
          />
        </pattern>

        {/* Filter to apply color overlay */}
        <filter id='hiking1ColorOverlay' colorInterpolationFilters='sRGB'>
          {/* Flood with fill color */}
          <feFlood floodColor={fill} result='flood' />
          {/* Composite the flood over the source graphic (the image) */}
          <feComposite
            in='flood'
            in2='SourceGraphic'
            operator='in'
            result='mask'
          />
          {/* Blend original image with color overlay */}
          <feBlend in='SourceGraphic' in2='mask' mode='multiply' />
        </filter>
        <image
          id='image_hiking1_icon0_1435_10784'
          width='128'
          height='128'
          preserveAspectRatio='none'
          xlinkHref='data:image/png;base64,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'
          filter='url(#hiking1ColorOverlay)'
        />
      </defs>
    </svg>
  );
};

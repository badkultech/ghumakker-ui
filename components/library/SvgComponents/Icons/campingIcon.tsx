interface CampingIconProps {
  height?: string;
  width?: string;
  fill?: string;
}
export const CampingIcon = ({
  width = '22',
  height = '24',
  fill = 'black',
}: CampingIconProps) => {
  // Default fill fallback and convert CSS color string to rgba —
  // For simplicity, we assume fill is hex or named color recognized by browser.

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
        fill='url(#pattern_camping0_1402_11104)'
      />
      <defs>
        <pattern
          id='pattern_camping0_1402_11104'
          patternContentUnits='objectBoundingBox'
          width='1'
          height='1'
        >
          <use
            xlinkHref='#image_camping0_1402_11104'
            transform='scale(0.0078125)'
          />
        </pattern>

        {/* Filter to apply color overlay */}
        <filter id='campingColorOverlay' colorInterpolationFilters='sRGB'>
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
          id='image_camping0_1402_11104'
          width='128'
          height='128'
          preserveAspectRatio='none'
          xlinkHref='data:image/png;base64,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'
          filter='url(#campingColorOverlay)'
        />
      </defs>
    </svg>
  );
};

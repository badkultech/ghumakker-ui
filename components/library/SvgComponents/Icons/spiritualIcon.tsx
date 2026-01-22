interface SpiritualIconProps {
    width?: string
    height?: string
    fill?: string
    className?: string
}

export const SpiritualIcon = ({
    width = "32",
    height = "32",
    fill = "black",
    className,
}: SpiritualIconProps) => {
    return (
        <svg
            width={width}
            height={height}
            className={className}
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <rect
                width="32"
                height="32"
                fill="url(#spiritualPattern)"
                filter="url(#spiritualOverlay)"
            />

            <defs>
                <pattern
                    id="spiritualPattern"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                >
                    <use
                        xlinkHref="#spiritualImg"
                        transform="scale(0.00390625)"
                    />
                </pattern>

                <filter id="spiritualOverlay" colorInterpolationFilters="sRGB">
                    <feFlood floodColor={fill} result="flood" />
                    <feComposite in="flood" in2="SourceGraphic" operator="atop" />
                </filter>
                <image id="spiritualImg" width="256" height="256" preserveAspectRatio="none" href="data:image/png;base64,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" />
            </defs>
        </svg>
    );
};

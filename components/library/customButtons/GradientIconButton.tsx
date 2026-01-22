import React from 'react';

interface GradientButtonIconProps {
  style?: React.CSSProperties;
  label: string;
  labelColor?: string;
  Icon: React.ElementType;
  iconColor?: string;
  Gradient?: React.ElementType | null;
  onClick?: () => void;
  className?: string;
  selected?: boolean;
}

export const GradientIconButton = ({
  style,
  label,
  Icon,
  iconColor,
  labelColor,
  Gradient,
  onClick,
  className = '',
  selected = false,
}: GradientButtonIconProps) => {
  return (
    <button
      style={style}
      onClick={onClick}
      className={`relative w-[170px] h-[45px] rounded-[100px] overflow-hidden font-semibold flex items-center justify-center gap-2 px-4 transition-all duration-300
        ${
          selected
            ? `border-[3px]  bg-gradient-to-r from-white to-white text-${iconColor}-500 border-orange-300`
            : `border-[3px] border-gray-200 bg-white text-${iconColor}-700`
        }
        ${className}`}
    >
      {/* Gradient Overlay when selected */}
      {Gradient && selected && (
        <div className='absolute inset-0'>
          <Gradient width='100%' height='100%' />
        </div>
      )}

      {/* Icon and Label */}
      <div className='relative z-10 flex items-center gap-2'>
        <Icon fill={iconColor} />
        <span style={{ color: labelColor, fontWeight: 400 }}>{label}</span>
      </div>
    </button>
  );
};

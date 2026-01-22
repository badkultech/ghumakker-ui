interface SubHeadingProps {
  fontFamily?: 'poppins' | 'barlow';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const SubHeading = ({
  fontFamily = 'poppins',
  children,
  style,
}: SubHeadingProps) => {
  const lineHeight =
    fontFamily === 'barlow' ? 'leading-[160%]' : 'leading-[140%]';
  return (
    <p
      className={`text-[20px] tracking-[0.0015em] font-normal font-${fontFamily} ${lineHeight}`}
      style={style}
    >
      {children ?? `${capitalize(fontFamily)} Subheading`}
    </p>
  );
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default SubHeading;

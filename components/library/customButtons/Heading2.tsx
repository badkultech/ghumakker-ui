interface HeadingProps {
  style?: React.CSSProperties;
  fontFamily?: 'poppins' | 'barlow';
  children?: React.ReactNode;
}

const Heading2 = ({
  fontFamily = 'poppins',
  children,
  style,
}: HeadingProps) => {
  return (
    <p
      className={`text-[56px] leading-[140%] tracking-[0.005em] font-semibold font-${fontFamily}`}
      style={style}
    >
      {children ?? `${capitalize(fontFamily)} Heading`}
    </p>
  );
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default Heading2;

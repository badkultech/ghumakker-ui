interface HeadingProps {
  fontFamily?: 'poppins' | 'barlow';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Heading1 = ({
  fontFamily = 'poppins',
  children,
  style,
}: HeadingProps) => {
  return (
    <p
      className={`text-[73.41px] leading-[140%] tracking-[0.005em] font-semibold font-${fontFamily}`}
      style={style}
    >
      {children ?? `${capitalize(fontFamily)} Heading`}
    </p>
  );
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default Heading1;

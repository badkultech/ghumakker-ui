interface TextProps {
  fontFamily?: 'poppins' | 'barlow';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Text = ({ fontFamily = 'poppins', children, style }: TextProps) => {
  return (
    <p
      className={`text-[16px] leading-[140%] font-normal font-${fontFamily}`}
      style={style}
    >
      {children ?? `${capitalize(fontFamily)} Body Text`}
    </p>
  );
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default Text;

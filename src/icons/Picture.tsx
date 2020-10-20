type Props = {
  color: string;
};

const Picture = (props: Props) => {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M.5 14.5V.5h23v8m-23 6v9h19m-19-9l5-5L14 18m5.5 5.5h4v-15m-4 15L14 18m9.5-9.5L14 18"
        stroke={props.color}
      />
      <circle cx={14.5} cy={6.5} r={3} stroke={props.color} />
    </svg>
  );
};

export default Picture;

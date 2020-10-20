type Props = {
  color: string;
};

const New = (props: Props) => {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M20.5 7.5v16h-17V.5h10m7 7l-7-7m7 7h-7v-7"
        stroke={props.color}
      />
    </svg>
  );
};

export default New;

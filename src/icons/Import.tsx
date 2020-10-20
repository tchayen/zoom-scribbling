type Props = {
  color: string;
};

const Import = (props: Props) => {
  return (
    <svg width="24px" height="24px" viewBox="0 0 25 24" fill="none" {...props}>
      <path
        d="M23.5 17.5v6H.5V.5h23v6m0 5h-18m0 0l7-7m-7 7l7 7"
        stroke={props.color}
      />
    </svg>
  );
};

export default Import;

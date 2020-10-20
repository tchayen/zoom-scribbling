type Props = {
  color: string;
};

const Save = (props: Props) => {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M16.5.5H18L23.5 6v17.5h-6m-1-23v7h-10v-7m10 0h-10m0 0h-6v23h5m0 0v-11h12v11m-12 0h12"
        stroke={props.color}
      />
    </svg>
  );
};

export default Save;

type Props = {
  color: string;
};

const Folder = (props: Props) => {
  return (
    <svg width="24px" height="24px" viewBox="0 0 25 24" fill="none" {...props}>
      <path
        d="M.5 3.5H9l1.5 4h13l-2 13H.5v-17z"
        stroke={props.color}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Folder;

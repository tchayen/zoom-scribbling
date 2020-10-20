type Props = {
  color: string;
};

const Selection = (props: Props) => {
  return (
    <svg width="24px" height="24px" viewBox="0 0 25 24" fill="none" {...props}>
      <path
        d="M0 0v-.5h-.5V0H0zm25 0h.5v-.5H25V0zm0 24v.5h.5V24H25zM0 24h-.5v.5H0V24zM-.5 0v2.5h1V0h-1zm0 5.5v5h1v-5h-1zm0 8v5h1v-5h-1zm0 8V24h1v-2.5h-1zm.5 3h2.604v-1H0v1zm5.73 0h5.207v-1H5.73v1zm8.332 0h5.209v-1h-5.209v1zm8.334 0H25v-1h-2.604v1zM25.5 24v-2.5h-1V24h1zm0-5.5v-5h-1v5h1zm0-8v-5h-1v5h1zm0-8V0h-1v2.5h1zm-.5-3h-2.604v1H25v-1zm-5.73 0h-5.207v1h5.208v-1zm-8.332 0H5.729v1h5.208v-1zm-8.334 0H0v1h2.604v-1zM0 0v-1h-1v1h1zm25 0h1v-1h-1v1zm0 24v1h1v-1h-1zM0 24h-1v1h1v-1zM-1 0v2.5h2V0h-2zm0 5.5v5h2v-5h-2zm0 8v5h2v-5h-2zm0 8V24h2v-2.5h-2zM0 25h2.604v-2H0v2zm5.73 0h5.207v-2H5.73v2zm8.332 0h5.209v-2h-5.209v2zm8.334 0H25v-2h-2.604v2zM26 24v-2.5h-2V24h2zm0-5.5v-5h-2v5h2zm0-8v-5h-2v5h2zm0-8V0h-2v2.5h2zM25-1h-2.604v2H25v-2zm-5.73 0h-5.207v2h5.208v-2zm-8.332 0H5.729v2h5.208v-2zM2.604-1H0v2h2.604v-2z"
        fill={props.color}
      />
    </svg>
  );
};

export default Selection;

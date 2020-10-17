import React from "react";
import { useFocusRing } from "@react-aria/focus";
import { styled, useTheme } from "./colorTheme";

const Moon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0)">
      <path
        d="M14.875 1L15.5533 1.7348L17.4327 0H14.875V1ZM14.875 19V20H17.4327L15.5533 18.2652L14.875 19ZM14.1967 0.265197C10.8396 3.36403 9 6.61081 9 10C9 13.3892 10.8397 16.636 14.1967 19.7348L15.5533 18.2652C12.4104 15.364 11 12.6108 11 10C11 7.38919 12.4104 4.63597 15.5533 1.7348L14.1967 0.265197ZM14.875 0C11.0379 0 8.0627 1.19492 6.03733 3.08061C4.01661 4.96197 3 7.47935 3 10C3 12.5206 4.01661 15.038 6.03733 16.9194C8.0627 18.8051 11.0379 20 14.875 20V18C11.4621 18 8.9998 16.9449 7.40017 15.4556C5.79589 13.962 5 11.9794 5 10C5 8.02065 5.79589 6.03803 7.40017 4.54439C8.99981 3.05508 11.4622 2 14.875 2V0Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="13" height="20" fill="white" transform="translate(3)" />
      </clipPath>
    </defs>
  </svg>
);

const Sun = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="7"
      y="7"
      width="6"
      height="6"
      rx="3"
      stroke="white"
      strokeWidth="2"
    />
    <path d="M10 0V4" stroke="white" strokeWidth="2" />
    <g clipPath="url(#clip0)">
      <path
        d="M17.364 2.63611L14.5355 5.46454"
        stroke="white"
        strokeWidth="2"
      />
    </g>
    <g clipPath="url(#clip1)">
      <path d="M20 10H16" stroke="white" strokeWidth="2" />
    </g>
    <g clipPath="url(#clip2)">
      <path d="M17.364 17.364L14.5356 14.5356" stroke="white" strokeWidth="2" />
    </g>
    <path d="M10 20V16" stroke="white" strokeWidth="2" />
    <g clipPath="url(#clip3)">
      <path
        d="M2.63605 17.3639L5.46447 14.5355"
        stroke="white"
        strokeWidth="2"
      />
    </g>
    <g clipPath="url(#clip4)">
      <path d="M0 10H4" stroke="white" strokeWidth="2" />
    </g>
    <g clipPath="url(#clip5)">
      <path
        d="M2.63605 2.63599L5.46447 5.46441"
        stroke="white"
        strokeWidth="2"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect
          width="2"
          height="18"
          fill="white"
          transform="translate(16.6569 1.92896) rotate(45)"
        />
      </clipPath>
      <clipPath id="clip1">
        <rect
          width="2"
          height="18"
          fill="white"
          transform="translate(20 9) rotate(90)"
        />
      </clipPath>
      <clipPath id="clip2">
        <rect
          width="2"
          height="18"
          fill="white"
          transform="translate(18.0711 16.6569) rotate(135)"
        />
      </clipPath>
      <clipPath id="clip3">
        <rect
          width="2"
          height="18"
          fill="white"
          transform="translate(3.34314 18.071) rotate(-135)"
        />
      </clipPath>
      <clipPath id="clip4">
        <rect
          width="2"
          height="18"
          fill="white"
          transform="translate(0 11) rotate(-90)"
        />
      </clipPath>
      <clipPath id="clip5">
        <rect
          width="2"
          height="18"
          fill="white"
          transform="translate(1.92896 3.34314) rotate(-45)"
        />
      </clipPath>
    </defs>
  </svg>
);

const ToggleButton = styled.button<{
  isFocusVisible: boolean;
  isDisabled: boolean;
}>`
  cursor: ${(props) => (props.isDisabled ? "default" : "pointer")};
  background-color: transparent;
  border: none;
  outline: none;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${(props) =>
    props.isFocusVisible ? `0 0 0 4px ${props.theme.primaryDimmed}` : "none"};
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};
`;

type Props = {
  isDisabled: boolean;
};

const ColorModeToggle = ({ isDisabled }: Props) => {
  const { setColorMode, colorMode } = useTheme();
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <ToggleButton
      disabled={isDisabled}
      isDisabled={isDisabled}
      onClick={() => {
        setColorMode(colorMode === "dark" ? "light" : "dark");
      }}
      isFocusVisible={isFocusVisible}
      {...focusProps}
    >
      {colorMode === "dark" ? <Sun /> : <Moon />}
    </ToggleButton>
  );
};

export default ColorModeToggle;

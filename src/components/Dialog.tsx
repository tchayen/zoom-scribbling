import React, { cloneElement, useCallback, useEffect, useRef } from "react";
import { useOverlayTriggerState } from "react-stately";
import {
  useOverlay,
  usePreventScroll,
  useModal,
  OverlayContainer,
  useDialog,
  FocusScope,
} from "react-aria";
import Button from "./Button";
import { styled, useTheme } from "./colorTheme";
import { ColorMode } from "./colors";

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Header = styled.h3`
  margin: 0;
  color: ${(props) => props.theme.mainText};
  margin-bottom: 16px;
`;

const Paragraph = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: ${(props) => props.theme.secondaryText};
`;

const Box = styled.div<{ colorMode: ColorMode }>`
  outline: none;
  background-color: ${(props) => props.theme.background};
  padding: 24px;
  border: ${(props) =>
    props.colorMode === "dark" ? `1px solid ${props.theme.border}` : "none"};
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Dialog = (props: any) => {
  const { colorMode } = useTheme();
  const { title, children, confirmLabel, onClose } = props;

  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  const ref = useRef(null);
  const { overlayProps } = useOverlay(props, ref);

  // Prevent scrolling while the modal is open, and hide content
  // outside the modal from screen readers.
  usePreventScroll();
  useModal();

  // Get props for the dialog and its title
  const { dialogProps, titleProps } = useDialog(props, ref);

  return (
    <Background>
      <FocusScope contain restoreFocus autoFocus>
        <Box {...overlayProps} {...dialogProps} colorMode={colorMode} ref={ref}>
          <Header {...titleProps}>{title}</Header>
          <Paragraph>{children}</Paragraph>
          <Row>
            {props.showCancel && (
              <Button secondary onPress={onClose}>
                Cancel
              </Button>
            )}
            <Button onPress={onClose}>{confirmLabel}</Button>
          </Row>
        </Box>
      </FocusScope>
    </Background>
  );
};

export const DialogTrigger = ({ label, children, ...otherProps }: any) => {
  let state = useOverlayTriggerState({});

  useEffect(() => {
    if (otherProps.startOpen) {
      state.open();
    }
  }, [otherProps.startOpen]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "h") {
        state.toggle();
      }
    },
    [state]
  );

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <>
      {state.isOpen && (
        <OverlayContainer>
          {cloneElement(children, { onClose: () => state.close() })}
        </OverlayContainer>
      )}
    </>
  );
};

export default Dialog;

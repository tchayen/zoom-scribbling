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
import { styled } from "./colorTheme";

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
  margin-bottom: 16px;
`;

const Paragraph = styled.p`
  margin-top: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: ${(props) => props.theme.secondaryText};
`;

const Box = styled.div`
  outline: none;
  background-color: ${(props) => props.theme.background};
  padding: 24px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Dialog = (props: any) => {
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
        <Box {...overlayProps} {...dialogProps} ref={ref}>
          <Header {...titleProps}>{title}</Header>
          <Paragraph>{children}</Paragraph>
          <Row>
            <Button onPress={onClose}>Cancel</Button>
            <Button onPress={onClose}>{confirmLabel}</Button>
          </Row>
        </Box>
      </FocusScope>
    </Background>
  );
};

export const DialogTrigger = ({ label, children, ...otherProps }: any) => {
  let state = useOverlayTriggerState({});

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

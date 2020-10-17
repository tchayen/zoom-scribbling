import React, { useRef, useState } from "react";
import { useSelect } from "@react-aria/select";
import { Node } from "@react-types/shared";
import { useSelectState, SelectState } from "@react-stately/select";
import { HiddenSelect } from "@react-aria/select";
import { useListBox, useOption } from "@react-aria/listbox";
import { mergeProps } from "@react-aria/utils";
import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import { useFocus } from "@react-aria/interactions";
import { FocusScope } from "@react-aria/focus";
import { useOverlay, DismissButton } from "@react-aria/overlays";
import { styled } from "../colorTheme";
import Label from "./Label";

import { Item } from "@react-stately/collections";
export { Item };

const Dropdown = styled.button<{ isFocusVisible: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  width: 100%;
  margin-top: 4px;
  padding-left: 8px;
  padding-right: 8px;
  background-color: ${(props) => props.theme.background};
  border: 1px solid
    ${(props) =>
      props.isFocusVisible ? props.theme.primary : props.theme.border};
  font-family: Inter, sans-serif;
  font-size: 14px;
  outline: ${(props) =>
    props.isFocusVisible ? `4px solid ${props.theme.primaryDimmed}` : "none"};
`;

const DrodownText = styled.span<{ hasSelected: boolean }>`
  color: ${(props) =>
    props.hasSelected ? props.theme.mainText : props.theme.secondaryText};
`;

const Chevron = () => (
  <svg
    width="14"
    height="8"
    viewBox="0 0 14 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.0001 6.40001L6.4001 7.20001L7.0001 7.65001L7.6001 7.20001L7.0001 6.40001ZM9.76324e-05 2.40001L6.4001 7.20001L7.6001 5.60001L1.2001 0.800006L9.76324e-05 2.40001ZM7.6001 7.20001L14.0001 2.40001L12.8001 0.800006L6.4001 5.60001L7.6001 7.20001Z"
      fill="#777777"
    />
  </svg>
);

type Props = {
  name: string;
  label: string;
  isDisabled?: boolean;
  children: any[];
};

export const Select = (props: Props) => {
  // Create state based on the incoming props.
  const state = useSelectState(props);

  const { focusProps, isFocusVisible } = useFocusRing();

  // Get props for child elements from useSelect.
  const ref = useRef(null);
  const { labelProps, triggerProps, valueProps, menuProps } = useSelect(
    props,
    state,
    ref
  );

  // Get props for the button based on the trigger props from useSelect.
  const { buttonProps } = useButton(triggerProps, ref);

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        display: "inline-block",
        opacity: props.isDisabled ? 0.5 : 1,
      }}
    >
      <Label {...labelProps}>{props.label}</Label>
      <HiddenSelect
        state={state}
        triggerRef={ref}
        label={props.label}
        name={props.name}
        isDisabled={props.isDisabled}
      />
      <Dropdown
        {...mergeProps(buttonProps, focusProps)}
        isFocusVisible={isFocusVisible}
        disabled={props.isDisabled}
        ref={ref}
      >
        <DrodownText hasSelected={!!state.selectedItem} {...valueProps}>
          {state.selectedItem
            ? state.selectedItem.rendered
            : "Select an option"}
        </DrodownText>
        <Chevron />
      </Dropdown>
      {state.isOpen && <ListBoxPopup {...menuProps} state={state} />}
    </div>
  );
};

type PopoverProps = {
  children: JSX.Element;
  state: SelectState<object>;
};

export function Popover({ children, state }: PopoverProps) {
  let overlayRef = useRef(null);
  let { overlayProps } = useOverlay(
    {
      onClose: () => state.close(),
      shouldCloseOnBlur: true,
      isOpen: state.isOpen,
      isDismissable: true,
    },
    overlayRef
  );

  return (
    <FocusScope restoreFocus>
      <div {...overlayProps} ref={overlayRef}>
        <DismissButton onDismiss={() => state.close()} />
        {children}
        <DismissButton onDismiss={() => state.close()} />
      </div>
    </FocusScope>
  );
}

const List = styled.ul`
  z-index: 100;
  position: absolute;
  width: 100%;
  margin: 4px 0 0 0;
  padding: 0;
  list-style: none;
  box-shadow: 0 0 0 1px ${(props) => props.theme.border} inset;
  background: ${(props) => props.theme.background};
  outline: none;
`;

type ListBoxPopupProps = {
  state: SelectState<object>;
};

const ListBoxPopup = ({ state, ...otherProps }: ListBoxPopupProps) => {
  const ref = useRef(null);

  // Get props for the listbox.
  const { listBoxProps } = useListBox(
    {
      autoFocus: state.focusStrategy || true,
      disallowEmptySelection: true,
    },
    state,
    ref
  );

  return (
    <Popover state={state}>
      <List {...mergeProps(listBoxProps, otherProps)} ref={ref}>
        {[...state.collection].map((item) => (
          <Option key={item.key} item={item} state={state} />
        ))}
      </List>
    </Popover>
  );
};

const OptionComponent = styled.li<{ isSelected: boolean; isFocused: boolean }>`
  font-size: 14px;
  background: ${(props) =>
    props.isSelected
      ? props.theme.primary
      : props.isFocused
      ? props.theme.border
      : "transparent"};
  color: ${(props) =>
    props.isSelected ? props.theme.background : props.theme.mainText};
  padding-left: 8px;
  padding-right: 8px;
  height: 32px;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

type OptionProps = {
  item: Node<object>;
  state: SelectState<object>;
};

const Option = ({ item, state }: OptionProps) => {
  // Get props for the option element.
  let ref = useRef(null);
  let isDisabled = state.disabledKeys.has(item.key);
  let isSelected = state.selectionManager.isSelected(item.key);
  let { optionProps } = useOption(
    {
      key: item.key,
      isDisabled,
      isSelected,
      shouldSelectOnPressUp: true,
      shouldFocusOnHover: true,
    },
    state,
    ref
  );

  // Handle focus events so we can apply highlighted style to the focused option.
  let [isFocused, setFocused] = useState(false);
  let { focusProps } = useFocus({ onFocusChange: setFocused });

  return (
    <OptionComponent
      isFocused={isFocused}
      isSelected={isSelected}
      {...mergeProps(optionProps, focusProps)}
      ref={ref}
    >
      {item.rendered}
    </OptionComponent>
  );
};

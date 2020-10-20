import { useRef } from "react";
import { useMenuTriggerState } from "@react-stately/menu";
import { MenuTriggerProps } from "@react-types/menu";
import { useMenuTrigger } from "@react-aria/menu";
import Button from "./Button";
import { Popover } from "./Select";

type Props = {
  label: string;
} & MenuTriggerProps;

const Menu = (props: Props) => {
  const state = useMenuTriggerState(props);
  const ref = useRef(null);
  const { menuTriggerProps, menuProps } = useMenuTrigger({}, state, ref);

  return (
    <div>
      <Button>{props.label}</Button>
      {/* {state.isOpen && (
        <Popover state={state}>
          <Menu
            {...props}
            aria-label="Menu"
            domProps={menuProps}
            autoFocus={state.focusStrategy || true}
            onClose={() => state.close()}
          />
        </Popover>
      )} */}
    </div>
  );
};

export default Menu;

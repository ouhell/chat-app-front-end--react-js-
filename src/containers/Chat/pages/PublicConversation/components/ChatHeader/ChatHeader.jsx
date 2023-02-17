import { useDispatch } from "react-redux";
import { MenuSvg } from "../../../../../../shared/assets/svg/SvgProvider";
import { ComponentActions } from "../../../../../../store/slices/ComponentSlice";
import c from "./ChatHeader.module.scss";

const ChatHeader = () => {
  const dispatch = useDispatch();

  return (
    <div className={c.ChatHeader}>
      <MenuSvg
        className={c.Menu}
        onClick={() => {
          dispatch(ComponentActions.openNav());
        }}
      />
    </div>
  );
};

export default ChatHeader;

import { useDispatch } from "react-redux";
import { MenuSvg } from "../../../../../../../../shared/assets/svg/SvgProvider";
import { ComponentActions } from "../../../../../../../../store/slices/ComponentSlice";
import c from "./ChatHeader.module.scss";

const ChatHeader = ({ onToggleAi }: { onToggleAi: () => void }) => {
  const dispatch = useDispatch();

  return (
    <div className={c.ChatHeader}>
      <MenuSvg
        className={c.Menu}
        onClick={() => {
          dispatch(ComponentActions.openNav());
        }}
      />
      <button className={c.AiButton} onClick={onToggleAi} title="AI Assistant">
        <svg viewBox="0 0 24 24">
          <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5z" />
        </svg>
      </button>
    </div>
  );
};

export default ChatHeader;

import { useDispatch } from "react-redux";
import {
  ChatBlobsSvg,
  MenuSvg,
} from "../../../../shared/assets/svg/SvgProvider";
import { ComponentActions } from "../../../../store/slices/ComponentSlice";
import c from "./Default.module.scss";

const Default = () => {
  const dispatch = useDispatch();
  return (
    <div className={c.Default}>
      <MenuSvg
        className={c.Menu}
        onClick={() => {
          dispatch(ComponentActions.openNav());
        }}
      />
      <ChatBlobsSvg />
    </div>
  );
};

export default Default;

import { useDispatch } from "react-redux";
import {
  ChatBlobsSvg,
  LogoSvg,
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
      <LogoSvg />
    </div>
  );
};

export default Default;

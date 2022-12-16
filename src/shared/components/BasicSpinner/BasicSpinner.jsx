import { Spin } from "antd";
import c from "./BasicSpinner.module.scss";

const BasicSpinner = ({ spinning, size }) => {
  return (
    <div className={c.SpinHolder}>
      <Spin spinning={spinning} className={c.Spinner} size={size} />
    </div>
  );
};

export default BasicSpinner;

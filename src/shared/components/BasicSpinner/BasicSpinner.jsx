import { Spin } from "antd";
import c from "./BasicSpinner.module.scss";

const BasicSpinner = ({ spinning }) => {
  return (
    <div className={c.SpinHolder}>
      <Spin spinning={spinning} className={c.Spinner} />
    </div>
  );
};

export default BasicSpinner;

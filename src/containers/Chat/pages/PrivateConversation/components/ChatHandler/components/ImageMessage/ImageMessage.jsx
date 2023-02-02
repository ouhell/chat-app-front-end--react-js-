import { Image, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import c from "./ImageMessage.module.scss";

const ImageMessage = ({ message, userId }) => {
  return (
    <div
      className={
        c.ImageMessage +
        (userId === message.sender ? ` ${c.SelfSent}` : "") +
        /*  (message.temporary ? " " + c.Temporary : "") + */
        (message.error ? " " + c.Error : "")
      }
    >
      <div className={c.MessageHolder}>
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                color: "var(--primary-soft)",
              }}
            />
          }
          spinning={message.temporary ? true : false}
        >
          <Image src={message.content} />
        </Spin>
      </div>
    </div>
  );
};

export default ImageMessage;

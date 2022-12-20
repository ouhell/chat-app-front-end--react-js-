import { Image } from "antd";
import c from "./ImageMessage.module.scss";

const ImageMessage = ({ message, userId }) => {
  return (
    <div
      className={
        c.ImageMessage +
        (userId === message.sender ? ` ${c.SelfSent}` : "") +
        (message.temporary ? " " + c.Temporary : "") +
        (message.error ? " " + c.Error : "")
      }
    >
      <Image src={message.content} />
    </div>
  );
};

export default ImageMessage;

import c from "./TextMessage.module.scss";

const TextMessage = ({ message, userId }) => {
  return (
    <div
      className={
        c.TextMessage +
        (userId === message.sender ? ` ${c.SelfSent}` : "") +
        (message.temporary ? " " + c.Temporary : "") +
        (message.error ? " " + c.Error : "")
      }
    >
      <div className={c.MessageHolder}>{message.message}</div>
    </div>
  );
};

export default TextMessage;

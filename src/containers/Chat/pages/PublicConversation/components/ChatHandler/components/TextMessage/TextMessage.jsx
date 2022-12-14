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
      {message.message}
    </div>
  );
};

export default TextMessage;

import c from "./TextMessage.module.scss";

const formatDate = (date) => {
  const hours = (date.getHours() + "").padStart(2, "0");
  const minutes = (date.getMinutes() + "").padStart(2, "0");

  return hours + ":" + minutes;
};

const TextMessage = ({ message, userId }) => {
  const sentDate = new Date(message.sent_date);
  return (
    <div
      className={
        c.TextMessage +
        (userId === message.sender ? ` ${c.SelfSent}` : "") +
        (message.temporary ? " " + c.Temporary : "") +
        (message.error ? " " + c.Error : "")
      }
    >
      <div className={c.MessageHolder} sent-date={formatDate(sentDate)}>
        {message.message}
        <div className={c.SentDateHolder}>{formatDate(sentDate)}</div>
      </div>
    </div>
  );
};

export default TextMessage;

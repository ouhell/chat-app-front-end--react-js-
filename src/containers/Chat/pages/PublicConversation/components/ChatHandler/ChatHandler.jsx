import classes from "./ChatHandler.module.scss";

const renderMessages = (data) => {
  const userId = JSON.parse(localStorage.getItem("userData")).userId;
  if (!data)
    return <div className={classes.NoLoad}>Countdn't Load Messages</div>;
  if (data.length === 0)
    return <div className={classes.NoLoad}>no conversation yet</div>;

  return data.map((message) => {
    return (
      <div
        key={message._id}
        className={
          classes.TextMessage +
          (userId === message.sender ? ` ${classes.SelfSent}` : "")
        }
      >
        {message.message}
      </div>
    );
  });
};

const ChatHandler = ({ data }) => {
  console.log("message data", data);

  return <div className={classes.ChatHandler}>{renderMessages(data)}</div>;
};

export default ChatHandler;

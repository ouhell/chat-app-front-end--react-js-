import classes from "./ChatHandler.module.scss";
import { Spin } from "antd";
import TextMessage from "./components/TextMessage/TextMessage";

const renderMessages = (data, loadStatus) => {
  const userId = JSON.parse(localStorage.getItem("userData")).userId;
  if (loadStatus === "loading")
    return <div className={classes.NoLoad}>Loading...</div>;

  if (loadStatus === "failed")
    return (
      <div
        className={classes.NoLoad}
        style={{
          color: "red",
        }}
      >
        couldn't load
      </div>
    );
  if (data.length === 0)
    return <div className={classes.NoLoad}>no conversation yet</div>;

  return data.map((message) => (
    <TextMessage message={message} userId={userId} key={message._id} />
  ));
};

const ChatHandler = ({ data, loadStatus, chatContainer }) => {
  return (
    <div ref={chatContainer} className={classes.ChatHandler}>
      {renderMessages(data, loadStatus)}
    </div>
  );
};

export default ChatHandler;

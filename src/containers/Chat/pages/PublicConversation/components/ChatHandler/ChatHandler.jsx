import classes from "./ChatHandler.module.scss";
import { Button, Empty, Result, Spin } from "antd";
import TextMessage from "./components/TextMessage/TextMessage";
import BasicSpinner from "../../../../../../shared/components/BasicSpinner/BasicSpinner";

const renderMessages = (data, isLoading, isError, fetchMessages) => {
  const userId = JSON.parse(localStorage.getItem("userData")).userId;

  if (isLoading)
    return (
      <div className={classes.NoLoad}>
        <BasicSpinner size="large" spinning={true} />
      </div>
    );

  if (isError)
    return (
      <Result
        className={classes.NoLoad}
        status={"error"}
        title="couldnt load"
        extra={[<Button onClick={fetchMessages}>Try Again</Button>]}
      />
    );
  if (data.length === 0)
    return (
      <Empty
        className={classes.NoLoad}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="no conversation yet"
      />
    );

  return data.map((message) => (
    <TextMessage message={message} userId={userId} key={message._id} />
  ));
};

const ChatHandler = ({
  data,
  isLoading,
  isError,
  chatContainer,
  fetchMessages,
}) => {
  return (
    <div ref={chatContainer} className={classes.ChatHandler}>
      {renderMessages(data, isLoading, isError, fetchMessages)}
    </div>
  );
};

export default ChatHandler;

import classes from "./ChatHandler.module.scss";
import { Button, Empty, Result, Spin } from "antd";
import TextMessage from "./components/TextMessage/TextMessage";
import BasicSpinner from "../../../../../../shared/components/BasicSpinner/BasicSpinner";
import ImageMessage from "./components/ImageMessage/ImageMessage";
import VoiceTextMessage from "./components/VoiceTextMessage/VoiceTextMessage";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ChatActions } from "../../../../../../store/slices/ChatSlice";

const renderMessages = (
  data,
  isLoading,
  isError,
  fetchMessages,
  deleteMessage
) => {
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

  return data.map((message, i) => {
    switch (message.content_type) {
      case "text":
        return (
          <TextMessage
            message={message}
            userId={userId}
            key={message._id}
            deleteMessage={deleteMessage}
          />
        );

      case "image":
        return (
          <ImageMessage
            message={message}
            userId={userId}
            key={message._id}
            deleteMessage={deleteMessage}
          />
        );

      case "voice":
        return (
          <VoiceTextMessage
            message={message}
            userId={userId}
            key={message._id}
            deleteMessage={deleteMessage}
          />
        );

      default:
        return null;
    }
  });
};

const ChatHandler = ({
  data,
  isLoading,
  isError,
  chatContainer,
  fetchMessages,
}) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  function deleteMessage(message) {
    axios
      .delete("api/messagerie/messages/" + message._id, {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then(() => {
        console.log("deleted :", message._id);
        dispatch(
          ChatActions.emit({
            event: "delete message",
            data: message,
          })
        );

        dispatch(
          ChatActions.deleteMessage({
            conversation_id: message.conversation,
            id: message._id,
          })
        );
      });
  }

  return (
    <div ref={chatContainer} className={classes.ChatHandler}>
      {renderMessages(data, isLoading, isError, fetchMessages, deleteMessage)}
    </div>
  );
};

export default ChatHandler;

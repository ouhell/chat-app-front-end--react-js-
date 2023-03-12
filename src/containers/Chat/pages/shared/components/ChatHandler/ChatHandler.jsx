import classes from "./ChatHandler.module.scss";
import { Button, Empty, Result, Spin } from "antd";
import TextMessage from "./components/TextMessage/TextMessage";
import BasicSpinner from "../../../../../../shared/components/BasicSpinner/BasicSpinner";
import ImageMessage from "./components/ImageMessage/ImageMessage";
import VoiceTextMessage from "./components/VoiceTextMessage/VoiceTextMessage";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ChatActions } from "../../../../../../store/slices/ChatSlice";
import { AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";

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

  fetchMessages,
}) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const chatContainer = useRef();
  useEffect(() => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  }, [data]);

  function deleteMessage(message) {
    let messageId = message._id;
    if (message.trueId) messageId = message.trueId;

    axios
      .delete("api/messagerie/messages/" + messageId, {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then(() => {
        console.log("deleted :", messageId);
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
    <div className={classes.ChatHandler} ref={chatContainer}>
      <AnimatePresence initial={false} mode="popLayout">
        <div className={classes.MessageContainer}>
          {renderMessages(
            data,
            isLoading,
            isError,
            fetchMessages,
            deleteMessage
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default ChatHandler;

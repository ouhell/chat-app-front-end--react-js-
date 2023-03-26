import classes from "./ChatHandler.module.scss";
import { Button, Empty, Result, Spin } from "antd";
import TextMessage from "./components/TextMessage/TextMessage";
import BasicSpinner from "../../../../../../shared/components/BasicSpinner/BasicSpinner";
import ImageMessage from "./components/ImageMessage/ImageMessage";
import VoiceTextMessage from "./components/VoiceTextMessage/VoiceTextMessage";
import { useDispatch, useSelector } from "react-redux";

import { ChatActions } from "../../../../../../store/slices/ChatSlice";
import { AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Scroller from "./components/Scroller/Scroller";
import { deleteMessageApi } from "../../../../../../client/ApiClient";

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
  const [showScroller, setShowScroller] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const chatContainer = useRef();
  const isFirstRender = useRef(true);
  const prevData = useRef(data);
  const scrollerTimeout = useRef();

  useEffect(() => {
    if (!chatContainer.current || prevData.current.length > data.length) return;
    const scrollDistance = chatContainer.current.scrollTop;
    const scrollHeight = chatContainer.current.scrollHeight;
    const clientHeight = chatContainer.current.clientHeight;
    const unscrolledHeigth = scrollHeight - scrollDistance - clientHeight; // heigth hidden in the bottom

    if (unscrolledHeigth > 250) {
      const lastMessage = data[data.length - 1];

      if (
        !isFirstRender.current && // so it scroll when switching conversations
        prevData.current.length !== data.length && // so it scroll when data isLoaded
        lastMessage && // if message is undefined
        lastMessage.sender._id !== userData.userId // if last sender is not user
      )
        return toggleScroller();
    }

    scrollChat();
  }, [data]);

  useEffect(() => {
    prevData.current = data;
    isFirstRender.current = false;
  });

  function toggleScroller() {
    clearTimeout(scrollerTimeout.current);
    if (!showScroller) {
      setShowScroller(true);
    }
    scrollerTimeout.current = setTimeout(() => {
      setShowScroller(false);
    }, 3500);
  }

  function scrollChat() {
    if (chatContainer.current)
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
  }

  function deleteMessage(message) {
    let messageId = message._id;
    if (message.trueId) messageId = message.trueId;
    deleteMessageApi(userData.access_token, messageId).then(() => {
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
      <div className={classes.MessageContainer}>
        <AnimatePresence
          presenceAffectsLayout={true}
          initial={false}
          mode="popLayout"
        >
          {renderMessages(
            data,
            isLoading,
            isError,
            fetchMessages,
            deleteMessage
          )}
        </AnimatePresence>
      </div>

      <Scroller
        onScroll={() => {
          scrollChat();
          clearTimeout(scrollerTimeout.current);
          setShowScroller(false);
        }}
        show={showScroller}
      />
    </div>
  );
};

export default ChatHandler;

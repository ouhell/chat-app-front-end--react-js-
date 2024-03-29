import classes from "./ChatHandler.module.scss";
import { Button, Empty, Result } from "antd";
import TextMessage from "./components/TextMessage/TextMessage";
import BasicSpinner from "../../../../../../shared/components/BasicSpinner/BasicSpinner";
import ImageMessage from "./components/ImageMessage/ImageMessage";
import VoiceTextMessage from "./components/VoiceTextMessage/VoiceTextMessage";
import { useDispatch } from "react-redux";

import { ChatActions } from "../../../../../../store/slices/ChatSlice";
import { AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Scroller from "./components/Scroller/Scroller";
import { deleteMessageApi } from "../../../../../../client/ApiClient";
import { useAppSelector } from "../../../../../../store/ReduxHooks";
import { useParams } from "react-router-dom";
import React from "react";

const renderMessages = (
  data: Message[],
  isLoading: boolean,
  isError: boolean,
  fetchMessages: () => void,
  deleteMessage: (messageId: Message) => void,
  userId: string
) => {
  if (isLoading && !data.length)
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

  return data.map((message) => {
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
export type ChatHandlerProps = {
  data: Message[];
  isLoading: boolean;
  isError: boolean;
  fetchMessages: () => void;
};

type scrollElementTracker = {
  scrollTop: number;
  height: number;
};
const ChatHandler = ({
  data,
  isLoading,
  isError,

  fetchMessages,
}: ChatHandlerProps) => {
  const dispatch = useDispatch();
  const [showScroller, setShowScroller] = useState(false);
  const { conversationId } = useParams();
  const conversationProps = useAppSelector(
    (state) => state.chat.conversations[conversationId ?? "undefined"]?.props
  );
  const userData = useAppSelector((state) => state.auth.userData);
  const chatContainer = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const prevData = useRef(data);
  const scrollerTimeout = useRef<ReturnType<typeof setTimeout>>();
  const lastCapturedMessage = React.useRef<Message | undefined>(
    data[data.length - 1]
  );
  const firstCapturedMessage = React.useRef<Message | undefined>(data[0]);
  const scrollTacker = React.useRef<scrollElementTracker>({
    height: 0,
    scrollTop: 0,
  });

  useEffect(() => {
    console.log("scrolling this shit lmao");

    const firstMessage = data[0];
    const isSmaller = prevData.current.length > data.length;
    const sameFirstMessage =
      firstMessage?._id === firstCapturedMessage.current?._id;

    console.log("bools ", isSmaller, sameFirstMessage);
    if (sameFirstMessage || isSmaller) return;
    firstCapturedMessage.current = firstMessage;
    console.log("second phase");
    if (chatContainer.current) {
      console.log("actually scrolled ::::::::");
      const additionalHeight =
        chatContainer.current?.scrollHeight - scrollTacker.current.height;
      chatContainer.current.scrollTop =
        scrollTacker.current.scrollTop + additionalHeight;
    }
  }, [data]);

  useEffect(() => {
    scrollTacker.current = {
      height: chatContainer.current?.scrollHeight ?? 0,
      scrollTop: chatContainer.current?.scrollTop ?? 0,
    };
    chatContainer.current?.addEventListener("scroll", () => {
      scrollTacker.current = {
        height: chatContainer.current?.scrollHeight ?? 0,
        scrollTop: chatContainer.current?.scrollTop ?? 0,
      };
    });
    scrollChat();
  }, []);
  useEffect(() => {
    if (!chatContainer.current || prevData.current.length > data.length) return;
    const scrollDistance = chatContainer.current.scrollTop;
    const scrollHeight = chatContainer.current.scrollHeight;
    const clientHeight = chatContainer.current.clientHeight;
    const unscrolledHeigth = scrollHeight - scrollDistance - clientHeight; // heigth hidden in the bottom
    const lastMessage = data[data.length - 1];

    if (lastMessage?._id === lastCapturedMessage.current?._id) return;
    lastCapturedMessage.current = lastMessage;

    if (unscrolledHeigth > 250) {
      if (
        !isFirstRender.current && // so it scroll when switching conversations
        prevData.current.length !== data.length && // so it scroll when data isLoaded
        lastMessage && // if message is undefined
        lastMessage.sender._id !== userData?.userId // if last sender is not user
      )
        return toggleScroller();
    }
    scrollChat();
  }, [data]);

  useEffect(() => {
    const upLoadHandler = () => {
      if (!chatContainer.current) return;
      const scrollableDiv = chatContainer.current;
      const scrollTop = scrollableDiv.scrollTop;
      // let scrollHeight = scrollableDiv.scrollHeight;
      // let clientHeight = scrollableDiv.clientHeight;

      if (
        scrollTop <= 0 && conversationProps
          ? !conversationProps.loadedLast
          : false
      ) {
        fetchMessages();
      }
    };
    chatContainer.current?.addEventListener("scroll", upLoadHandler);
    return () => {
      chatContainer.current?.removeEventListener("scroll", upLoadHandler);
    };
  }, [chatContainer.current, conversationProps]);
  // console.log("props dd", conversationProps);

  useEffect(() => {
    prevData.current = data;
    isFirstRender.current = false;
  }, [data]);

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

  function deleteMessage(message: Message) {
    let messageId = message._id;
    if (message.trueId) messageId = message.trueId;
    deleteMessageApi(userData?.access_token ?? "undefined", messageId).then(
      () => {
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
      }
    );
  }

  return (
    <div className={classes.ChatHandler} ref={chatContainer}>
      {isLoading && (
        <div className={classes.UpperLoader}>
          <BasicSpinner spinning size="small" />
        </div>
      )}
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
            deleteMessage,
            userData?.userId ?? "undefined"
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

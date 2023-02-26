import axios from "axios";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ChatHandler from "../shared/components/ChatHandler/ChatHandler";
import InputHandler from "../shared/components/InputHandler/InputHandler";
import classes from "./PrivateCoversation.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { ChatActions } from "../../../../store/slices/ChatSlice";
import ContactHeader from "./components/ContactHeader/ContactHeader";
import { AnimatePresence, motion } from "framer-motion";
import { pageAnimation } from "../shared/animation/animationHandler";

function PrivateConversation() {
  const { conversationId } = useParams();

  const conversation = useSelector(
    (state) => state.chat.conversations[conversationId]
  );
  const messages = conversation ? conversation.messages : [];

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();
  const chatContainer = useRef();
  const userData = useSelector((state) => state.auth.userData);

  const fetchMessages = useCallback(
    (conversationId) => {
      setIsLoading(true);
      setIsError(false);

      axios
        .get("api/messagerie/messages/" + conversationId, {
          headers: {
            authorization: "Bearer " + userData.access_token,
          },
        })
        .then((res) => {
          dispatch(ChatActions.emit({ event: "chat", data: conversationId }));

          dispatch(
            ChatActions.setConversation({
              conversation_id: conversationId,
              data: res.data,
            })
          );
        })
        .catch((err) => {
          console.log("fetching messages error", err);
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [conversationId]
  );

  useEffect(() => {
    if (!conversation) fetchMessages(conversationId);
  }, [conversationId]);

  useEffect(() => {
    setTimeout(() => {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }, 80);
  }, [messages, conversationId]);
  return (
    <motion.div {...pageAnimation} className={classes.Conversation}>
      <ContactHeader />
      <ChatHandler
        isLoading={isLoading}
        isError={isError}
        chatContainer={chatContainer}
        data={messages}
        fetchMessages={fetchMessages}
        key={conversationId}
      />
      <InputHandler
        sendAllowed={!isError && !isLoading}
        textMessageUrl="api/messagerie/messages/"
        voiceMessageUrl="api/messagerie/voice/"
        imageMessageUrl="api/messagerie/image/"
        conversationId={conversationId}
      />
    </motion.div>
  );
}

export default PrivateConversation;

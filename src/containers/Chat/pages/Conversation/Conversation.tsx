import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useParams } from "react-router-dom";
import { getConversation } from "../../../../client/ApiClient";
import { ChatActions } from "../../../../store/slices/ChatSlice";
import { motion } from "framer-motion";
import InputHandler from "../shared/components/InputHandler/InputHandler";
import PrivateConversation from "./components/PrivateConversation/PrivateConversation";
import PublicConversation from "./components/GroupConversation/GroupConversation";
import C from "./Conversation.module.scss";
import { pageAnimation } from "../shared/animation/animationHandler";
import { useAppSelector } from "../../../../store/ReduxHooks";
import GroupConversation from "./components/GroupConversation/GroupConversation";
const Conversation = () => {
  const { conversationId = "undefined" } = useParams();

  const userData = useAppSelector((state) => state.auth.userData);

  const conversation = useAppSelector(
    (state) => state.chat.conversations[conversationId]
  );
  const messages = conversation ? conversation.messages : [];

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();

  const fetchMessages = () => {
    const isAdditionalMessages = conversation
      ? conversation.messages.length
      : false;
    if (!isAdditionalMessages) {
      setIsLoading(true);
    }

    console.log("foootch");

    setIsError(false);
    console.log("fetching from : ", conversation);
    getConversation(conversationId, userData?.access_token ?? "undefined", {
      skip: conversation?.messages.length ?? 0,
    })
      .then((res) => {
        dispatch(ChatActions.emit({ event: "chat", data: conversationId }));

        dispatch(ChatActions.setConversation(res.data));
      })
      .catch((err) => {
        console.log("fetching messages error", err);
        if (!isAdditionalMessages) setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!conversation) fetchMessages();
  }, [conversationId]);

  return (
    <motion.div {...pageAnimation} className={C.Conversation}>
      <Routes>
        <Route
          element={
            <PublicConversation
              data={messages}
              fetchMessages={fetchMessages}
              isError={isError}
              isLoading={isLoading}
            />
          }
          path="/"
        />
        <Route
          element={
            <GroupConversation
              data={messages}
              fetchMessages={fetchMessages}
              isError={isError}
              isLoading={isLoading}
            />
          }
          path="/group"
        />
        <Route
          element={
            <PrivateConversation
              data={messages}
              fetchMessages={fetchMessages}
              isError={isError}
              isLoading={isLoading}
            />
          }
          path="/:contactId/private"
        />
      </Routes>

      <InputHandler
        sendAllowed={!isError && !isLoading}
        conversationId={conversationId}
      />
    </motion.div>
  );
};

export default Conversation;

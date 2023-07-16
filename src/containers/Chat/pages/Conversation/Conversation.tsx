import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useParams } from "react-router-dom";
import { getConversation } from "../../../../client/ApiClient";
import { ChatActions } from "../../../../store/slices/ChatSlice";
import { motion } from "framer-motion";
import InputHandler from "../shared/components/InputHandler/InputHandler";
import PrivateConversation from "./components/PrivateConversation/PrivateConversation";
import PublicConversation from "./components/PublicConversation/PublicConversation";
import C from "./Conversation.module.scss";
import { pageAnimation } from "../shared/animation/animationHandler";
import { useAppSelector } from "../../../../store/ReduxHooks";
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

  const fetchMessages = useCallback(() => {
    setIsLoading(true);
    setIsError(false);

    getConversation(conversationId, userData?.access_token ?? "undefined")
      .then((res) => {
        dispatch(ChatActions.emit({ event: "chat", data: conversationId }));
        console.log(res.data);
        dispatch(ChatActions.setConversation(res.data));
      })
      .catch((err) => {
        console.log("fetching messages error", err);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [conversationId]);

  useEffect(() => {
    if (!conversation) fetchMessages();
  }, [conversationId]);

  return (
    <motion.div {...pageAnimation} className={C.Conversation}>
      <Routes>
        <Route
          element={
            <PrivateConversation
              data={messages}
              fetchMessages={fetchMessages}
              isError={isError}
              isLoading={isLoading}
            />
          }
          path="/:contactId"
        />
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
      </Routes>

      <InputHandler
        sendAllowed={!isError && !isLoading}
        conversationId={conversationId}
      />
    </motion.div>
  );
};

export default Conversation;

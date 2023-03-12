import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import { getConversation } from "../../../../client/ApiClient";
import { ChatActions } from "../../../../store/slices/ChatSlice";
import { AnimatePresence, motion } from "framer-motion";
import InputHandler from "../shared/components/InputHandler/InputHandler";
import PrivateConversation from "./components/PrivateConversation/PrivateConversation";
import PublicConversation from "./components/PublicConversation/PublicConversation";
import C from "./Conversation.module.scss";
import { pageAnimation } from "../shared/animation/animationHandler";
const Conversation = () => {
  const { conversationId } = useParams();
  const location = useLocation();
  const userData = useSelector((state) => state.auth.userData);
  const conversation = useSelector(
    (state) => state.chat.conversations[conversationId]
  );
  const messages = conversation ? conversation.messages : [];
  console.log("userData : ", userData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();

  const fetchMessages = useCallback(
    (conversationId) => {
      setIsLoading(true);
      setIsError(false);

      getConversation(conversationId, userData.access_token)
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

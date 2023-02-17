import axios from "axios";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ChatActions } from "../../../../store/slices/ChatSlice";
import ChatHandler from "../shared/components/ChatHandler/ChatHandler";
import InputHandler from "../shared/components/InputHandler/InputHandler";
import ChatHeader from "./components/ChatHeader/ChatHeader";
import c from "./PublicConversation.module.scss";

const PublicConversation = () => {
  const [isLoading, setIsLoading] = useState();
  const [isError, setIsError] = useState();
  const { id: conversationId } = useParams();

  const publicConversation = useSelector(
    (state) => state.chat.conversations[conversationId]
  );
  const messages = publicConversation || [];
  const userData = useSelector((state) => state.auth.userData);

  const dispatch = useDispatch();

  function fetchPublicMessages() {
    setIsLoading(true);
    setIsError(false);
    axios
      .get("/api/messagerie/public/messages/" + conversationId, {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then((res) => {
        dispatch(
          ChatActions.setConversationMessages({
            conversation_id: conversationId,
            conversationData: res.data,
          })
        );

        dispatch(ChatActions.emit({ event: "chat", data: conversationId }));
      })
      .catch((err) => {
        console.log("fetching public messages error", err);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (!publicConversation) fetchPublicMessages();
  }, [conversationId]);

  return (
    <div className={c.PublicConversation}>
      <ChatHeader />
      <ChatHandler
        data={messages}
        isLoading={isLoading}
        isError={isError}
        fetchMessages={fetchPublicMessages}
      />
      <InputHandler
        sendAllowed={!isError && !isLoading}
        textMessageUrl="api/messagerie/public/messages/"
        voiceMessageUrl="api/messagerie/public/voice/"
        imageMessageUrl="api/messagerie/public/image/"
        conversationId={conversationId}
      />
    </div>
  );
};

export default PublicConversation;

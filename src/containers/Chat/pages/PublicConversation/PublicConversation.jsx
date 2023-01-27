import axios from "axios";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ChatHandler from "./components/ChatHandler/ChatHandler";
import InputHandler from "./components/InputHandler/InputHandler";
import classes from "./PublicCoversation.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { ChatActions } from "../../../../store/slices/ChatSlice";
import ContactHeader from "./components/ContactHeader/ContactHeader";

function PublicConversation({}) {
  const { id } = useParams();
  const messages = useSelector((state) => state.chat.conversations[id]) || [];
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();
  const chatContainer = useRef();
  const userData = useSelector((state) => state.auth.userData);

  const fetchMessages = useCallback(
    (id) => {
      setIsLoading(true);
      setIsError(false);

      axios
        .get("api/messagerie/messages/" + id, {
          headers: {
            authorization: "Bearer " + userData.access_token,
          },
        })
        .then((res) => {
          dispatch(ChatActions.emit({ event: "private chat", data: id }));

          dispatch(
            ChatActions.setConversationMessages({
              conversation_id: id,
              conversationData: res.data,
            })
          );
        })
        .catch((err) => {
          console.log("fetch messages error", err);
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [id]
  );

  useEffect(() => {
    fetchMessages(id);
  }, [id]);

  useEffect(() => {
    chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
  }, [messages]);
  return (
    <div className={classes.Conversation}>
      <ContactHeader />
      <ChatHandler
        isLoading={isLoading}
        isError={isError}
        chatContainer={chatContainer}
        data={messages}
        fetchMessages={fetchMessages}
      />
      <InputHandler sendAllowed={!isError && !isLoading} />
    </div>
  );
}

export default PublicConversation;

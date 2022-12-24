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

function PublicConversation({}) {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const chatSocket = useSelector((state) => state.chat.chatSocket);
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
          chatSocket.emit("private chat", id);
          chatSocket.off("receive message");
          chatSocket.on("receive message", (message) => {
            if (message.conversation !== id) return;
            setMessages((prevMessages) => {
              const newMessages = [...prevMessages, message];
              return newMessages;
            });
          });
          setMessages(res.data);
          console.log("fetched messages :", res.data);
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
      <div
        className={classes.ContactHeader}
        onClick={() => {
          dispatch(ChatActions.OpenNav());
        }}
      ></div>
      <ChatHandler
        isLoading={isLoading}
        isError={isError}
        chatContainer={chatContainer}
        data={messages}
        fetchMessages={fetchMessages}
      />
      <InputHandler
        sendAllowed={!isError && !isLoading}
        chatSocket={chatSocket}
        setMessages={setMessages}
      />
    </div>
  );
}

export default PublicConversation;

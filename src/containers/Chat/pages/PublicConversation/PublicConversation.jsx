import axios from "axios";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ChatHandler from "./components/ChatHandler/ChatHandler";
import InputHandler from "./components/InputHandler/InputHandler";
import classes from "./PublicCoversation.module.scss";
import { useSelector } from "react-redux";
function PublicConversation({}) {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [loadStatus, setLoadStatus] = useState("loading");
  const chatSocket = useSelector((state) => state.chatSocket);
  const chatContainer = useRef();
  const previousId = useRef(null);

  const fetchMessages = useCallback(
    (id) => {
      setLoadStatus("loading");

      axios
        .get("api/messagerie/messages/" + id, {
          headers: {
            authorization:
              "Bearer " +
              JSON.parse(localStorage.getItem("userData")).access_token,
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
          setLoadStatus("success");
          setMessages(res.data);
        })
        .catch((err) => {
          console.log("fetch messages error", err);
          setLoadStatus("failed");
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
      <div className={classes.ContactHeader}></div>
      <ChatHandler
        loadStatus={loadStatus}
        chatContainer={chatContainer}
        data={messages}
      />
      <InputHandler chatSocket={chatSocket} setMessages={setMessages} />
    </div>
  );
}

export default PublicConversation;

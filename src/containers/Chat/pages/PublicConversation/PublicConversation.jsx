import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ChatHandler from "./components/ChatHandler/ChatHandler";
import InputHandler from "./components/InputHandler/InputHandler";
import classes from "./PublicCoversation.module.scss";

function PublicConversation() {
  const { id } = useParams();
  const [messages, setMessages] = useState();
  useEffect(() => {
    setMessages(null);
    axios
      .get("api/messagerie/messages/" + id, {
        headers: {
          authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("userData")).access_token,
        },
      })
      .then((res) => setMessages(res.data))
      .catch((err) => {
        console.log("fetch messages error", err);
      });
  }, [id]);

  return (
    <div className={classes.Conversation}>
      <div className={classes.ContactHeader}></div>
      <ChatHandler data={messages} />
      <InputHandler />
    </div>
  );
}

export default PublicConversation;

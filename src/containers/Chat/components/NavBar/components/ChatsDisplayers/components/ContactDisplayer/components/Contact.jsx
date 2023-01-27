import c from "./Contact.module.scss";
import { NavLink } from "react-router-dom";
import { Avatar, message } from "antd";
import { ChatActions } from "../../../../../../../../../store/slices/ChatSlice";
import { useDispatch, useSelector } from "react-redux";
import { ComponentActions } from "../../../../../../../../../store/slices/ComponentSlice";
import { useEffect } from "react";
import { useCallback } from "react";
import axios from "axios";
const Contact = ({ contactInfo, userData }) => {
  const messages =
    useSelector((state) => state.chat.conversations[contactInfo._id]) || [];

  const dispatch = useDispatch();

  const fetchMessages = useCallback(() => {
    axios
      .get("api/messagerie/messages/" + contactInfo._id, {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then((res) => {
        dispatch(
          ChatActions.emit({ event: "private chat", data: contactInfo._id })
        );

        dispatch(
          ChatActions.setConversationMessages({
            conversation_id: contactInfo._id,
            conversationData: res.data,
          })
        );
      })
      .catch((err) => {
        console.log("fetch messages error" + contactInfo._id, err);
      })
      .finally(() => {});
  }, []);

  const getLastMessage = () => {
    if (messages.length === 0) return "";

    const lastMessage = messages[messages.length - 1];
    const sender = lastMessage.sender === userData.userId ? "you : " : "";
    switch (lastMessage.content_type) {
      case "text":
        return sender + lastMessage.message;
      case "voice":
        return sender + "sent voice message";
      default:
        return sender + "sent attachement";
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <NavLink
      to={"/chats/private/" + contactInfo._id}
      className={({ isActive }) =>
        c.ContactLink + (isActive ? ` ${c.active}` : "")
      }
      onClick={() => {
        dispatch(ComponentActions.closeNav());
      }}
    >
      <div className={c.Contact}>
        <Avatar
          src={contactInfo.user.profile_picture}
          size={40}
          style={{
            fontSize: "1rem",
          }}
        >
          {contactInfo.user.username[0]}
        </Avatar>
        <div className={c.InfoHolder}>
          <div className={c.UsernameHolder}>{contactInfo.user.username}</div>
          <div className={c.LastMessageHolder}>{getLastMessage()}</div>
        </div>
      </div>
    </NavLink>
  );
};

export default Contact;

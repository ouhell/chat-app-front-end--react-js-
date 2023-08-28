import c from "./Contact.module.scss";
import { NavLink } from "react-router-dom";
import { Avatar } from "antd";
import { ChatActions } from "../../../../../../../../../store/slices/ChatSlice";
import { useDispatch } from "react-redux";
import { ComponentActions } from "../../../../../../../../../store/slices/ComponentSlice";
import { useEffect } from "react";
import { useCallback } from "react";

import { getConversation } from "../../../../../../../../../client/ApiClient";
import { useAppSelector } from "../../../../../../../../../store/ReduxHooks";

type ContactProps = {
  contactInfo: Contact;
};

const Contact = ({ contactInfo }: ContactProps) => {
  const conversation = useAppSelector(
    (state) => state.chat.conversations[contactInfo._id]
  );
  const userData = useAppSelector((state) => state.auth.userData);

  const messages = conversation ? conversation.messages : [];

  const dispatch = useDispatch();

  const fetchMessages = useCallback(() => {
    getConversation(contactInfo._id, userData?.access_token ?? "undefined", {
      skip: 0,
    })
      .then((res) => {
        dispatch(ChatActions.emit({ event: "chat", data: contactInfo._id }));

        dispatch(ChatActions.setConversation(res.data));
      })
      .catch((err) => {
        console.log("fetch messages error" + contactInfo._id, err);
      });
  }, []);

  const getLastMessage = () => {
    if (messages.length === 0) return "";

    const lastMessage = messages[messages.length - 1];
    const sender = lastMessage.sender._id === userData?.userId ? "you : " : "";
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
    if (!conversation) fetchMessages();
    else {
      dispatch(ChatActions.emit({ event: "chat", data: contactInfo._id }));
    }
  }, []);

  return (
    <NavLink
      to={"/chats/" + contactInfo._id + "/" + contactInfo.user._id + "/private"}
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

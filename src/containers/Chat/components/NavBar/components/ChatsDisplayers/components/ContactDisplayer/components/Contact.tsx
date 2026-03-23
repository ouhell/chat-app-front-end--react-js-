import c from "./Contact.module.scss";
import { NavLink } from "react-router-dom";
import { Avatar } from "antd";
import { useDispatch } from "react-redux";
import { ComponentActions } from "../../../../../../../../../store/slices/ComponentSlice";
import { getConversation } from "../../../../../../../../../client/ApiClient";
import { useAppSelector } from "../../../../../../../../../store/ReduxHooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../../../../../../../client/queryKeys";
import { flattenConversationMessages } from "../../../../../../../../../client/queryHelpers";

type ContactProps = {
  contactInfo: Contact;
};

const Contact = ({ contactInfo }: ContactProps) => {
  const userData = useAppSelector((state) => state.auth.userData);
  const conversationQuery = useInfiniteQuery({
    queryKey: queryKeys.conversation(contactInfo._id),
    queryFn: async ({ pageParam = 0 }) => {
      const res = await getConversation(contactInfo._id, { skip: pageParam });
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: () => undefined,
  });
  const messages = flattenConversationMessages(conversationQuery.data);

  const dispatch = useDispatch();

  const getLastMessage = () => {
    if (messages.length === 0) return "No messages yet";

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
          size={42}
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
          }}
        >
          {contactInfo.user.username[0]?.toUpperCase()}
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

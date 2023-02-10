import c from "./Conversation.module.scss";
import { NavLink } from "react-router-dom";

const Conversation = ({ data }) => {
  return (
    <NavLink
      to={"/chats/public/" + data._id}
      className={({ isActive }) => {
        return c.ConversationLink + (isActive ? " " + c.active : "");
      }}
    >
      <div className={c.Conversation}>{data.name}</div>
    </NavLink>
  );
};

export default Conversation;

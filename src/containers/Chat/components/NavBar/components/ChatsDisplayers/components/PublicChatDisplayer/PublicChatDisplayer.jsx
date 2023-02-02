import { NavLink } from "react-router-dom";
import c from "./PublicChatDisplayer.module.scss";

const PublicChatDisplayer = () => {
  return (
    <div className={c.PublicChatDisplayer}>
      <NavLink to={"/chats/public"}>Public Chat</NavLink>
    </div>
  );
};
export default PublicChatDisplayer;

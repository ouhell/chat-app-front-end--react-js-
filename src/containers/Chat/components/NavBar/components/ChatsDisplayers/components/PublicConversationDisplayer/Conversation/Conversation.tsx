import c from "./Conversation.module.scss";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ComponentActions } from "../../../../../../../../../store/slices/ComponentSlice";

const Conversation = ({ data }: { data: Conversation }) => {
  const dispatch = useDispatch();

  return (
    <NavLink
      to={"/chats/" + data._id}
      className={({ isActive }) => {
        return c.ConversationLink + (isActive ? " " + c.active : "");
      }}
      onClick={() => {
        dispatch(ComponentActions.closeNav());
      }}
    >
      <div className={c.Conversation}>{data.name}</div>
    </NavLink>
  );
};

export default Conversation;

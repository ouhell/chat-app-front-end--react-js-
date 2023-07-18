import c from "./Conversation.module.scss";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ComponentActions } from "../../../../../../../../../store/slices/ComponentSlice";
import { useEffect } from "react";
import { ChatActions } from "../../../../../../../../../store/slices/ChatSlice";
import { getConversation } from "../../../../../../../../../client/ApiClient";
import { useAppSelector } from "../../../../../../../../../store/ReduxHooks";

const Conversation = ({ data }: { data: Conversation }) => {
  const dispatch = useDispatch();
  const conversation = useAppSelector(
    (state) => state.chat.conversations[data._id]
  );
  const userData = useAppSelector((state) => state.auth.userData);

  const fetchMessages = () => {
    getConversation(data._id, userData?.access_token ?? "undefined")
      .then((res) => {
        dispatch(ChatActions.emit({ event: "chat", data: data._id }));

        dispatch(ChatActions.setConversation(res.data));
      })
      .catch((err) => {
        console.log("fetching public messages error", err);
      });
  };

  useEffect(() => {
    if (!conversation) fetchMessages();
    else dispatch(ChatActions.emit({ event: "chat", data: data._id }));
  }, []);

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

import c from "./Conversation.module.scss";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ComponentActions } from "../../../../../../../../../store/slices/ComponentSlice";
import { useEffect } from "react";
import { ChatActions } from "../../../../../../../../../store/slices/ChatSlice";
import { getConversation } from "../../../../../../../../../client/ApiClient";

const Conversation = ({ data }) => {
  const dispatch = useDispatch();
  const conversation = useSelector(
    (state) => state.chat.conversations[data._id]
  );
  const userData = useSelector((state) => state.auth.userData);

  const fetchMessages = () => {
    getConversation(data._id, userData.access_token)
      .then((res) => {
        dispatch(ChatActions.emit({ event: "chat", data: data._id }));

        dispatch(
          ChatActions.setConversation({
            conversation_id: data._id,
            data: res.data,
          })
        );
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

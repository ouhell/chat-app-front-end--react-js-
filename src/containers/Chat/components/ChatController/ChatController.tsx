import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ChatActions } from "../../../../store/slices/ChatSlice";
import { getContactRequests } from "../../../../client/ApiClient";
import { useAppSelector } from "../../../../store/ReduxHooks";
const ChatController = () => {
  const { pathname } = useLocation();

  const userData = useAppSelector((state) => state.auth.userData);

  const dispatch = useDispatch();

  const fetchNotifications = () => {
    getContactRequests(userData?.access_token ?? "undefined")
      .then((res) => {
        dispatch(ChatActions.setRequests(res.data));
        dispatch(
          ChatActions.on({
            event: "receive request",
            callback: (request) => {
              dispatch(ChatActions.addRequest(request));
            },
          })
        );
        dispatch(
          ChatActions.on({
            event: "canceled request",
            callback: (requestId) => {
              dispatch(ChatActions.removeRequest(requestId));
            },
          })
        );
      })
      .catch((err) => {
        console.log("fetch request error :", err);
      });
  };

  useEffect(() => {
    fetchNotifications();

    dispatch(
      ChatActions.emit({
        event: "self connect",
        data: userData?.userId,
      })
    );

    dispatch(
      ChatActions.on({
        event: "receive message",
        callback: (message) => {
          dispatch(
            ChatActions.addMessage({
              conversation_id: message.conversation,
              newMessage: message,
            })
          );
        },
      })
    );

    dispatch(
      ChatActions.on({
        event: "remove message",
        callback: (message) => {
          const messageId = message.trueId ? message.trueId : message._id;
          dispatch(
            ChatActions.deleteMessage({
              conversation_id: message.conversation,
              id: messageId,
            })
          );
        },
      })
    );
  }, []);

  return <></>;
};

export default ChatController;

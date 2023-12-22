import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ChatActions } from "../../../../store/slices/ChatSlice";
import { getContactRequests, getContacts } from "../../../../client/ApiClient";
import { useAppSelector } from "../../../../store/ReduxHooks";
const ChatController = () => {
  const userData = useAppSelector((state) => state.auth.userData);

  const dispatch = useDispatch();

  const fetchContacts = () => {
    getContacts(userData?.access_token ?? "undefined").then((res) => {
      dispatch(ChatActions.setContacts(res.data));
    });
  };

  const fetchNotifications = () => {
    getContactRequests(userData?.access_token ?? "undefined").then((res) => {
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
    });
  };

  useEffect(() => {
    fetchNotifications();

    dispatch(
      ChatActions.on({
        event: "accepted request",
        callback: (request: Request) => {
          dispatch(ChatActions.removeRequest(request._id));
          fetchContacts();
        },
      })
    );

    dispatch(
      ChatActions.emit({
        event: "self connect",
        data: userData?.userId,
      })
    );

    dispatch(
      ChatActions.on({
        event: "receive message",
        callback: (mess) => {
          const message = mess as Message;
          dispatch(
            ChatActions.addMessage({
              conversation_id: message.conversation,
              newMessage: message as Message,
            })
          );
        },
      })
    );

    dispatch(
      ChatActions.on({
        event: "remove message",
        callback: (mess) => {
          const message = mess as Message;
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

    dispatch(
      ChatActions.on({
        event: "added Conversation",
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        callback: () => {},
      })
    );

    dispatch(
      ChatActions.on({
        event: "user blocked",
        callback: (conversation_id: string, user_id: string) => {
          console.log("received socket block", {
            convID: conversation_id,
            blockedMF: user_id,
          });
          ChatActions.setUserBanned({
            bannedUser: user_id,
            conversationId: conversation_id,
          });
        },
      })
    );
  }, []);

  return <></>;
};

export default ChatController;

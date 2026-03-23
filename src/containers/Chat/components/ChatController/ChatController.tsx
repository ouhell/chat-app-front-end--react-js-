import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ChatActions } from "../../../../store/slices/ChatSlice";
import {
  apiRefresh,
  getContactRequests,
  getContacts,
} from "../../../../client/ApiClient";
import { useAppSelector } from "../../../../store/ReduxHooks";
import { AuthActions } from "../../../../store/slices/AuthSlice";
import { AxiosError, HttpStatusCode } from "axios";
const ChatController = () => {
  const userData = useAppSelector((state) => state.auth.userData);

  const dispatch = useDispatch();

  const fetchContacts = () => {
    getContacts().then((res) => {
      dispatch(ChatActions.setContacts(res.data));
    });
  };

  const fetchNotifications = () => {
    getContactRequests().then((res) => {
      dispatch(ChatActions.setRequests(res.data));
      dispatch(
        ChatActions.on({
          event: "receive request",
          callback: (request) => {
            console.log("received request ::", request);
            dispatch(ChatActions.addRequest(request));
          },
        }),
      );
      dispatch(
        ChatActions.on({
          event: "canceled request",
          callback: (requestId) => {
            dispatch(ChatActions.removeRequest(requestId));
          },
        }),
      );
    });
  };

  useEffect(() => {
    if (!userData) return;

    const refresher = setInterval(
      () => {
        console.log("refreshing");
        apiRefresh()
          .then((res) => {
            console.log("refreshed");
            dispatch(AuthActions.login(res.data));
          })
          .catch((err: AxiosError) => {
            console.log(err);
            if (err.status == HttpStatusCode.Forbidden)
              dispatch(AuthActions.logout());
          });
      },
      5 * 60 * 1000,
    ); // every 5 min

    return () => {
      clearInterval(refresher);
    };
  }, [userData]);

  useEffect(() => {
    fetchNotifications();

    dispatch(
      ChatActions.on({
        event: "accepted request",
        callback: (request: Request) => {
          dispatch(ChatActions.removeRequest(request._id));
          fetchContacts();
        },
      }),
    );

    dispatch(
      ChatActions.emit({
        event: "self connect",
        data: userData?.userId,
      }),
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
            }),
          );
        },
      }),
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
            }),
          );
        },
      }),
    );

    dispatch(
      ChatActions.on({
        event: "added Conversation",
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        callback: () => {},
      }),
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
      }),
    );
  }, []);

  return <></>;
};

export default ChatController;

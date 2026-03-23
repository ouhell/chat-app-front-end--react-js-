import { useEffect } from "react";
import { ChatActions } from "../../../../store/slices/ChatSlice";
import { apiRefresh } from "../../../../client/ApiClient";
import { useAppDispatch, useAppSelector } from "../../../../store/ReduxHooks";
import { AuthActions } from "../../../../store/slices/AuthSlice";
import { AxiosError, HttpStatusCode } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../client/queryKeys";
import {
  appendMessageToConversation,
  removeMessageFromConversation,
  setConversationBlockedUser,
} from "../../../../client/queryHelpers";
const ChatController = () => {
  const userData = useAppSelector((state) => state.auth.userData);

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

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
  }, [dispatch, userData]);

  useEffect(() => {
    dispatch(
      ChatActions.on({
        event: "accepted request",
        callback: (request: Request) => {
          queryClient.setQueryData<Request[]>(queryKeys.requests, (oldData) => {
            if (!oldData) return oldData;
            return oldData.filter((req) => req._id !== request._id);
          });
          queryClient.invalidateQueries({ queryKey: queryKeys.contacts });
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
          appendMessageToConversation(
            queryClient,
            message.conversation as unknown as string,
            message as Message,
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
          removeMessageFromConversation(
            queryClient,
            message.conversation as unknown as string,
            messageId,
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
          setConversationBlockedUser(
            queryClient,
            conversation_id,
            user_id,
            true,
          );
        },
      }),
    );

    dispatch(
      ChatActions.on({
        event: "receive request",
        callback: (request: Request) => {
          queryClient.setQueryData<Request[]>(queryKeys.requests, (oldData) => {
            if (!oldData) return [request];
            if (oldData.some((req) => req._id === request._id)) return oldData;
            return [...oldData, request];
          });
        },
      }),
    );

    dispatch(
      ChatActions.on({
        event: "canceled request",
        callback: (requestId: string) => {
          queryClient.setQueryData<Request[]>(queryKeys.requests, (oldData) => {
            if (!oldData) return oldData;
            return oldData.filter((request) => request._id !== requestId);
          });
        },
      }),
    );
  }, [dispatch, queryClient, userData?.userId]);

  return <></>;
};

export default ChatController;

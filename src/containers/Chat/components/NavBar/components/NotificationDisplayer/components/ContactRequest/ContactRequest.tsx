import c from "./ContactRequest.module.scss";
import { Avatar, Button } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";

import { ChatActions } from "../../../../../../../../store/slices/ChatSlice";
import {
  addContact,
  deleteContactRequest,
} from "../../../../../../../../client/ApiClient";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../../../store/ReduxHooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../../../../../client/queryKeys";

type ContactRequestProps = {
  requestData: Request;
};

const ContactRequest = ({ requestData }: ContactRequestProps) => {
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const userData = useAppSelector((state) => state.auth.userData);

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const cancelRequestMutation = useMutation({
    mutationFn: () => deleteContactRequest(requestData._id),
  });

  const acceptRequestMutation = useMutation({
    mutationFn: () => addContact(requestData._id),
    onSuccess: () => {
      queryClient.setQueryData<Request[]>(queryKeys.requests, (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter((req) => req._id !== requestData._id);
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts });
    },
  });

  const cancelRequest = () => {
    if (isCancelLoading || isAcceptLoading) return;

    setIsCancelLoading(true);

    cancelRequestMutation
      .mutateAsync()
      .then(() => {
        queryClient.setQueryData<Request[]>(queryKeys.requests, (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter((req) => req._id !== requestData._id);
        });

        dispatch(
          ChatActions.emit({
            event: "cancel request",
            data: requestData,
          }),
        );
      })
      .catch((err) => {
        if (err.response?.data?.servedError && err.response.data.code === 404) {
          queryClient.setQueryData<Request[]>(queryKeys.requests, (oldData) => {
            if (!oldData) return oldData;
            return oldData.filter((req) => req._id !== requestData._id);
          });
          return;
        }

        setIsCancelLoading(false);
      });
  };

  const acceptRequest = () => {
    if (isCancelLoading || isAcceptLoading) return;

    setIsAcceptLoading(true);

    acceptRequestMutation
      .mutateAsync()
      .then(() => {
        dispatch(
          ChatActions.emit({
            event: "cancel request",
            data: requestData,
          }),
        );
        dispatch(
          ChatActions.emit({
            event: "accept request",
            data: requestData,
          }),
        );
      })
      .catch((err) => {
        console.log("accept req err", err);
        setIsAcceptLoading(false);
      });
  };

  const userIsSender = requestData.requester._id === userData?.userId;
  const opponent = userIsSender
    ? requestData.destinator
    : requestData.requester;

  const dateLabel = useMemo(() => {
    const reqDate = new Date(requestData.date);
    if (Number.isNaN(reqDate.getTime())) return "recently";

    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(reqDate);
  }, [requestData.date]);

  return (
    <article className={c.Request}>
      <div className={c.UpperRow}>
        <Avatar className={c.Avatar} src={opponent.profile_picture} size={46}>
          {opponent.username[0]}
        </Avatar>
        <div className={c.IdentityHolder}>
          <div className={c.Username}>{opponent.username}</div>
          <div className={c.Personalname}>{opponent.personal_name}</div>
        </div>
        <div className={c.TimeStamp}>
          <ClockCircleOutlined />
          <span>{dateLabel}</span>
        </div>
      </div>

      <div className={c.NotificationText}>
        {userIsSender
          ? `You sent ${opponent.username} a contact request.`
          : `${opponent.username} wants to add you as a contact.`}
      </div>

      <div className={c.ActionHolder}>
        {!userIsSender ? (
          <Button
            disabled={isCancelLoading}
            type="default"
            className={c.AcceptButton}
            onClick={acceptRequest}
            loading={isAcceptLoading}
          >
            Accept
          </Button>
        ) : null}
        <Button
          className={c.CancelButton}
          disabled={isAcceptLoading}
          onClick={cancelRequest}
          loading={isCancelLoading}
        >
          {userIsSender ? "Cancel request" : "Decline"}
        </Button>
      </div>
    </article>
  );
};

export default ContactRequest;

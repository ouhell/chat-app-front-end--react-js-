import c from "./ContactRequest.module.scss";
import { Avatar, Button } from "antd";
import { useState } from "react";

import { useDispatch } from "react-redux";
import { ChatActions } from "../../../../../../../../store/slices/ChatSlice";
import {
  addContact,
  deleteContactRequest,
  getContacts,
} from "../../../../../../../../client/ApiClient";
import { useAppSelector } from "../../../../../../../../store/ReduxHooks";
type ContactRequest = {
  requestData: Request;
  removeRequest: (id: string) => any;
};
const ContactRequest = ({ requestData }: ContactRequest) => {
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const userData = useAppSelector((state) => state.auth.userData);

  const dispatch = useDispatch();

  const fetchContacts = () => {
    getContacts(userData?.access_token ?? "undefined").then((res) => {
      dispatch(ChatActions.setContacts(res.data));
    });
  };

  const cancelRequest = () => {
    if (isCancelLoading || isAcceptLoading) return;

    setIsCancelLoading(true);

    deleteContactRequest(userData?.access_token ?? "undefined", requestData._id)
      .then((_) => {
        dispatch(ChatActions.removeRequest(requestData._id));

        dispatch(
          ChatActions.emit({
            event: "cancel request",
            data: requestData,
          })
        );
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.data) {
            if (err.response.data.servedError) {
              if (err.response.data.code === 404) {
                dispatch(ChatActions.removeRequest(requestData._id));
                return;
              }
            }
          }
        }

        setIsCancelLoading(false);
      });
  };

  const acceptRequest = () => {
    if (isCancelLoading || isAcceptLoading) return;

    setIsAcceptLoading(true);

    addContact(userData?.access_token ?? "undefined", requestData._id)
      .then(() => {
        dispatch(ChatActions.removeRequest(requestData._id));
        dispatch(
          ChatActions.emit({
            event: "cancel request",
            data: requestData,
          })
        );
        dispatch(
          ChatActions.emit({
            event: "accept request",
            data: requestData,
          })
        );
        // dispatch(
        //   ChatActions.addContact({
        //     newContact: res.data,
        //   })
        // );

        fetchContacts();
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

  return (
    <div className={c.Request} key={requestData._id}>
      <Avatar src={opponent.profile_picture}>{opponent.username[0]}</Avatar>
      <div className={c.IdentityHolder}>
        <div className={c.Username}>{opponent.username}</div>
        <div className={c.Personalname}>{opponent.personal_name}</div>
      </div>
      <div className={c.ActionHolder}>
        {!userIsSender && !isCancelLoading ? (
          <Button
            disabled={isCancelLoading}
            type="default"
            className={c.AcceptButton}
            onClick={() => acceptRequest()}
            loading={isAcceptLoading}
          >
            Accept
          </Button>
        ) : null}
        <Button
          className={c.CancelButton}
          disabled={isAcceptLoading}
          danger
          type="dashed"
          onClick={() => cancelRequest()}
          loading={isCancelLoading}
        >
          {userIsSender ? "Cancel" : "Refuse"}
        </Button>
      </div>
    </div>
  );
};

export default ContactRequest;

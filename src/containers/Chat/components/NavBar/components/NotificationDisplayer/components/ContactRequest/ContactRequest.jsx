import c from "./ContactRequest.module.scss";
import { Avatar, Button } from "antd";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ChatActions } from "../../../../../../../../store/slices/ChatSlice";
const ContactRequest = ({ requestData, userData, removerequest }) => {
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);

  const dispatch = useDispatch();

  const cancelRequest = () => {
    if (isCancelLoading || isAcceptLoading) return;

    setIsCancelLoading(true);

    axios
      .delete("api/userapi/request/" + requestData._id, {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then((res) => {
        dispatch(ChatActions.removeRequest(requestData._id));
        dispatch(
          ChatActions.emit({
            event: "cancel request",
            data: res.data,
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

    axios
      .post("api/userapi/user-contact/" + requestData._id, null, {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then((res) => {
        dispatch(ChatActions.removeRequest(requestData._id));
        const newContact = res.data.users.find(
          (user) => user._id !== userData.userId
        );
        if (newContact) {
          dispatch(
            ChatActions.addContact({
              newContact,
            })
          );
        }
      })
      .catch((err) => {
        console.log("accept req err", err);
        setIsAcceptLoading(false);
      });
  };

  const userIsSender = requestData.requester._id === userData.userId;
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

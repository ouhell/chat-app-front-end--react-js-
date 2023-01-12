import c from "./ContactRequest.module.scss";
import { Avatar, Button } from "antd";

const ContactRequest = ({
  requestData,
  requestStates,
  acceptRequest,
  cancelRequest,
  userId,
}) => {
  const userIsSender = requestData.requester._id === userId;
  const opponent = userIsSender
    ? requestData.destinator
    : requestData.requester;
  let isCancelLoading = false;
  let isAcceptLoading = false;
  if (requestStates[requestData._id]) {
    isCancelLoading = requestStates[requestData._id].isCancelLoading;
    isAcceptLoading = requestStates[requestData._id].isAcceptLoading;
  }
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
            onClick={() => acceptRequest(requestData._id)}
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
          onClick={() => cancelRequest(requestData._id)}
          loading={isCancelLoading}
        >
          {userIsSender ? "Cancel" : "Refuse"}
        </Button>
      </div>
    </div>
  );
};

export default ContactRequest;

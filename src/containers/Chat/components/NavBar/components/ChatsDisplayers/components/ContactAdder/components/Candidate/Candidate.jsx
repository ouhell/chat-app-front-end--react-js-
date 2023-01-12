import c from "./Candidate.module.scss";
import { Avatar, Button } from "antd";
const Candidate = ({
  candInfo,
  candidateState,
  sendRequest,
  cancelRequest,
}) => {
  let buttonLoading = false;
  let isCancelLoading = false;
  let isSent = false;

  if (candidateState[candInfo._id]) {
    buttonLoading = candidateState[candInfo._id].sendLoading;
    isSent = candidateState[candInfo._id].sent;
    isCancelLoading = candidateState[candInfo._id].isCancelLoading;
  }

  return (
    <div className={c.Candidate}>
      <Avatar src={candInfo.profile_picture}>{candInfo.username[0]}</Avatar>
      <div className={c.NameHolder}>
        <div className={c.UserName}>{candInfo.username}</div>
        <div className={c.PersonalName}>{candInfo.personal_name}</div>
      </div>
      <div className={c.ActionHolder}>
        {!isCancelLoading ? (
          <Button
            type={isSent ? "ghost" : "default"}
            className={isSent ? c.SentButton : c.ActionButton}
            onClick={() => {
              if (isSent) return;
              sendRequest(candInfo._id);
            }}
            loading={buttonLoading}
          >
            {isSent ? "Sent!" : "Send Request"}
          </Button>
        ) : null}
        {isSent ? (
          <Button
            danger
            type="dashed"
            style={{
              fontSize: "0.9rem",
            }}
            loading={isCancelLoading}
            onClick={() => {
              cancelRequest(candInfo._id);
            }}
          >
            Cancel
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default Candidate;

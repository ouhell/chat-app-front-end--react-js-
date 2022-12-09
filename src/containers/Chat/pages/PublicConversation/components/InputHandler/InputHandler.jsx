import classes from "./InputHandler.module.scss";
import {
  MicSvg,
  MoodSvg,
  SendArrowSvg,
  AttatchmentSvg,
} from "../../../../../../shared/assets/svg/SvgProvider";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const InputHandler = () => {
  const [message, setMessage] = useState("");
  const pathParams = useParams();

  const sendMessage = () => {
    const readyMessage = message.trim();
    if (readyMessage) {
      axios
        .post(
          "api/messagerie/messages",
          {
            message: readyMessage,
            conversation_id: pathParams.id,
          },
          {
            headers: {
              authorization:
                "Bearer " + JSON.parse(localStorage.getItem("token")),
            },
          }
        )
        .then((res) => console.log("res", res.data))
        .catch((err) => console.log("err", err));
    }
    setMessage("");
  };
  return (
    <div className={classes.InputHandler}>
      <div className={classes.InputHolder}>
        <AttatchmentSvg
          style={{
            rotate: "45deg",
          }}
        />
        <input
          placeholder="Type a message here"
          autoCorrect="false"
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            sendMessage();
          }}
          value={message}
          onChange={(e) => {
            // if (e.target.value.length > 200) return;
            setMessage(e.target.value);
          }}
        />
        <MoodSvg />
        <MicSvg />
        <div className={classes.Sender} onClick={sendMessage}>
          <SendArrowSvg />
        </div>
      </div>
    </div>
  );
};

export default InputHandler;

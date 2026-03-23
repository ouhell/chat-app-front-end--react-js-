import classes from "./InputHandler.module.scss";
import {
  MoodSvg,
  SendArrowSvg,
  AttatchmentSvg,
} from "../../../../../../shared/assets/svg/SvgProvider";
import { useRef, useState } from "react";
import { ChatActions } from "../../../../../../store/slices/ChatSlice";
import { Popover } from "antd";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import VoiceRecorder from "./components/VoiceRecorder/VoiceRecorder";
import { sendImage, sendTextMessage } from "../../../../../../client/ApiClient";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../store/ReduxHooks";

const InputHandler = ({
  sendAllowed,

  conversationId,
}: {
  sendAllowed: boolean;
  conversationId: string;
}) => {
  const [message, setMessage] = useState("");

  const fileInput = useRef<HTMLInputElement>(null);
  const textInput = useRef<HTMLInputElement>(null);
  const userData = useAppSelector((state) => state.auth.userData);
  const dispatch = useAppDispatch();
  const canSend = sendAllowed && !!message.trim();

  const sendMessage = () => {
    if (!sendAllowed) return;

    const readyMessage = message.trim();
    if (!readyMessage) return;
    const generatedId = Math.random() * 10 + "t";

    const senderInfo = {
      _id: userData?.userId,
      username: userData?.username,
      profile_picture: userData?.profile_picture,
    };

    sendTextMessage(readyMessage, conversationId)
      .then((res) => {
        const newMessage = { ...res.data, sender: senderInfo };
        dispatch(
          ChatActions.emit({
            event: "send message",
            data: newMessage,
          }),
        );
        dispatch(
          ChatActions.replaceMessage({
            conversation_id: conversationId,
            id: generatedId,
            newMessage: newMessage,
          }),
        );
      })
      .catch((err) => {
        console.log("send message error", err);
        dispatch(
          ChatActions.deleteMessage({
            conversation_id: conversationId,
            id: generatedId,
          }),
        );
      });

    const tempMessage: Message = {
      _id: generatedId,
      sender: senderInfo,
      message: readyMessage,
      content_type: "text",
      conversation: conversationId,
      sent_date: new Date(),
      temporary: true,
      edited_date: undefined,
      content: "",
      hidden: false,
    };

    dispatch(
      ChatActions.addMessage({
        conversation_id: conversationId,
        newMessage: tempMessage,
      }),
    );

    setMessage("");
  };
  const sendFile = (file: File) => {
    if (!sendAllowed) return;
    const generatedId = Math.random() * 10 + "t";

    const data = new FormData();
    data.append("file", file);

    const senderInfo = {
      _id: userData?.userId,
      username: userData?.username,
      profile_picture: userData?.profile_picture,
    };

    sendImage(data, conversationId)
      .then((res) => {
        /* chatSocket.emit("send message", res.data); */
        const newMessage = { ...res.data, sender: senderInfo };
        dispatch(
          ChatActions.emit({
            event: "send message",
            data: newMessage,
          }),
        );
        dispatch(
          ChatActions.replaceMessage({
            conversation_id: conversationId,
            id: generatedId,
            newMessage: newMessage,
          }),
        );
      })
      .catch(() => {
        dispatch(
          ChatActions.deleteMessage({
            conversation_id: conversationId,
            id: generatedId,
          }),
        );
      });

    const message: Message = {
      _id: generatedId,
      sender: senderInfo,
      content: URL.createObjectURL(file),
      conversation: conversationId,
      content_type: "image",
      sent_date: new Date(),
      temporary: true,
      edited_date: undefined,
      hidden: false,
      message: "",
    };

    dispatch(
      ChatActions.addMessage({
        conversation_id: conversationId,
        newMessage: message,
      }),
    );
  };

  return (
    <div className={classes.InputHandler}>
      <div
        className={
          classes.InputHolder + (!sendAllowed ? ` ${classes.Disabled}` : "")
        }
      >
        <input
          type="file"
          ref={fileInput}
          accept="image/png, image/gif, image/jpeg"
          style={{
            display: "none",
          }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            sendFile(file);
            e.currentTarget.value = "";
          }}
        />
        <button
          type="button"
          className={classes.ActionButton}
          aria-label="Attach image"
          onClick={() => {
            fileInput.current?.click();
          }}
        >
          <AttatchmentSvg
            style={{
              rotate: "45deg",
            }}
          />
        </button>

        <input
          ref={textInput}
          placeholder={
            sendAllowed ? "Write a message..." : "Messaging disabled"
          }
          autoCorrect="false"
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            sendMessage();
          }}
          value={message}
          onChange={(e) => {
            // if (e.target.value.length > 200) return;
            setMessage(e.target.value);
          }}
          disabled={!sendAllowed}
        />

        <Popover
          content={
            <EmojiPicker
              lazyLoadEmojis={true}
              searchDisabled
              skinTonesDisabled
              previewConfig={{
                showPreview: false,
              }}
              emojiStyle={EmojiStyle.FACEBOOK}
              onEmojiClick={(emoji) => {
                setMessage((prevMassage) => {
                  return prevMassage + emoji.emoji;
                });
                textInput.current?.focus();
              }}
            />
          }
          trigger={"click"} /* open={isPickerVisible} */
        >
          <button
            type="button"
            className={classes.ActionButton}
            aria-label="Pick emoji"
          >
            <MoodSvg />
          </button>
        </Popover>
        <VoiceRecorder conversationId={conversationId} />
        <div
          className={classes.Sender + (!canSend ? ` ${classes.Inactive}` : "")}
          onClick={() => {
            sendMessage();
            textInput.current?.focus();
          }}
        >
          <SendArrowSvg className={classes.sender} />
        </div>
      </div>
    </div>
  );
};

export default InputHandler;

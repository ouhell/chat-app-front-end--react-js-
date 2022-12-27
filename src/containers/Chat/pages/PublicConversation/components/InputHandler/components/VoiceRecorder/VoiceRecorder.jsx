import c from "./VoiceRecorder.module.scss";
import { MicSvg } from "../../../../../../../../shared/assets/svg/SvgProvider";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ChatActions } from "../../../../../../../../store/slices/ChatSlice";
const VoiceRecorder = ({ setMessages }) => {
  const [mediaRecorder, setMediaRecorder] = useState();
  const [isRocordReady, setIsRecordReady] = useState(false);
  const [isRecording, setisRecording] = useState(false);

  const audioChunks = useRef([]);

  const { id: convo_id } = useParams();

  const userData = useSelector((state) => state.auth.userData);

  const dispatch = useDispatch();

  useEffect(() => {
    getRecordPermision();
  }, []);

  useEffect(() => {
    console.log("id changed to :", convo_id);
    if (!mediaRecorder) return;
    mediaRecorder.onstop = () => {
      sendVoiceRecord();
    };
  }, [convo_id]);
  function getRecordPermision() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then((mediaStream) => {
        const recorder = new MediaRecorder(mediaStream);

        recorder.ondataavailable = (ev) => {
          console.log("recording : ", ev.data);
          audioChunks.current.push(ev.data);
        };
        recorder.onstop = () => {
          sendVoiceRecord();
        };
        setMediaRecorder(recorder);
        setIsRecordReady(true);
      });
  }

  function sendVoiceRecord() {
    const blob = new Blob(audioChunks.current, {
      type: "audio/mp3",
    });
    console.log("blob :", blob);
    console.log("current chunks:", audioChunks.current);
    const url = window.URL.createObjectURL(blob);
    audioChunks.current = [];
    const generatedId = Math.random() * 10;
    const data = new FormData();
    data.append("voice", blob);
    console.log("sending to convo :", convo_id);

    axios
      .post("/api/messagerie/voice/" + convo_id, data, {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then((res) => {
        console.log("voice res", res.data);
        dispatch(
          ChatActions.emit({
            event: "send message",
            data: res.data,
          })
        );
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          const index = newMessages.findIndex((message) => {
            return message._id === generatedId;
          });
          if (index < 0) return prevMessages;
          const oldContent = newMessages[index].content;
          newMessages[index] = res.data;
          newMessages[index].content = oldContent;
          return newMessages;
        });
      })
      .catch((err) => {
        console.log("voice err :", err);
      });

    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      newMessages.push({
        _id: generatedId,
        sender: userData.userId,
        content: url,
        conversation: convo_id,
        content_type: "voice",
        temporary: true,
      });
      return newMessages;
    });
  }

  function startRecordingAudio() {
    if (!isRocordReady) return getRecordPermision();
    console.log("starting");
    mediaRecorder.start();
    setisRecording(true);
  }
  function endRecordingAudio() {
    if (!isRocordReady || !isRecording) return;

    console.log("stoping");

    mediaRecorder.stop();
    // sendVoiceRecord();
    setisRecording(false);
  }

  return (
    <div
      className={c.VoiceRecorder}
      onMouseDown={() => {
        startRecordingAudio();
      }}
      onMouseUp={endRecordingAudio}
    >
      <MicSvg />
    </div>
  );
};

export default VoiceRecorder;

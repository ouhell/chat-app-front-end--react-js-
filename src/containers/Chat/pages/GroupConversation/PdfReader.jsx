import { Document, Page } from "react-pdf";
import { useRef, useState } from "react";
import { useEffect } from "react";
import pdf from "../../../../shared/assets/pdf/chap4.pdf";
import axios from "axios";
import lilN from "../../../../shared/assets/audio/liln.mp3";
import VoiceTextMessage from "../PublicConversation/components/ChatHandler/components/VoiceTextMessage/VoiceTextMessage";
import { useSelector } from "react-redux";
const PDFReader = () => {
  const [mediaRecorder, setMediaRecorder] = useState();
  const [isRocordReady, setIsRecordReady] = useState(false);
  const [isRocording, setisRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const audioChunks = useRef([]);

  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    getRecordPermision();
  }, []);
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
          const blob = new Blob(audioChunks.current, {
            type: "audio/mp3",
          });
          console.log("blob :", blob);
          console.log("current chunks:", audioChunks.current);
          const url = window.URL.createObjectURL(blob);
          audioChunks.current = [];

          setRecordings((prevRecordings) => {
            return [
              ...prevRecordings,
              {
                blob: url,
              },
            ];
          });

          /* sendVoiceMessage(blob); */
        };
        setMediaRecorder(recorder);
        setIsRecordReady(true);
      });
  }

  function startRecordingAudio() {
    if (!isRocordReady) return;
    console.log("starting");
    mediaRecorder.start();
    setisRecording(true);
  }
  function endRecordingAudio() {
    if (!isRocordReady) return;
    console.log("stoping");

    mediaRecorder.stop();
    setisRecording(false);
  }

  function sendVoiceMessage(message) {
    const data = new FormData();
    data.append("voice", message);
    axios
      .post("/api/messagerie/voice", data, {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then((res) => {
        console.log("voice res", res.data);
      })
      .catch((err) => {
        console.log("voice err :", err);
      });
  }
  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <button
        onClick={() => {
          if (isRocording) {
            endRecordingAudio();
          } else {
            startRecordingAudio();
          }
        }}
        /* onMouseDown={() => {
          if (!isRocordReady) return getRecordPermision();
          startRecordingAudio();
        }}
        onMouseUp={() => {
          endRecordingAudio();
        }} */
      >
        {isRocording ? "stop recording" : "start recording"}
      </button>

      {recordings.map((rec, i) => {
        return <audio key={i} controls src={rec.blob} />;
      })}
      {/* <VoiceTextMessage /> */}
    </div>
  );
};

export default PDFReader;

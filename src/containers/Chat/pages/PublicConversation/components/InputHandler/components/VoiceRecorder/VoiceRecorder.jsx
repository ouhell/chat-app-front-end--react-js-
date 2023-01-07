import c from "./VoiceRecorder.module.scss";
import { MicSvg } from "../../../../../../../../shared/assets/svg/SvgProvider";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ChatActions } from "../../../../../../../../store/slices/ChatSlice";
import { NotifActions } from "../../../../../../../../store/slices/NotificationSlice";

const initialRecordIconStyle = "none";

const VoiceRecorder = ({ setMessages }) => {
  const [mediaRecorder, setMediaRecorder] = useState();
  const [isRocordReady, setIsRecordReady] = useState(false);
  const [isRecording, setisRecording] = useState(false);

  const audioChunks = useRef([]);
  const audioConfig = useRef({
    audioContext: null,
    audioSource: null,
    audioAnalyser: null,
    dataArray: [],
  });
  const shouldDraw = useRef(false);
  const micHolder = useRef();

  const { id: convo_id } = useParams();

  const userData = useSelector((state) => state.auth.userData);

  const dispatch = useDispatch();

  useEffect(() => {
    navigator.permissions
      .query({
        name: "microphone",
      })
      .then((permissionStatus) => {
        if (permissionStatus.state === "granted") getRecordPermision();
      })
      .catch((err) => {
        console.log("permission error :", err);
      });
  }, []);

  useEffect(() => {
    if (!mediaRecorder) return;
    mediaRecorder.onstop = () => {
      sendVoiceRecord();
    };
  }, [convo_id]);

  function getRecordPermision() {
    try {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        })
        .then((mediaStream) => {
          audioConfig.current.audioContext = new window.AudioContext();
          audioConfig.current.audioAnalyser =
            audioConfig.current.audioContext.createAnalyser();
          audioConfig.current.audioSource =
            audioConfig.current.audioContext.createMediaStreamSource(
              mediaStream
            );

          audioConfig.current.audioSource.connect(
            audioConfig.current.audioAnalyser
          );
          audioConfig.current.audioAnalyser.fftSize = 1024;

          audioConfig.current.dataArray = new Float32Array(
            audioConfig.current.audioAnalyser.frequencyBinCount
          );
          audioConfig.current.audioAnalyser.getFloatTimeDomainData(
            audioConfig.current.dataArray
          );

          // recorder config

          const recorder = new MediaRecorder(mediaStream);
          recorder.ondataavailable = (ev) => {
            audioChunks.current.push(ev.data);
          };
          recorder.onstop = () => {
            sendVoiceRecord();
          };
          setMediaRecorder(recorder);
          setIsRecordReady(true);
        });
    } catch (err) {
      dispatch(
        NotifActions.notify({
          type: "error",
          message: "couldnt connect to microphone",
        })
      );
    }
  }

  function draw() {
    if (!shouldDraw.current) return;

    audioConfig.current.audioAnalyser.getFloatTimeDomainData(
      audioConfig.current.dataArray
    );

    var rms = 0;
    for (var i = 0; i < audioConfig.current.dataArray.length; i++) {
      rms += Math.abs(audioConfig.current.dataArray[i]);
    }
    rms /= audioConfig.current.dataArray.length;

    rms = rms * 10;
    rms = rms.toFixed(2);
    if (rms > 0.5) rms = 0.5;

    /*  console.log("voicepitch", rms); */

    let style = `0 0 1rem ${rms}rem red`;

    if (rms < 0.04) style = initialRecordIconStyle;

    micHolder.current.style.boxShadow = style;
    requestAnimationFrame(draw);
  }

  function sendVoiceRecord() {
    const blob = new Blob(audioChunks.current, {
      type: "audio/webm",
    });

    const url = window.URL.createObjectURL(blob);
    audioChunks.current = [];
    const generatedId = Math.random() * 10;
    const data = new FormData();
    data.append("voice", blob);

    axios
      .post("/api/messagerie/voice/" + convo_id, data, {
        headers: {
          authorization: "Bearer " + userData.access_token,
        },
      })
      .then((res) => {
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

    mediaRecorder.start();
    shouldDraw.current = true;
    setisRecording(true);
    draw();
  }
  function endRecordingAudio() {
    if (!isRocordReady || !isRecording) return;

    mediaRecorder.stop();

    shouldDraw.current = false;
    micHolder.current.style.boxShadow = initialRecordIconStyle;
    setisRecording(false);
  }

  return (
    <div
      className={c.VoiceRecorder}
      onClick={() => {
        if (isRecording) endRecordingAudio();
        else startRecordingAudio();
      }}
      isrecording={isRecording ? "true" : "false"}
    >
      <span /* style={recordIconStyle} */ ref={micHolder}>
        <MicSvg />
      </span>
    </div>
  );
};

export default VoiceRecorder;

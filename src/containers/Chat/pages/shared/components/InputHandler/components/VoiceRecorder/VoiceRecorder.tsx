import c from "./VoiceRecorder.module.scss";
import { MicSvg } from "../../../../../../../../shared/assets/svg/SvgProvider";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ChatActions } from "../../../../../../../../store/slices/ChatSlice";
import { NotifActions } from "../../../../../../../../store/slices/NotificationSlice";

import { sendVoiceMessage } from "../../../../../../../../client/ApiClient";
import { useAppSelector } from "../../../../../../../../store/ReduxHooks";

const initialRecordIconStyle = "none";

type AudioConfig = {
  audioContext: AudioContext | null;
  audioSource: MediaStreamAudioSourceNode | null;
  audioAnalyser: AnalyserNode | null;
  dataArray: Float32Array;
  mediaStream: MediaStream | null;
  mediaRecorder: MediaRecorder | null;
};

const initialAudioConfig: AudioConfig = {
  audioContext: null,
  audioSource: null,
  audioAnalyser: null,
  dataArray: new Float32Array(),
  mediaStream: null,
  mediaRecorder: null,
};

const VoiceRecorder = ({ conversationId }: { conversationId: string }) => {
  const [isGettingPermission, setIsGettingPermission] = useState(false);
  const [isRocordReady, setIsRecordReady] = useState(false);
  const [isRecording, setisRecording] = useState(false);

  const audioChunks = useRef<Blob[]>([]);
  const audioConfig = useRef({ ...initialAudioConfig });
  const shouldDraw = useRef(false);
  const micHolder = useRef<HTMLElement>(null);
  const recordTimeout = useRef<number>();

  const userData = useAppSelector((state) => state.auth.userData);

  const dispatch = useDispatch();
  /* 
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
  }, []); */

  useEffect(() => {
    if (!audioConfig.current.mediaRecorder) return;
    audioConfig.current.mediaRecorder.onstop = () => {
      sendVoiceRecord();
    };
  }, [conversationId]);

  function getRecordPermision() {
    setIsGettingPermission(true);
    try {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        })
        .then((mediaStream) => {
          audioConfig.current.mediaStream = mediaStream;
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
          audioConfig.current.mediaRecorder = recorder;
          setIsRecordReady(true);

          //start recording
          recordTimeout.current = window.setTimeout(() => {
            console.log("timout");
            endRecordingAudio();
          }, 5000);
          audioConfig.current.mediaRecorder.start();
          shouldDraw.current = true;
          setisRecording(true);
          draw();
        })
        .finally(() => {
          setIsGettingPermission(false);
        });
    } catch (err) {
      setIsGettingPermission(false);
      dispatch(
        NotifActions.notify({
          type: "error",
          message: "couldnt connect to microphone",
        })
      );
    }
  }

  function revokeMedia() {
    if (audioConfig.current.mediaStream)
      audioConfig.current.mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    audioConfig.current = { ...initialAudioConfig };
    setIsRecordReady(false);
  }

  function draw() {
    if (!shouldDraw.current) return;

    audioConfig.current.audioAnalyser?.getFloatTimeDomainData(
      audioConfig.current.dataArray
    );

    var rms = 0;
    for (var i = 0; i < audioConfig.current.dataArray.length; i++) {
      rms += Math.abs(audioConfig.current.dataArray[i]);
    }
    rms /= audioConfig.current.dataArray.length;

    rms = rms * 10;
    rms = parseFloat(rms.toFixed(2));
    if (rms > 0.5) rms = 0.5;

    let style = `0 0 1rem ${rms}rem red`;

    if (rms < 0.04) style = initialRecordIconStyle;

    if (micHolder.current) micHolder.current.style.boxShadow = style;

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

    let testAudio = new Audio(url);
    testAudio.currentTime = 1e101;
    testAudio.volume = 0;
    testAudio.onended = () => {
      const senderInfo = {
        _id: userData?.userId,
        username: userData?.username,
        profile_picture: userData?.profile_picture,
      };

      data.append("voice", blob);
      // data.append("duration", testAudio.duration);

      sendVoiceMessage(
        data,
        conversationId,
        userData?.access_token ?? "undefined"
      )
        .then((res) => {
          const newMessage = { ...res.data, sender: senderInfo };
          dispatch(
            ChatActions.emit({
              event: "send message",
              data: newMessage,
            })
          );
          newMessage.content = url;

          dispatch(
            ChatActions.replaceMessage({
              conversation_id: conversationId,
              id: generatedId,
              newMessage: newMessage,
            })
          );
        })
        .catch((err) => {
          dispatch(
            ChatActions.deleteMessage({
              conversation_id: conversationId,
              id: generatedId,
            })
          );
        });
      const tempMessage = {
        _id: generatedId,
        sender: senderInfo,
        content: url,
        conversation: conversationId,
        content_type: "voice",
        temporary: true,
        sent_date: Date.now(),
      };
      dispatch(
        ChatActions.addMessage({
          conversation_id: conversationId,
          newMessage: tempMessage,
        })
      );
      testAudio.pause();
      testAudio.src = "";
      // testAudio = null;
    };
    testAudio.play();
  }

  function startRecordingAudio() {
    if (isGettingPermission) return;
    getRecordPermision();
  }
  function endRecordingAudio() {
    if (!isRocordReady || !isRecording) return;

    audioConfig.current.mediaRecorder?.stop();

    shouldDraw.current = false;
    if (micHolder.current)
      micHolder.current.style.boxShadow = initialRecordIconStyle;
    setisRecording(false);
    window.clearTimeout(recordTimeout.current);
    revokeMedia();
  }

  return (
    <div
      className={c.VoiceRecorder}
      onClick={() => {
        if (isRecording) endRecordingAudio();
        else startRecordingAudio();
      }}
      // @ts-ignore
      isrecording={isRecording ? "true" : "false"}
    >
      <span /* style={recordIconStyle} */ ref={micHolder}>
        <MicSvg />
      </span>
    </div>
  );
};

export default VoiceRecorder;

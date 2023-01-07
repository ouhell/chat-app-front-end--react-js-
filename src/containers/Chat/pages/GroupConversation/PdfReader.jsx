import { Document, Page } from "react-pdf";
import { useRef, useState } from "react";
import { useEffect } from "react";
import pdf from "../../../../shared/assets/pdf/chap4.pdf";
import axios from "axios";
import lilN from "../../../../shared/assets/audio/liln.mp3";
import VoiceTextMessage from "../PublicConversation/components/ChatHandler/components/VoiceTextMessage/VoiceTextMessage";
import { useSelector } from "react-redux";
import { Button } from "antd";
const PDFReader = () => {
  const [mediaRecorder, setMediaRecorder] = useState();
  const [isRecordReady, setIsRecordReady] = useState(false);
  const [isRecording, setisRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const audioChunks = useRef([]);
  const audioConfig = useRef({
    audioContext: null,
    audioSource: null,
    audioAnalyser: null,
    dataArray: [],
  });

  const shouldDraw = useRef(false);

  function getPermission() {
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
          audioConfig.current.audioContext.createMediaStreamSource(mediaStream);
        console.log("data stream :", mediaStream);
        console.log("source :", audioConfig.current.audioSource);

        audioConfig.current.audioSource.connect(
          audioConfig.current.audioAnalyser
        );
        audioConfig.current.audioAnalyser.fftSize = 1024;

        console.log(
          "buffersize :",
          audioConfig.current.audioAnalyser.frequencyBinCount
        );
        audioConfig.current.dataArray = new Float32Array(
          audioConfig.current.audioAnalyser.frequencyBinCount
        );
        audioConfig.current.audioAnalyser.getFloatTimeDomainData(
          audioConfig.current.dataArray
        );
        console.log("freq data", audioConfig.current.dataArray);
        setIsRecordReady(true);
      });
  }

  function draw() {
    console.log("drawing : ", shouldDraw.current);
    if (!shouldDraw.current) return;

    audioConfig.current.audioAnalyser.getFloatTimeDomainData(
      audioConfig.current.dataArray
    );
    console.log(audioConfig.current.dataArray[256]);
    requestAnimationFrame(draw);
  }

  function toggleRecording() {
    if (!isRecordReady) return getPermission();
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  async function startRecording() {
    setisRecording(true);
    shouldDraw.current = true;
    draw();
  }

  function stopRecording() {
    shouldDraw.current = false;
    setisRecording(false);
  }
  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <Button onClick={toggleRecording} danger>
        {isRecording ? "Stop" : "Record"}
      </Button>
      <audio
        controls
        src="lmao"
        onLoadedData={(e) => {
          console.log(e);
        }}
      />
    </div>
  );
};

export default PDFReader;

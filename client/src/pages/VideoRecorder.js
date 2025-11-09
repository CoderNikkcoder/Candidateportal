
import React, { useState, useRef } from "react";
import { Container, Button, Card, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function VideoRecorder({ videoBlob, setVideoBlob }) {
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const recorderRef = useRef(null);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, frameRate: 15 },
        audio: true,
      });
      videoRef.current.srcObject = stream;

      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
        videoBitsPerSecond: 500000,
      });

      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setVideoBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
      setTimer(0);

      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev >= 90) {
            stopRecording();
            return 90;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      alert("Camera or mic access denied.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    clearInterval(intervalRef.current);
    setRecording(false);
  };

  const handleNext = () => {
    if (!videoBlob) return alert("Please record a video first!");
    navigate("/review");
  };

  return (
    <Container style={{ maxWidth: "600px" }} className="my-4">
      <Card className="p-4">
        <h3 className="mb-3 text-center">Record Video</h3>

        <ProgressBar
          now={(timer / 90) * 100}
          label={`${timer}s / 90s`}
          className="mb-3"
        />

        {!videoBlob ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-100 border rounded mb-3"
          />
        ) : (
          <video
            src={URL.createObjectURL(videoBlob)}
            controls
            className="w-100 border rounded mb-3"
          />
        )}

        <div className="d-flex gap-2 mb-3">
          {!recording ? (
            <Button onClick={startRecording}>🎥 Start</Button>
          ) : (
            <Button onClick={stopRecording} variant="danger">
               Stop
            </Button>
          )}
          {videoBlob && (
            <Button
              onClick={() => setVideoBlob(null)}
              variant="outline-secondary"
            >
               Retake
            </Button>
          )}
        </div>

        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => navigate("/")}>
            ← Back
          </Button>
          <Button variant="success" onClick={handleNext} className="flex-grow-1">
            Review →
          </Button>
        </div>
      </Card>
    </Container>
  );
}

export default VideoRecorder;

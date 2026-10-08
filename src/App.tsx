// CHQ: Claude AI (Haiku) generated this file

import React, { useState, useRef, useEffect } from 'react';
import { Card } from './components/common/Card/Card';
import { RecorderStage } from './components/RecorderStage/RecorderStage';
import { RecorderControls } from './components/RecorderControls/RecorderControls';
import { SourcePicker } from './components/SourcePicker/SourcePicker';
import { RecordingsList } from './components/RecordingsList/RecordingsList';
import { useRecorderState } from './hooks/useRecorderState';
import { useRecorder } from './hooks/useRecorder';
import { usePreview } from './hooks/usePreview';
import { downloadRecording } from './utils/download';
import { Recording } from './types/recording.types';
import './App.css';

export const App: React.FC = () => {
  const [camera, setCamera] = useState(true);
  const [microphone, setMicrophone] = useState(true);
  const [screen, setScreen] = useState(false);
  const [systemAudio, setSystemAudio] = useState(true);

  const {
    state,
    setState,
    seconds,
    setSeconds,
    recordings,
    addRecording,
    removeRecording,
    error,
    setError,
  } = useRecorderState();

  const { videoRef, showPreview, stopPreview } = usePreview();
  const recordingIdRef = useRef(0);

  // Check browser support
  const supported =
    !!(navigator.mediaDevices && window.MediaRecorder);
  const canScreenShare =
    supported && !!navigator.mediaDevices.getDisplayMedia;

  const isRecording = state !== 'idle';

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (state === 'recording') {
        setSeconds((s) => s + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state, setSeconds]);

  const { start, stop, pause, secondsRef } = useRecorder({
    setState,
    onRecordingComplete: (recording) => {
      addRecording(recording);
      stopPreview();
    },
    onError: setError,
    recordingIdRef,
  });

  const handleStart = async () => {
    setSeconds(0);
    await start(
      { camera, microphone, screen, systemAudio },
      (stream) => {
        showPreview(stream);
      }
    );
  };

  const handleDelete = (recording: Recording) => {
    URL.revokeObjectURL(recording.url);
    removeRecording(recording.id);
  };

  return (
    <div className="wrap">
      <h1>Recorder Studio</h1>
      <p className="sub">
        Record your camera, microphone and screen. Everything stays in your browser.
      </p>

      {!supported && (
        <div className="err">
          Your browser doesn't support MediaRecorder. Try a recent Chrome, Edge,
          Firefox or Safari.
        </div>
      )}

      <SourcePicker
        camera={camera}
        microphone={microphone}
        screen={screen}
        systemAudio={systemAudio}
        canScreenShare={canScreenShare}
        isRecording={isRecording}
        onCameraChange={setCamera}
        onMicrophoneChange={setMicrophone}
        onScreenChange={setScreen}
        onSystemAudioChange={setSystemAudio}
      />

      <Card>
        <RecorderStage
          videoRef={videoRef}
          state={state}
          seconds={seconds}
          isRecording={isRecording}
          hasVideo={camera || screen}
        />
        <RecorderControls
          isRecording={isRecording}
          isPaused={state === 'paused'}
          isSupported={supported}
          onStart={handleStart}
          onStop={stop}
          onPause={pause}
        />
        {error && <div className="err">{error}</div>}
      </Card>

      <RecordingsList
        recordings={recordings}
        onDownload={downloadRecording}
        onDelete={handleDelete}
      />
    </div>
  );
};

// CHQ: Claude AI (Haiku) generated this file

import { useRef, useEffect, useCallback } from 'react';
import { Recording, RecorderRef, RecorderState } from '../types/recording.types';
import { SourceConfig } from '../types/media.types';
import { getMimeType, extractMimeType, getFileExtension } from '../utils/mediaHelpers';

interface UseRecorderProps {
  setState: (state: RecorderState) => void;
  onRecordingComplete: (recording: Recording, duration: number) => void;
  onError: (error: string) => void;
  recordingIdRef: React.MutableRefObject<number>;
}

export const useRecorder = ({
  setState,
  onRecordingComplete,
  onError,
  recordingIdRef,
}: UseRecorderProps) => {
  const recorderRef = useRef<RecorderRef>({});
  const secondsRef = useRef(0);

  const cleanup = useCallback(() => {
    const r = recorderRef.current;
    (r.streams || []).forEach((s) =>
      s.getTracks().forEach((t) => t.stop())
    );
    clearInterval(r.draw);
    if (r.ctx && r.ctx.state !== 'closed') {
      r.ctx.close();
    }
    recorderRef.current = {};
  }, []);

  const start = useCallback(
    async (config: SourceConfig, onPreview: (stream: MediaStream) => void) => {
      onError('');

      if (!config.camera && !config.microphone && !config.screen) {
        onError('Turn on at least one source.');
        return;
      }

      const r: RecorderRef = { streams: [] };
      recorderRef.current = r;

      try {
        const md = navigator.mediaDevices;
        let screenStream: MediaStream | undefined;
        let cameraStream: MediaStream | undefined;
        let micStream: MediaStream | undefined;

        if (config.screen) {
          screenStream = await md.getDisplayMedia({
            video: { frameRate: 30 },
            audio: config.systemAudio as any,
          });
          r.streams!.push(screenStream);
        }

        if (config.camera) {
          cameraStream = await md.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          });
          r.streams!.push(cameraStream);
        }

        if (config.microphone) {
          micStream = await md.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true },
          });
          r.streams!.push(micStream);
        }

        // Audio mixing
        const audioStreams = [micStream, screenStream].filter(
          (s) => s && s.getAudioTracks().length > 0
        );
        let audioTrack: MediaStreamTrack | null = null;

        if (audioStreams.length === 1) {
          audioTrack = audioStreams[0]!.getAudioTracks()[0];
        } else if (audioStreams.length > 1) {
          const ctx = new AudioContext();
          const dest = ctx.createMediaStreamDestination();
          audioStreams.forEach((s) => {
            ctx.createMediaStreamSource(
              new MediaStream(s!.getAudioTracks())
            ).connect(dest);
          });
          r.ctx = ctx;
          audioTrack = dest.stream.getAudioTracks()[0];
        }

        // Video compositing
        let videoTrack: MediaStreamTrack | null = null;

        if (screenStream && cameraStream) {
          videoTrack = await compositePictureInPicture(
            screenStream,
            cameraStream,
            r
          );
        } else if (screenStream) {
          videoTrack = screenStream.getVideoTracks()[0];
        } else if (cameraStream) {
          videoTrack = cameraStream.getVideoTracks()[0];
        }

        // Create output stream
        const outputStream = new MediaStream(
          [videoTrack, audioTrack].filter((t): t is MediaStreamTrack => t != null)
        );

        if (videoTrack) {
          onPreview(new MediaStream([videoTrack]));
        }

        if (screenStream) {
          screenStream.getVideoTracks()[0].onended = () => stop();
        }

        // Start recording
        const isAudio = !videoTrack;
        const mimeType = getMimeType(isAudio);
        const recorder = new MediaRecorder(
          outputStream,
          mimeType ? { mimeType } : {}
        );
        r.rec = recorder;

        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size) chunks.push(e.data);
        };

        recorder.onstop = () => {
          const type = extractMimeType(mimeType || recorder.mimeType);
          const blob = new Blob(chunks, { type });
          const id = ++recordingIdRef.current;

          onRecordingComplete(
            {
              id,
              blob,
              url: URL.createObjectURL(blob),
              isAudio,
              ext: getFileExtension(type),
              label: [
                config.screen && 'screen',
                config.camera && 'camera',
                config.microphone && 'mic',
              ]
                .filter(Boolean)
                .join(' + '),
              dur: r.dur || 0,
              at: new Date(),
            },
            secondsRef.current
          );
          cleanup();
          setState('idle');
        };

        recorder.start(1000);
        setState('recording');
      } catch (e) {
        cleanup();
        setState('idle');

        const errorMessages: Record<string, string> = {
          NotAllowedError:
            'Permission was denied (or blocked by the page the app is embedded in). Allow access, or open this app in its own browser tab.',
          NotFoundError: 'No matching camera or microphone was found.',
          NotReadableError: 'The device is busy or unavailable.',
        };

        const message =
          errorMessages[(e as Error).name] ||
          `Could not start: ${(e as Error).message || (e as Error).name}`;
        onError(message);
      }
    },
    [setState, onError, onRecordingComplete, recordingIdRef, cleanup]
  );

  const stop = useCallback(() => {
    const r = recorderRef.current;
    if (r.rec && r.rec.state !== 'inactive') {
      r.dur = secondsRef.current;
      r.rec.stop();
    }
  }, []);

  const pause = useCallback(() => {
    const rec = recorderRef.current.rec;
    if (!rec) return;

    if (rec.state === 'recording') {
      rec.pause();
      setState('paused');
    } else if (rec.state === 'paused') {
      rec.resume();
      setState('recording');
    }
  }, [setState]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return { start, stop, pause, recorderRef, secondsRef };
};

async function compositePictureInPicture(
  screenStream: MediaStream,
  cameraStream: MediaStream,
  recorderRef: RecorderRef
): Promise<MediaStreamTrack> {
  const makeVideo = async (stream: MediaStream) => {
    const v = document.createElement('video');
    v.muted = true;
    v.playsInline = true;
    v.srcObject = stream;
    await v.play();
    return v;
  };

  const screenVideo = await makeVideo(screenStream);
  const cameraVideo = await makeVideo(cameraStream);

  const canvas = document.createElement('canvas');
  canvas.width = screenVideo.videoWidth || 1280;
  canvas.height = screenVideo.videoHeight || 720;

  const ctx = canvas.getContext('2d')!;

  recorderRef.draw = window.setInterval(() => {
    ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);

    const pipWidth = canvas.width * 0.22;
    const pipHeight = pipWidth * (cameraVideo.videoHeight / cameraVideo.videoWidth || 0.5625);
    const margin = canvas.width * 0.015;
    const x = canvas.width - pipWidth - margin;
    const y = canvas.height - pipHeight - margin;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, pipWidth, pipHeight, 12);
    ctx.clip();
    ctx.drawImage(cameraVideo, x, y, pipWidth, pipHeight);
    ctx.restore();

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.roundRect(x, y, pipWidth, pipHeight, 12);
    ctx.stroke();
  }, 33);

  return canvas.captureStream(30).getVideoTracks()[0];
}

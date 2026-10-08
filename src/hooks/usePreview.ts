// CHQ: Claude AI (Haiku) generated this file

import { useRef } from 'react';

export const usePreview = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const showPreview = (stream: MediaStream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {
        // Playback failed silently
      });
    }
  };

  const stopPreview = () => {
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return { videoRef, showPreview, stopPreview };
};

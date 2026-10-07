// CHQ: Claude AI (Haiku) generated this file

import { useState } from 'react';
import { Recording, RecorderState } from '../types/recording.types';

export const useRecorderState = () => {
  const [state, setState] = useState<RecorderState>('idle');
  const [seconds, setSeconds] = useState(0);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [error, setError] = useState('');

  const addRecording = (recording: Recording) => {
    setRecordings((list) => [recording, ...list]);
  };

  const removeRecording = (id: number) => {
    setRecordings((list) => list.filter((r) => r.id !== id));
  };

  return {
    state,
    setState,
    seconds,
    setSeconds,
    recordings,
    addRecording,
    removeRecording,
    error,
    setError,
  };
};

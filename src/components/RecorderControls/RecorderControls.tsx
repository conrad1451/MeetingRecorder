import React from 'react';
import { Button } from '../common/Button/Button';
import { RecorderControlsProps } from './RecorderControls.types';
import './RecorderControls.css';

export const RecorderControls: React.FC<RecorderControlsProps> = ({
  isRecording,
  isPaused,
  isSupported,
  onStart,
  onStop,
  onPause,
}) => (
  <div className="ctrls">
    {!isRecording ? (
      <Button variant="primary" disabled={!isSupported} onClick={onStart}>
        ● Start recording
      </Button>
    ) : (
      <>
        <Button onClick={onPause}>
          {isPaused ? '▶ Resume' : '⏸ Pause'}
        </Button>
        <Button variant="primary" onClick={onStop}>
          ■ Stop & save
        </Button>
      </>
    )}
  </div>
);

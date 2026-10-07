import React from 'react';
import { formatTime } from '../../utils/format';
import { RecorderStageProps } from './RecorderStage.types';
import './RecorderStage.css';

export const RecorderStage: React.FC<RecorderStageProps> = ({
  videoRef,
  state,
  seconds,
  isRecording,
  hasVideo,
}) => (
  <div className="stage">
    <video
      ref={videoRef}
      muted
      playsInline
      style={{ display: isRecording && hasVideo ? 'block' : 'none' }}
    />
    {!(isRecording && hasVideo) && (
      <span>
        {isRecording ? '🎙️ Recording audio only…' : 'Preview appears here when you record'}
      </span>
    )}
    {isRecording && (
      <div className="badge">
        <span className={`dot ${state === 'paused' ? 'paused' : ''}`} />
        {state === 'paused' ? 'Paused' : 'REC'} {formatTime(seconds)}
      </div>
    )}
  </div>
);

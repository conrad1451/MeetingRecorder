import React from 'react';
import { Card } from '../common/Card/Card';
import { Chip } from '../common/Chip/Chip';
import { SourcePickerProps } from './SourcePicker.types';
import './SourcePicker.css';

export const SourcePicker: React.FC<SourcePickerProps> = ({
  camera,
  microphone,
  screen,
  systemAudio,
  canScreenShare,
  isRecording,
  onCameraChange,
  onMicrophoneChange,
  onScreenChange,
  onSystemAudioChange,
}) => (
  <Card>
    <div className="sources">
      <Chip
        icon="📷"
        title="Camera"
        subtitle={camera ? 'On' : 'Off'}
        active={camera}
        disabled={isRecording}
        onChange={onCameraChange}
      />
      <Chip
        icon="🎙️"
        title="Microphone"
        subtitle={microphone ? 'On' : 'Off'}
        active={microphone}
        disabled={isRecording}
        onChange={onMicrophoneChange}
      />
      <Chip
        icon="🖥️"
        title="Screen"
        subtitle={screen ? 'On' : 'Off'}
        active={screen}
        disabled={isRecording || !canScreenShare}
        onChange={onScreenChange}
      />
    </div>
    {screen && (
      <label className="opt">
        <input
          type="checkbox"
          checked={systemAudio}
          disabled={isRecording}
          onChange={(e) => onSystemAudioChange(e.target.checked)}
        />
        Also capture tab/system audio (if the browser offers it when you pick a
        source)
      </label>
    )}
    {screen && camera && (
      <div className="opt">
        Camera appears as a picture-in-picture bubble over your screen.
      </div>
    )}
  </Card>
);

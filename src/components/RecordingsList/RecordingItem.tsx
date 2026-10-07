import React from 'react';
import { Recording } from '../../types/recording.types';
import { formatTime, formatFileSize } from '../../utils/format';
import { Button } from '../common/Button/Button';
import './RecordingItem.css';

interface RecordingItemProps {
  recording: Recording;
  onDownload: (recording: Recording) => void;
  onDelete: (recording: Recording) => void;
}

export const RecordingItem: React.FC<RecordingItemProps> = ({
  recording,
  onDownload,
  onDelete,
}) => (
  <div className="rec-item">
    {recording.isAudio ? (
      <audio controls src={recording.url} />
    ) : (
      <video controls playsInline src={recording.url} />
    )}
    <div className="meta">
      <span>
        {recording.label} · {formatTime(recording.dur)} ·{' '}
        {formatFileSize(recording.blob.size)} · .{recording.ext}
      </span>
      <span className="acts">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onDownload(recording)}
        >
          ⬇ Download
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => onDelete(recording)}
        >
          Delete
        </Button>
      </span>
    </div>
  </div>
);

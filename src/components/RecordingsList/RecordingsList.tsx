import React from 'react';
import { Card } from '../common/Card/Card';
import { RecordingItem } from './RecordingItem';
import { RecordingsListProps } from './RecordingsList.types';
import './RecordingsList.css';

export const RecordingsList: React.FC<RecordingsListProps> = ({
  recordings,
  onDownload,
  onDelete,
}) => (
  <Card>
    <h2>Recordings {recordings.length ? `(${recordings.length})` : ''}</h2>
    {!recordings.length ? (
      <div className="empty">Nothing recorded yet.</div>
    ) : (
      recordings.map((recording) => (
        <RecordingItem
          key={recording.id}
          recording={recording}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))
    )}
  </Card>
);

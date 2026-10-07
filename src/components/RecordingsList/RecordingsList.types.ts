import { Recording } from '../../types/recording.types';

export interface RecordingsListProps {
  recordings: Recording[];
  onDownload: (recording: Recording) => void;
  onDelete: (recording: Recording) => void;
}

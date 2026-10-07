import { RecorderState } from '../../types/recording.types';

export interface RecorderStageProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  state: RecorderState;
  seconds: number;
  isRecording: boolean;
  hasVideo: boolean;
}

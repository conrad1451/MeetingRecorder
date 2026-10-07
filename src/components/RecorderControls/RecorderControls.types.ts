export interface RecorderControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
}

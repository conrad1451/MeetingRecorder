export interface SourcePickerProps {
  camera: boolean;
  microphone: boolean;
  screen: boolean;
  systemAudio: boolean;
  canScreenShare: boolean;
  isRecording: boolean;
  onCameraChange: (value: boolean) => void;
  onMicrophoneChange: (value: boolean) => void;
  onScreenChange: (value: boolean) => void;
  onSystemAudioChange: (value: boolean) => void;
}

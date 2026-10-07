// CHQ: Claude AI (Haiku) generated this file

export interface Recording {
  id: number;
  blob: Blob;
  url: string;
  isAudio: boolean;
  ext: 'webm' | 'mp4';
  label: string;
  dur: number;
  at: Date;
}

export type RecorderState = 'idle' | 'recording' | 'paused';

export interface RecorderRef {
  streams?: MediaStream[];
  rec?: MediaRecorder;
  ctx?: AudioContext;
  draw?: number;
  dur?: number;
}

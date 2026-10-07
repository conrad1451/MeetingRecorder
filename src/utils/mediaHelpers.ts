// CHQ: Claude AI (Haiku) generated this file

export const getMimeType = (isAudio: boolean): string => {
  const types = isAudio
    ? ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']
    : [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
      ];

  return types.find((t) => MediaRecorder.isTypeSupported(t)) || '';
};

export const extractMimeType = (fullMimeType: string): string => {
  return (fullMimeType || 'video/webm').split(';')[0];
};

export const getFileExtension = (mimeType: string): 'webm' | 'mp4' => {
  return mimeType.includes('mp4') ? 'mp4' : 'webm';
};

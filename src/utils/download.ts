// CHQ: Claude AI (Haiku) generated this file

import { Recording } from '../types/recording.types';

export const downloadRecording = async (recording: Recording): Promise<void> => {
  const filename = `recording-${recording.at
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, '-')}.${recording.ext}`;

  try {
    // Try Claude downloads API if available
    if (window.claude) {
      const downloads = await window.claude.use('downloads');
      if (downloads) {
        await downloads.save({ filename, data: recording.blob });
        return;
      }
    }
  } catch (e) {
    if ((e as any)?.code === 'declined') return;
  }

  // Fallback to standard download
  const link = document.createElement('a');
  link.href = recording.url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

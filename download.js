/** Saves generated notes, packs or flashcards to the student's device. */
export function downloadText(filename, content, mime = 'text/markdown;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function safeFileName(input = 'studybuddy', extension = 'md') {
  const base = String(input)
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9-_ ]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
  return `${base || 'studybuddy'}.${extension}`;
}

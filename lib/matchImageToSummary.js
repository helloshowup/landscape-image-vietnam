export function getPromptForImage(filename, summaries) {
  const match = summaries.find(entry => entry.expected_filename === filename);
  if (!match) throw new Error(`No summary found for: ${filename}`);
  return match.summary;
}

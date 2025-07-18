import fs from 'fs';
import path from 'path';

export function loadAllSummaries(jsonFolder) {
  const files = fs.readdirSync(jsonFolder).filter(f => f.endsWith('.json'));
  let summaries = [];
  for (const file of files) {
    const filePath = path.join(jsonFolder, file);
    try {
      const text = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(text);
      summaries.push(...data);
    } catch (err) {
      console.error(`Failed to parse ${filePath}: ${err.message}`);
      // skip malformed file but continue processing others
    }
  }
  return summaries;
}

import fs from 'fs';
import path from 'path';

export function loadAllSummaries(jsonFolder) {
  const files = fs.readdirSync(jsonFolder).filter(f => f.endsWith('.json'));
  let summaries = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(jsonFolder, file), 'utf8');
      const data = JSON.parse(raw);
      summaries.push(...data);
    } catch (err) {
      console.warn(`Warning: failed to parse ${file}: ${err.message}`);
    }
  }
  return summaries;
}

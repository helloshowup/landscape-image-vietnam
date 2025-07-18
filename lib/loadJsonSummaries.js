import fs from 'fs';
import path from 'path';

export function loadAllSummaries(jsonFolder) {
  const files = fs.readdirSync(jsonFolder).filter(f => f.endsWith('.json'));
  let summaries = [];
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(jsonFolder, file)));
    summaries.push(...data);
  }
  return summaries;
}

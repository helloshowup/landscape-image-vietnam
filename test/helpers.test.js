import fs from 'fs';
import os from 'os';
import path from 'path';
import { test } from 'node:test';
import { strictEqual } from 'node:assert';
import { loadAllSummaries } from '../lib/loadJsonSummaries.js';
import { getPromptForImage } from '../lib/matchImageToSummary.js';

test('loadAllSummaries merges JSON files and match function finds prompts', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'summaries-'));
  const file1 = path.join(dir, 'one.json');
  const file2 = path.join(dir, 'two.json');
  fs.writeFileSync(file1, JSON.stringify([{ expected_filename: 'a.png', summary: 'A prompt' }]));
  fs.writeFileSync(file2, JSON.stringify([{ expected_filename: 'b.png', summary: 'B prompt' }]));

  const summaries = loadAllSummaries(dir);
  strictEqual(summaries.length, 2);
  strictEqual(getPromptForImage('b.png', summaries), 'B prompt');
});

#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { loadAllSummaries } from '../lib/loadJsonSummaries.js';
import { getPromptForImage } from '../lib/matchImageToSummary.js';
import { editImage } from '../lib/editImage.js';

const [,, originalsDir, jsonDir, maskPath, outDir] = process.argv;

if (!originalsDir || !jsonDir || !maskPath || !outDir) {
  console.error('Usage: batch-landscape <originalsDir> <jsonDir> <mask.png> <outputDir>');
  process.exit(1);
}

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const summaries = loadAllSummaries(jsonDir);
const images = fs.readdirSync(originalsDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));

(async () => {
  for (const img of images) {
    const imagePath = path.join(originalsDir, img);
    const outPath = path.join(outDir, img);
    try {
      const prompt = getPromptForImage(img, summaries);
      console.log(`→ Processing ${img} with prompt: ${prompt.slice(0, 80)}...`);
      await editImage({ imagePath, maskPath, prompt, outPath });
      console.log(`✓ Saved landscape version to: ${outPath}`);
    } catch (e) {
      console.error(`✗ Skipped ${img}:`, e.message);
    }
  }
})();

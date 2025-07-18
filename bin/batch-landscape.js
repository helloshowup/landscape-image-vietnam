#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { loadAllSummaries } from '../lib/loadJsonSummaries.js';
import { getPromptForImage } from '../lib/matchImageToSummary.js';
import { editImage } from '../lib/editImage.js';

const program = new Command();
program
  .name('batch-landscape')
  .argument('<originalsDir>')
  .argument('<jsonDir>')
  .argument('<mask>')
  .argument('<outputDir>')
  .option('-s, --size <size>', 'image size', '1536x1024')
  .showHelpAfterError();

program.parse(process.argv);
const [originalsDir, jsonDir, maskPath, outDir] = program.args;
const options = program.opts();

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
      await editImage({ imagePath, maskPath, prompt, outPath, size: options.size });
      console.log(`✓ Saved landscape version to: ${outPath}`);
    } catch (e) {
      console.error(`✗ Skipped ${img}:`, e.message);
    }
  }
})();

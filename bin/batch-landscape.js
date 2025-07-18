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
  .usage('<originalsDir> <promptsDir> <mask.png> <outputDir> [options]')
  .description('Batch convert images to landscape format using OpenAI')
  .showHelpAfterError()
  .argument('<originalsDir>', 'directory of source images')
  .argument('<promptsDir>', 'directory of prompt JSON files')
  .argument('<maskPath>', 'shared mask PNG')
  .argument('<outputDir>', 'directory for generated images')
  .option('-s, --size <size>', 'output image size', '1536x1024')
  .parse();

const [originalsDir, promptsDir, maskPath, outDir] = program.args;
const { size } = program.opts();

function ensureDir(name, dir) {
  if (!fs.existsSync(dir)) {
    console.error(`Missing ${name}: ${dir}`);
    process.exit(1);
  }
  if (!fs.statSync(dir).isDirectory()) {
    console.error(`${name} is not a directory: ${dir}`);
    process.exit(1);
  }
}

function ensureFile(name, file) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    console.error(`Missing ${name}: ${file}`);
    process.exit(1);
  }
}

ensureDir('originalsDir', originalsDir);
ensureDir('promptsDir', promptsDir);
ensureFile('maskPath', maskPath);

if (!fs.existsSync(outDir)) {
  try {
    fs.mkdirSync(outDir, { recursive: true });
  } catch (err) {
    console.error(`Failed to create output directory ${outDir}: ${err.message}`);
    process.exit(1);
  }
} else if (!fs.statSync(outDir).isDirectory()) {
  console.error(`output directory path is not a directory: ${outDir}`);
  process.exit(1);
}

const summaries = loadAllSummaries(promptsDir);
const images = fs.readdirSync(originalsDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));

(async () => {
  for (const img of images) {
    const imagePath = path.join(originalsDir, img);
    const outPath = path.join(outDir, img);
    try {
      const prompt = getPromptForImage(img, summaries);
      console.log(`→ Processing ${img} with prompt: ${prompt.slice(0, 80)}...`);
      await editImage({ imagePath, maskPath, prompt, outPath, size });
      console.log(`✓ Saved landscape version to: ${outPath}`);
    } catch (e) {
      console.error(`✗ Skipped ${img}:`, e.message);
    }
  }
})();

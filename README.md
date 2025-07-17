## **"ai-landscape-batcher"**

### **🔁 REVERSED FLOW:**

1. **Loop through all images** in a given input path (e.g. `./originals/`)

2. **For each image**:

   * Match filename (e.g., `5-6-learning-objectives.png`) against the `"expected_filename"` in one or more JSON files

   * Extract the `"summary"` as the prompt

   * Send it along with the image \+ pre-defined mask to OpenAI's `images.edit` endpoint (using model `gpt-image-1`)

3. **Output the generated image** to a new folder (e.g. `./landscapes/`) using **the exact same filename \+ format**

---

## **🏗️ Folder Structure**

bash  
CopyEdit  
`ai-landscape-batcher/`  
`├── bin/`  
`│   └── batch-landscape.js     # CLI entry point`  
`├── lib/`  
`│   ├── loadJsonSummaries.js   # Loads + caches summary data`  
`│   ├── matchImageToSummary.js # Matches file to JSON prompt`  
`│   ├── editImage.js           # OpenAI image edit logic`  
`├── originals/                 # Input images (original)`  
`├── mask/extension_mask.png    # Single mask file`  
`├── prompts/                   # Folder with multiple JSON files`  
`├── landscapes/                # Output folder (same filenames)`  
`├── .env`  
`└── package.json`

---

## **📦 install dependencies**

bash  
CopyEdit  
`npm init -y`  
`npm install openai dotenv`

---

## **📄 `.env` (example)**

ini  
CopyEdit  
`OPENAI_API_KEY=sk-...`

---

## **🔧 Key Files**

### **`loadJsonSummaries.js`**

js  
CopyEdit  
`import fs from 'fs';`  
`import path from 'path';`

`export function loadAllSummaries(jsonFolder) {`  
  `const files = fs.readdirSync(jsonFolder).filter(f => f.endsWith('.json'));`  
  `let summaries = [];`  
  `for (const file of files) {`  
    `const data = JSON.parse(fs.readFileSync(path.join(jsonFolder, file)));`  
    `summaries.push(...data);`  
  `}`  
  `return summaries;`  
`}`

---

### **`matchImageToSummary.js`**

js  
CopyEdit  
`export function getPromptForImage(filename, summaries) {`  
  `const match = summaries.find(entry => entry.expected_filename === filename);`  
  ``if (!match) throw new Error(`No summary found for: ${filename}`);``  
  `return match.summary;`  
`}`

---

### **`editImage.js`**

js  
CopyEdit  
`import fs from 'fs';`  
`import { OpenAI } from 'openai';`  
`import path from 'path';`  
`import dotenv from 'dotenv';`  
`dotenv.config();`

`const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });`

`export async function editImage({ imagePath, maskPath, prompt, outPath }) {`  
  `const response = await openai.images.edit({`  
    `model: 'gpt-image-1',`  
    `image: fs.createReadStream(imagePath),`  
    `mask: fs.createReadStream(maskPath),`  
    `prompt,`  
    `size: '1536x1024',`  
    `response_format: 'b64_json',`  
  `});`

  `const b64 = response.data[0].b64_json;`  
  `const buffer = Buffer.from(b64, 'base64');`  
  `fs.writeFileSync(outPath, buffer);`  
`}`

---

### **`bin/batch-landscape.js`**

js  
CopyEdit  
`#!/usr/bin/env node`  
`import fs from 'fs';`  
`import path from 'path';`  
`import { loadAllSummaries } from '../lib/loadJsonSummaries.js';`  
`import { getPromptForImage } from '../lib/matchImageToSummary.js';`  
`import { editImage } from '../lib/editImage.js';`

`const [,, originalsDir, jsonDir, maskPath, outDir] = process.argv;`

`if (!originalsDir || !jsonDir || !maskPath || !outDir) {`  
  `console.error('Usage: poetry <originalsDir> <jsonDir> <mask.png> <outputDir>');`  
  `process.exit(1);`  
`}`

`const summaries = loadAllSummaries(jsonDir);`  
`const images = fs.readdirSync(originalsDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));`

`(async () => {`  
  `for (const img of images) {`  
    `const imagePath = path.join(originalsDir, img);`  
    `const outPath = path.join(outDir, img);`  
    `try {`  
      `const prompt = getPromptForImage(img, summaries);`  
      ``console.log(`→ Processing ${img} with prompt: ${prompt.slice(0, 80)}...`);``  
      `await editImage({ imagePath, maskPath, prompt, outPath });`  
      ``console.log(`✓ Saved landscape version to: ${outPath}`);``  
    `} catch (e) {`  
      ``console.error(`✗ Skipped ${img}:`, e.message);``  
    `}`  
  `}`  
`})();`

Make this CLI file executable:

bash  
CopyEdit  
`chmod +x bin/batch-landscape.js`

Then run with:

bash  
CopyEdit  
`./bin/batch-landscape.js ./originals ./prompts ./mask/extension_mask.png ./landscapes`

---

## **✅ Final Behavior Summary**

* 🔁 Iterates through **all images**

* 📥 For each image, finds its corresponding prompt from one or more **summary JSONs**

* 🧠 Sends to **`gpt-image-1`** with a shared **mask**

* 💾 Saves final output image with same name \+ format to `./landscapes/`

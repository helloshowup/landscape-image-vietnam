# ai-landscape-batcher

CLI for converting a folder of images to landscape format using OpenAI's `images.edit` API. Prompts are read from JSON files and matched by `expected_filename`.

## Setup

```bash
npm install
cp .env.example .env # add your OpenAI key
```

Directory layout:

- `originals/` – input images
- `prompts/` – JSON files containing `{ expected_filename, summary }`
- `mask/` – mask PNG applied to all images
- `landscapes/` – output folder for generated images

## Usage

Make the CLI executable and run it with all required paths:

```bash
chmod +x bin/batch-landscape.js
./bin/batch-landscape.js ./originals ./prompts ./mask/extension_mask.png ./landscapes
```

Or invoke it via npm once installed:

```bash
npx batch-landscape ./originals ./prompts ./mask/extension_mask.png ./landscapes
```

Each image is processed with its prompt and the mask. Results are saved in the output directory using the same filename and format.

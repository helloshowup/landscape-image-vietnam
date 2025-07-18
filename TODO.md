# TODOs for AI Landscape Batcher implementation

- ~~**init: set up basic Node project structure**~~
  - ~~create `bin/` and `lib/` folders~~
  - ~~initialize `package.json` with `type: module`~~

- ~~**chore: add gitignore and env example**~~
  - ~~ignore `node_modules` and output folders~~
  - ~~provide `.env.example` with `OPENAI_API_KEY=` placeholder~~

- ~~**feat: load all JSON summaries**~~
  - ~~implement `lib/loadJsonSummaries.js` for deterministic JSON loading~~

- ~~**feat: match image filenames to prompts**~~
  - ~~implement `lib/matchImageToSummary.js` with loud failure on no match~~

- ~~**feat: openai image edit helper**~~
  - ~~implement `lib/editImage.js` to call `gpt-image-1` with mask and prompt~~

- ~~**feat: command line batch processor**~~
  - ~~implement `bin/batch-landscape.js` for argument parsing and batch flow~~
  - ~~ensure usage message on incorrect args and visible errors per file~~

- ~~**docs: usage guide in README**~~
  - ~~document CLI invocation and environment setup~~

- ~~**chore: add directory placeholders**~~
  - ~~create empty `originals/`, `prompts/`, `mask/`, and `landscapes/` folders for example structure~~

## Completed with this PR

- ~~add `bin` entry in package.json so CLI can be invoked with `npx`~~
- ~~create output directory automatically if it does not exist~~


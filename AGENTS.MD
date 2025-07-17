# **AGENTS.MD – AI Landscape Batcher**

## **Purpose**

Develop a minimal, reproducible Node.js CLI that automates batch image transformation using OpenAI’s `gpt-image-1` model. The tool reads image files from a directory, looks up matching prompt metadata from structured JSON files, and submits both the image and a shared mask to generate landscape-format versions of the original visuals. Outputs are saved using the exact same filename and format for seamless replacement or parallel delivery.

## **Persona**

Expert Node/JS engineer & automation-minded CLI builder.  
 Pragmatic, CLI-native, no-frills.  
 Fails fast and loudly — all errors visible, no silent skips.  
 Works for an owner who values precision, blunt logic, and future-proof simplicity.
 You must be able to resume work at any point when asked to “continue with your TODOs.”
## **Principles**

* **Immutable Inputs**: Images and JSON are never modified. All outputs written separately.

* **Deterministic Matching**: Filename-based lookup from `expected_filename` fields.

* **Strict Prompt Matching**: If no prompt is found, the file is skipped with error.

* **Portable by Design**: No hardcoded paths; CLI arguments must define all I/O.

* **Repeatable Runs**: Outputs are identical across runs with identical inputs.

## **Runtime Flow**

pgsql  
CopyEdit  
`input_dir/      →  contains original image assets (PNG/JPG)`    
`prompt_jsons/   →  folder with one or more JSON files describing prompts`    
`mask.png        →  shared extension mask for all images`    
`output_dir/     →  destination for generated landscape images`  

## **Usage**

bash  
CopyEdit  
`./bin/batch-landscape.js ./originals ./prompts ./mask/extension_mask.png ./landscapes`

Each input image must have a matching `"expected_filename"` in one of the prompt JSON files. If no match is found, the image is skipped with a clear error message.

## **Output**

* All generated images saved in `output_dir/` with **same name and format** as original.

* Output images are 1536×1024, stylized using the OpenAI prompt extracted from JSON.

import fs from 'fs';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function editImage({ imagePath, maskPath, prompt, outPath, size = '1536x1024' }) {
  try {
    const response = await openai.images.edit({
      model: 'gpt-image-1',
      image: fs.createReadStream(imagePath),
      mask: fs.createReadStream(maskPath),
      prompt,
      size,
      response_format: 'b64_json',
    });

    const b64 = response.data[0].b64_json;
    const buffer = Buffer.from(b64, 'base64');
    fs.writeFileSync(outPath, buffer);
  } catch (err) {
    console.error('OpenAI API error:', err.message);
    throw err;
  }
}

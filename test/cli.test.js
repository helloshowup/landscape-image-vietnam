import path from 'path';
import { test } from 'node:test';
import { strictEqual } from 'node:assert';
import { execFileSync } from 'child_process';

const cli = path.resolve('bin/batch-landscape.js');

test('CLI shows usage on missing args', () => {
  let output = '';
  let exitCode = 0;
  try {
    execFileSync('node', [cli], { stdio: 'pipe', env: { ...process.env, OPENAI_API_KEY: 'x' } });
  } catch (err) {
    output = err.stderr.toString();
    exitCode = err.status;
  }
  strictEqual(exitCode, 1);
  strictEqual(/Usage: batch-landscape/.test(output), true);
});

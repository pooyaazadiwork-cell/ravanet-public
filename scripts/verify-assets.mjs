import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');
const manifestPath = resolve(repositoryRoot, 'docs/asset-checksums.sha256');

const manifest = await readFile(manifestPath, 'utf8');
const entries = manifest
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const match = line.match(/^([a-f0-9]{64})\s{2}(.+)$/i);
    if (!match) throw new Error(`Invalid checksum line: ${line}`);
    return { expected: match[1].toLowerCase(), path: match[2] };
  });

let failures = 0;

for (const entry of entries) {
  const absolutePath = resolve(repositoryRoot, entry.path);
  const pathFromRoot = relative(repositoryRoot, absolutePath);

  if (isAbsolute(pathFromRoot) || pathFromRoot === '..' || pathFromRoot.startsWith(`..${sep}`)) {
    console.error(`FAIL  unsafe path: ${entry.path}`);
    failures += 1;
    continue;
  }

  try {
    const contents = await readFile(absolutePath);
    const actual = createHash('sha256').update(contents).digest('hex');
    if (actual === entry.expected) {
      console.log(`OK    ${entry.path}`);
    } else {
      console.error(`FAIL  ${entry.path}\n      expected ${entry.expected}\n      received ${actual}`);
      failures += 1;
    }
  } catch (error) {
    console.error(`FAIL  ${entry.path}: ${error.message}`);
    failures += 1;
  }
}

if (failures) {
  console.error(`\nAsset verification failed (${failures} problem${failures === 1 ? '' : 's'}).`);
  process.exitCode = 1;
} else {
  console.log(`\nVerified ${entries.length} local assets and reference files.`);
}

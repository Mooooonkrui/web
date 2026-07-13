#!/usr/bin/env node
import { cp, mkdir, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { execSync } from 'child_process';

const [src, dest] = process.argv.slice(2);

if (!src || !dest) {
  console.error('Usage: build-site.mjs <src> <dest>');
  process.exit(1);
}

// Check if any .ts files exist
async function hasTsFiles(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        if (await hasTsFiles(full)) return true;
      } else if (e.name.endsWith('.ts')) {
        return true;
      }
    }
  } catch {}
  return false;
}

if (await hasTsFiles(src)) {
  console.log('📦 Compiling TypeScript...');
  execSync('tsc', { stdio: 'inherit', cwd: process.cwd() });
}

// Copy non-.ts files to dist
await mkdir(dest, { recursive: true });
const entries = await readdir(src, { withFileTypes: true });
await Promise.all(
  entries
    .filter(e => !e.name.endsWith('.ts'))
    .map(e => cp(join(src, e.name), join(dest, e.name), { recursive: true }))
);

console.log(`✅ ${src} → ${dest}`);

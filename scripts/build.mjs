#!/usr/bin/env node
/**
 * Builds the package as a dual CommonJS / ES module distribution:
 *
 *   dist/cjs  – CommonJS output (+ package.json marking it as such)
 *   dist/esm  – ES module output (+ package.json marking it as such)
 *
 * Each directory gets its own `.d.ts` files so TypeScript resolves the correct
 * module format under both `import` and `require` conditions.
 */
import { execFileSync } from 'child_process';
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const tsc = require.resolve('typescript/bin/tsc');

const targets = [
  { config: 'tsconfig.cjs.json', dir: 'dist/cjs', type: 'commonjs' },
  { config: 'tsconfig.esm.json', dir: 'dist/esm', type: 'module' },
];

rmSync(join(root, 'dist'), { recursive: true, force: true });

for (const { config, dir, type } of targets) {
  console.log(`Compiling ${config} -> ${dir}`);
  execFileSync(process.execPath, [tsc, '-p', join(root, config)], { cwd: root, stdio: 'inherit' });

  mkdirSync(join(root, dir), { recursive: true });
  writeFileSync(join(root, dir, 'package.json'), JSON.stringify({ type }, null, 2) + '\n');
}

console.log('Build complete.');

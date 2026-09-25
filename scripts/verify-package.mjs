#!/usr/bin/env node
/**
 * Packs the library, installs the tarball into a throw-away project, and checks
 * that it loads from both CommonJS and ES modules (including subpath exports).
 * Run after `npm run build`.
 */
import { execFileSync } from 'child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const workdir = mkdtempSync(join(tmpdir(), 'super-utils-plus-verify-'));

const run = (command, args, options = {}) =>
  execFileSync(command, args, {
    stdio: ['ignore', 'pipe', 'inherit'],
    encoding: 'utf8',
    ...options,
  });

try {
  const tarball = run(npm, ['pack', '--pack-destination', workdir, '--loglevel', 'error'], {
    cwd: root,
  })
    .trim()
    .split('\n')
    .pop();

  writeFileSync(join(workdir, 'package.json'), JSON.stringify({ name: 'verify', private: true }));
  run(npm, ['install', '--no-audit', '--no-fund', '--silent', join(workdir, tarball)], {
    cwd: workdir,
  });

  writeFileSync(
    join(workdir, 'check.cjs'),
    `const utils = require('super-utils-plus');
const { chunk } = require('super-utils-plus/array');
const { camelCase } = require('super-utils-plus/string');
if (typeof utils.debounce !== 'function') throw new Error('root require failed');
if (JSON.stringify(chunk([1, 2, 3], 2)) !== '[[1,2],[3]]') throw new Error('array subpath failed');
if (camelCase('Foo Bar') !== 'fooBar') throw new Error('string subpath failed');
console.log('CommonJS OK (' + Object.keys(utils).length + ' exports)');
`
  );

  writeFileSync(
    join(workdir, 'check.mjs'),
    `import * as utils from 'super-utils-plus';
import { get } from 'super-utils-plus/object';
import { isEqual } from 'super-utils-plus/utils';
if (typeof utils.debounce !== 'function') throw new Error('root import failed');
if (get({ a: [{ b: 1 }] }, 'a[0].b') !== 1) throw new Error('object subpath failed');
if (!isEqual(new Map([[1, 2]]), new Map([[1, 2]]))) throw new Error('utils subpath failed');
console.log('ESM OK (' + Object.keys(utils).length + ' exports)');
`
  );

  process.stdout.write(run(process.execPath, ['check.cjs'], { cwd: workdir }));
  process.stdout.write(run(process.execPath, ['check.mjs'], { cwd: workdir }));
} finally {
  rmSync(workdir, { recursive: true, force: true });
}

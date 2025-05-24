#!/usr/bin/env node

/**
 * Build script for SuperUtilsPlus
 * Handles TypeScript compilation and package preparation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Print colored output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.bright) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
  process.exit(1);
}

function logInfo(message) {
  log(`ℹ ${message}`, colors.cyan);
}

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function runCommand(command, errorMessage) {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    if (errorMessage) {
      logError(errorMessage);
    }
    return false;
  }
}

// Create dist directory if it doesn't exist
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist');
  logSuccess('Created dist directory');
}

// Main build process
log('\n📦 Building SuperUtilsPlus\n', colors.cyan);

// Run TypeScript compiler
logInfo('Compiling TypeScript...');
if (!runCommand('tsc', 'TypeScript compilation failed')) {
  process.exit(1);
}
logSuccess('TypeScript compilation complete');

// Check if package.json exists
if (!fs.existsSync('./package.json')) {
  logError('package.json not found');
}

// Read package info
const pkg = require('./package.json');
logInfo(`Building package: ${pkg.name}@${pkg.version}`);

// Copy package.json to dist with only the necessary fields
logInfo('Preparing package.json for distribution...');
const distPkg = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  main: 'index.js',
  module: 'index.esm.js',
  types: 'index.d.ts',
  author: pkg.author,
  license: pkg.license,
  repository: pkg.repository,
  bugs: pkg.bugs,
  homepage: pkg.homepage,
  keywords: pkg.keywords,
  engines: pkg.engines,
  sideEffects: pkg.sideEffects,
};

fs.writeFileSync(
  path.join('./dist', 'package.json'),
  JSON.stringify(distPkg, null, 2)
);
logSuccess('Created distribution package.json');

// Copy README, LICENSE, and other documentation
const filesToCopy = ['README.md', 'LICENSE', 'COMPARISON.md'];
filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join('./dist', file));
    logSuccess(`Copied ${file} to dist`);
  } else {
    logWarning(`${file} not found, skipping`);
  }
});

// Run tests
logInfo('Running tests...');
if (!runCommand('npm test', 'Tests failed')) {
  process.exit(1);
}
logSuccess('All tests passed');

// Generate package size information
const getFolderSize = folderPath => {
  let size = 0;
  const files = fs.readdirSync(folderPath);
  
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isFile()) {
      size += stats.size;
    } else if (stats.isDirectory()) {
      size += getFolderSize(filePath);
    }
  }
  
  return size;
};

const distSize = getFolderSize('./dist');
logInfo(`Package size: ${(distSize / 1024).toFixed(2)} KB`);

// Final message
log('\n✅ Build completed successfully!', colors.green);
log('To publish this package to npm, run:', colors.cyan);
log('npm publish ./dist\n', colors.bright);
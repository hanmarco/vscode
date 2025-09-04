#!/usr/bin/env node
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const gulpPath = path.join(__dirname, '..', 'node_modules', 'gulp', 'bin', 'gulp.js');

// Check if we have the gulp binary
if (!fs.existsSync(gulpPath)) {
    console.error('Error: gulp not found. Please run "npm install" first.');
    process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
let arch = 'x64';
let target = 'system';

// Parse arguments
for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--arch' && i + 1 < args.length) {
        arch = args[i + 1];
        i++; // Skip next argument
    } else if (arg === '--target' && i + 1 < args.length) {
        target = args[i + 1];
        i++; // Skip next argument
    } else if (arg === '--help' || arg === '-h') {
        console.log(`
VS Code Windows Build Script

Usage: node scripts/build-win32.js [options]

Options:
  --arch <arch>     Architecture to build for (x64, arm64) [default: x64]
  --target <target> Installation target (system, user) [default: system]
  --help, -h        Show this help message

Examples:
  node scripts/build-win32.js                    # Build x64 system installer
  node scripts/build-win32.js --arch arm64       # Build ARM64 system installer
  node scripts/build-win32.js --target user      # Build x64 user installer
  node scripts/build-win32.js --arch arm64 --target user  # Build ARM64 user installer
`);
        process.exit(0);
    }
}

// Validate arguments
if (!['x64', 'arm64'].includes(arch)) {
    console.error('Error: Architecture must be "x64" or "arm64"');
    process.exit(1);
}

if (!['system', 'user'].includes(target)) {
    console.error('Error: Target must be "system" or "user"');
    process.exit(1);
}

const taskName = `vscode-win32-${arch}-${target}-setup`;

console.log(`Building VS Code for Windows ${arch} (${target} installer)...`);
console.log(`Running gulp task: ${taskName}`);

// Run the gulp task
const child = spawn('node', [gulpPath, taskName], {
    stdio: 'inherit',
    cwd: path.dirname(__dirname)
});

child.on('close', (code) => {
    if (code === 0) {
        console.log(`\nBuild completed successfully!`);
        console.log(`Architecture: ${arch}`);
        console.log(`Target: ${target}`);
        console.log(`Output should be in: .build/win32-${arch}/${target}-setup/`);
    } else {
        console.error(`\nBuild failed with exit code ${code}`);
        process.exit(code);
    }
});

child.on('error', (err) => {
    console.error('Error starting build process:', err.message);
    process.exit(1);
});
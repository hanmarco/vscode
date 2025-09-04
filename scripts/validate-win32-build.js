#!/usr/bin/env node
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Windows Build Configuration...\n');

const checks = [
    {
        name: 'Windows build tasks in gulpfile.vscode.win32.js',
        check: () => fs.existsSync(path.join(__dirname, '..', 'build', 'gulpfile.vscode.win32.js')),
        details: 'Contains gulp tasks for x64/ARM64 Windows builds'
    },
    {
        name: 'Windows product configuration in product.json',
        check: () => {
            const productPath = path.join(__dirname, '..', 'product.json');
            if (!fs.existsSync(productPath)) return false;
            const product = JSON.parse(fs.readFileSync(productPath, 'utf8'));
            return product.win32x64AppId && product.win32arm64AppId && product.win32DirName;
        },
        details: 'Contains Windows-specific App IDs and configuration'
    },
    {
        name: 'Windows build assets in build/win32/',
        check: () => fs.existsSync(path.join(__dirname, '..', 'build', 'win32')),
        details: 'Contains InnoSetup configuration and Windows-specific files'
    },
    {
        name: 'npm scripts for Windows builds',
        check: () => {
            const packagePath = path.join(__dirname, '..', 'package.json');
            if (!fs.existsSync(packagePath)) return false;
            const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            return pkg.scripts && pkg.scripts['build-win32-x64-setup'] && pkg.scripts['build-win32-arm64-setup'];
        },
        details: 'npm scripts available for easy Windows building'
    },
    {
        name: 'Windows build helper script',
        check: () => fs.existsSync(path.join(__dirname, 'build-win32.js')),
        details: 'Command-line helper for Windows builds'
    },
    {
        name: 'Windows build documentation',
        check: () => fs.existsSync(path.join(__dirname, '..', 'docs', 'BUILD_WINDOWS.md')),
        details: 'Comprehensive guide for Windows builds'
    }
];

let allPassed = true;

checks.forEach(({ name, check, details }) => {
    const passed = check();
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${name}`);
    if (details) {
        console.log(`   ${details}`);
    }
    if (!passed) {
        allPassed = false;
    }
    console.log('');
});

if (allPassed) {
    console.log('🎉 All Windows build infrastructure checks passed!');
    console.log('');
    console.log('Available Windows build commands:');
    console.log('  npm run build-win32-x64-setup      # x64 system installer');
    console.log('  npm run build-win32-x64-user-setup # x64 user installer');
    console.log('  npm run build-win32-arm64-setup    # ARM64 system installer');
    console.log('  npm run build-win32-arm64-user-setup # ARM64 user installer');
    console.log('  npm run build-win32                # All Windows builds');
    console.log('');
    console.log('Or use the helper script:');
    console.log('  node scripts/build-win32.js --help');
    console.log('');
    console.log('📖 For detailed instructions: docs/BUILD_WINDOWS.md');
} else {
    console.log('❌ Some Windows build infrastructure is missing.');
    console.log('   Please check the failed items above.');
    process.exit(1);
}
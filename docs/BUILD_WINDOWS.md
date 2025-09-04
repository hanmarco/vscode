# Building VS Code for Windows

This guide explains how to build VS Code for Windows targets.

## Prerequisites

1. **Node.js** (version 22 or higher recommended)
2. **npm** (comes with Node.js)
3. **InnoSetup** (for creating Windows installers)
4. **Python** (for native module compilation)
5. **Visual Studio Build Tools** (for native module compilation)

## Quick Start

### Install Dependencies
```bash
npm install
```

### Build for Windows

#### Using npm scripts (easiest):
```bash
# Build x64 system installer
npm run build-win32-x64-setup

# Build x64 user installer  
npm run build-win32-x64-user-setup

# Build ARM64 system installer
npm run build-win32-arm64-setup

# Build ARM64 user installer
npm run build-win32-arm64-user-setup

# Build all Windows targets
npm run build-win32
```

#### Using the build script directly:
```bash
# Build x64 system installer (default)
node scripts/build-win32.js

# Build ARM64 system installer
node scripts/build-win32.js --arch arm64

# Build x64 user installer
node scripts/build-win32.js --target user

# Build ARM64 user installer
node scripts/build-win32.js --arch arm64 --target user
```

## Architecture Support

- **x64**: For 64-bit Intel/AMD processors
- **ARM64**: For ARM-based Windows devices (Surface Pro X, etc.)

## Installation Types

- **System**: Installs for all users (requires admin privileges)
- **User**: Installs for current user only (no admin required)

## Output Location

Build outputs will be located in:
```
.build/win32-{arch}/{target}-setup/
```

For example:
- `.build/win32-x64/system-setup/` - x64 system installer
- `.build/win32-arm64/user-setup/` - ARM64 user installer

## Configuration

Windows-specific configuration is in:
- `product.json` - Product metadata and Windows-specific IDs
- `build/gulpfile.vscode.win32.js` - Windows build tasks
- `build/win32/` - Windows-specific build assets

## Related Files

- `package.json` - Contains Windows build npm scripts
- `scripts/build-win32.js` - Windows build helper script
- `build/gulpfile.vscode.win32.js` - Gulp tasks for Windows builds
- `product.json` - Windows product configuration

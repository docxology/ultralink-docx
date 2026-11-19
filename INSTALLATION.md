# Installation Guide

This guide provides detailed instructions for installing UltraLink in various environments and configurations.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Basic Installation](#basic-installation)
- [Environment-Specific Installation](#environment-specific-installation)
  - [Node.js](#nodejs)
  - [Browser](#browser)
- [Development Setup](#development-setup)
- [Continuous Integration](#continuous-integration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before installing UltraLink, ensure you have the following:

- **Node.js**: Use Node.js 22.23.5 for the tested source setup. The locked
  `sharp` 0.35.5 dependency declares Node.js 20.9.0 as the minimum engine
  version; that floor is not a tested setup. [Download Node.js](https://nodejs.org/).
- **npm**: The tested source setup uses npm 11.20.0, which leaves the
  checked-in lockfile unchanged.
- **Git**: For version control (optional, but recommended)

## Basic Installation

### npm (Recommended)

```bash
npm install ultralink
```

### Yarn

```bash
yarn add ultralink
```

### pnpm

```bash
pnpm add ultralink
```

## Environment-Specific Installation

### Node.js

For a Node.js application, UltraLink can be installed as a dependency in your project:

```bash
# Create a new project if needed
mkdir my-ultralink-project
cd my-ultralink-project
npm init -y

# Install UltraLink
npm install ultralink

# Create a basic script
echo 'const { UltraLink } = require("ultralink");
const ultralink = new UltraLink();
console.log("UltraLink initialized!");' > index.js

# Run the script
node index.js
```

### Browser

The repository ships CommonJS source (`src/index.js`) and has no published
browser bundle (`dist/`), so use a bundler to build it for the browser.

If you're using a bundler like webpack, Rollup, or Parcel:

```javascript
// Install UltraLink
// npm install ultralink

// In your JavaScript file
import { UltraLink } from 'ultralink';
const ultralink = new UltraLink();
```

## Development Setup

For developers contributing to UltraLink or building extensions:

Check that the version commands print the tested versions before running
`npm install`.

```bash
# Clone the repository
git clone https://github.com/docxology/ultralink-docx.git
cd ultralink-docx

# Check the active runtime and package manager
node --version  # v22.23.5
npm --version   # 11.20.0

# Install dependencies
npm install

# Run tests
npm test
```

## Continuous Integration

For CI/CD pipelines, UltraLink can be installed and tested in automation:

### GitHub Actions

```yaml
name: UltraLink CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x, 22.x]
    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
    - run: npm ci
    - run: npm test
```

### CircleCI

```yaml
version: 2.1
jobs:
  build:
    docker:
      - image: cimg/node:20.19
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-dependencies-{{ checksum "package.json" }}
      - run: npm install
      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{{ checksum "package.json" }}
      - run: npm test
```

## Troubleshooting

### Common Issues

#### Installation Fails with Node.js Version Error

**Problem**: You see an error about Node.js version requirements.

**Solution**: Use Node.js 22.23.5 for this checkout:

```bash
nvm install 22.23.5
nvm use 22.23.5
node --version
```

#### Browser Version Compatibility

**Problem**: UltraLink doesn't work in older browsers.

**Solution**: UltraLink requires modern browsers that support ES6+ features. Consider using a transpiler like Babel for older browser support:

```bash
npm install --save-dev @babel/core @babel/preset-env babel-loader
```

#### Memory Issues with Large Datasets

**Problem**: Processing large datasets causes memory errors.

**Solution**: Increase Node.js memory limit:

```bash
NODE_OPTIONS=--max-old-space-size=4096 node your-script.js
```

For more troubleshooting help, see our [Troubleshooting Guide](docs/troubleshooting/troubleshooting.md) or [open an issue](https://github.com/docxology/ultralink-docx/issues).
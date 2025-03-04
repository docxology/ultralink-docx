# Installation Guide

This guide provides detailed instructions for installing UltraLink in various environments and configurations.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Basic Installation](#basic-installation)
- [Environment-Specific Installation](#environment-specific-installation)
  - [Node.js](#nodejs)
  - [Browser](#browser)
  - [Docker](#docker)
- [Development Setup](#development-setup)
- [Continuous Integration](#continuous-integration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before installing UltraLink, ensure you have the following:

- **Node.js**: Version 14.0.0 or higher ([download](https://nodejs.org/))
- **npm**, **yarn**, or **pnpm**: For package management
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

#### Via CDN

```html
<!-- Latest version -->
<script src="https://cdn.jsdelivr.net/npm/ultralink@latest/dist/ultralink.min.js"></script>

<!-- Specific version -->
<script src="https://cdn.jsdelivr.net/npm/ultralink@0.1.0/dist/ultralink.min.js"></script>

<script>
  const ultralink = new UltraLink();
  console.log("UltraLink initialized in browser!");
</script>
```

#### Via npm and Bundlers

If you're using a bundler like webpack, Rollup, or Parcel:

```javascript
// Install UltraLink
// npm install ultralink

// In your JavaScript file
import { UltraLink } from 'ultralink';
const ultralink = new UltraLink();
```

### Docker

UltraLink is available as a Docker image for containerized deployments:

```bash
# Pull the UltraLink image
docker pull ultralink/ultralink:latest

# Run with mounted volume
docker run -v $(pwd):/data -p 3000:3000 ultralink/ultralink:latest
```

Create a `docker-compose.yml` file for more complex setups:

```yaml
version: '3'
services:
  ultralink:
    image: ultralink/ultralink:latest
    ports:
      - "3000:3000"
    volumes:
      - ./data:/data
    environment:
      - NODE_ENV=production
```

Then run:

```bash
docker-compose up -d
```

## Development Setup

For developers contributing to UltraLink or building extensions:

```bash
# Clone the repository
git clone https://github.com/yourusername/ultralink.git
cd ultralink

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
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
        node-version: [14.x, 16.x, 18.x]
    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v2
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
      - image: cimg/node:16.13
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

**Solution**: Update Node.js to version 14.0.0 or higher:

```bash
# Using nvm (Node Version Manager)
nvm install 14
nvm use 14

# Or download from nodejs.org
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

For more troubleshooting help, see our [Troubleshooting Guide](docs/troubleshooting.md) or [open an issue](https://github.com/yourusername/ultralink/issues). 
# UltraLink Development Setup Guide

This guide will help you set up a development environment for contributing to UltraLink. Follow these steps to get your local environment ready for development, testing, and contribution.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Clone the Repository](#clone-the-repository)
- [Install Dependencies](#install-dependencies)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Documentation](#documentation)
- [Build Process](#build-process)
- [Common Issues](#common-issues)
- [IDE Setup](#ide-setup)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 14.x or later (we recommend using LTS version)
- **npm**: Version 6.x or later (comes with Node.js)
- **Git**: For version control

Optional but recommended:

- **nvm**: For managing multiple Node.js versions
- **Docker**: For running integration tests with database backends

### Installing Prerequisites

#### Node.js and npm

We recommend using [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) to install and manage Node.js versions:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Install LTS version of Node.js
nvm install --lts

# Verify installation
node --version
npm --version
```

#### Git

**Linux (Debian/Ubuntu):**
```bash
sudo apt update
sudo apt install git
```

**macOS:**
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Git
brew install git
```

**Windows:**
Download and install Git from [git-scm.com](https://git-scm.com/).

## Clone the Repository

```bash
# Clone the repository
git clone https://github.com/ultralink/ultralink.git
cd ultralink

# If you're planning to contribute, fork the repository first and clone your fork
git clone https://github.com/your-username/ultralink.git
cd ultralink

# Add the upstream repository
git remote add upstream https://github.com/ultralink/ultralink.git
```

## Install Dependencies

```bash
# Install project dependencies
npm install
```

### Optional Dependencies

For development purposes, you might want to install additional packages:

```bash
# Install development tools globally
npm install -g typescript ts-node nodemon
```

## Development Workflow

### Environment Setup

UltraLink uses environment variables for configuration. Create a `.env` file in the root directory for local development:

```bash
# Create .env file
cp .env.example .env

# Edit the file with your preferred text editor
nano .env
```

Example `.env` file:

```
# Development environment settings
NODE_ENV=development

# Vector settings
VECTOR_DIMENSIONS=768
VECTOR_MODEL=text-embedding-3-small

# OpenAI API for vector generation (if used)
OPENAI_API_KEY=your_api_key_here

# Logging settings
LOG_LEVEL=debug
```

### Development Scripts

UltraLink includes several npm scripts to assist with development:

```bash
# Start development server with hot reloading
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Build the project
npm run build

# Generate documentation
npm run docs
```

### Branching Strategy

When contributing to UltraLink, follow this branching strategy:

```bash
# Create a new branch for your feature or bugfix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-you-are-fixing

# Make your changes and commit them
git add .
git commit -m "feat: description of your changes"

# Push your branch to your fork
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

## Project Structure

The UltraLink project is structured as follows:

```
ultralink/
├── src/               # Source code
│   ├── index.js       # Main entry point
│   ├── core/          # Core UltraLink functionality
│   ├── exporters/     # Export format implementations
│   ├── importers/     # Import format implementations
│   ├── vector/        # Vector embeddings and similarity search
│   ├── events/        # Event system
│   └── utils/         # Utility functions
├── tests/             # Test files
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── fixtures/      # Test fixtures and data
├── docs/              # Documentation
├── examples/          # Example usage
├── scripts/           # Build and maintenance scripts
├── dist/              # Built distribution files (generated)
├── .github/           # GitHub configuration
├── package.json       # Package configuration
└── README.md          # Main README file
```

## Testing

UltraLink uses Jest for testing. To run the tests:

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (useful during development)
npm run test:watch
```

### Writing Tests

When adding features or fixing bugs, please include tests. Tests should be placed in the `tests/` directory, mirroring the structure of the `src/` directory:

```
src/exporters/json-exporter.js → tests/unit/exporters/json-exporter.test.js
```

Example test file:

```javascript
// tests/unit/exporters/json-exporter.test.js
import { JSONExporter } from '../../../src/exporters/json-exporter';
import { UltraLink } from '../../../src/core/ultralink';

describe('JSONExporter', () => {
  let ultralink;
  let exporter;
  
  beforeEach(() => {
    ultralink = new UltraLink();
    exporter = new JSONExporter(ultralink);
  });
  
  test('should export empty graph', async () => {
    const result = await exporter.export();
    expect(JSON.parse(result)).toEqual({
      entities: [],
      relationships: []
    });
  });
  
  // Add more tests...
});
```

## Documentation

UltraLink uses Markdown for documentation. When adding features or modifying existing ones, please update the relevant documentation:

```bash
# Generate documentation
npm run docs

# Serve documentation locally
npm run docs:serve
```

The documentation is built using a static site generator and can be found in the `docs/` directory.

## Build Process

UltraLink uses a build process to transpile TypeScript (if applicable) and bundle the code for distribution:

```bash
# Build the project
npm run build

# Build in watch mode (rebuilds on file changes)
npm run build:watch
```

The build process outputs files to the `dist/` directory, which is what gets published to npm.

## Common Issues

### Node.js Version Issues

If you encounter issues related to Node.js versions, ensure you're using the recommended version:

```bash
# Using nvm
nvm use

# If no .nvmrc file exists, use LTS
nvm use --lts
```

### Dependency Issues

If you encounter dependency-related issues:

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

### Test Failures

If tests are failing:

- Ensure you have the correct environment variables set in your `.env` file
- Check if you need to run any database or service containers for integration tests
- Verify that your changes haven't affected other functionality

## IDE Setup

### Visual Studio Code

For Visual Studio Code users, we recommend the following extensions:

- ESLint
- Prettier
- Jest
- GitLens
- GitHub Pull Requests and Issues

We provide a `.vscode/settings.json` file with recommended settings:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "typescript"
  ],
  "jest.autoRun": {
    "watch": true,
    "onSave": "test-src-file"
  }
}
```

### WebStorm/IntelliJ IDEA

For JetBrains IDE users:

1. Enable ESLint integration: Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint → Automatic ESLint configuration
2. Enable Prettier integration: Settings → Languages & Frameworks → JavaScript → Prettier → Automatic Prettier configuration
3. Set up Jest: Settings → Languages & Frameworks → JavaScript → Jest → Jest package → (select node_modules/jest)

## Contribution Workflow

After setting up your development environment, follow these steps to contribute:

1. **Create an issue**: Before making significant changes, create an issue to discuss your proposed changes
2. **Fork the repository**: Work on your own fork of the repository
3. **Create a branch**: Create a new branch for your feature or bug fix
4. **Make your changes**: Implement your changes, including tests and documentation
5. **Run tests**: Ensure all tests are passing
6. **Submit a pull request**: Push your changes to your fork and create a pull request
7. **Code review**: Address any feedback from the code review
8. **Merge**: Once approved, your changes will be merged

Thank you for contributing to UltraLink! 
# Contributing to UltraLink 🤝

Thank you for considering contributing to UltraLink! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Making Contributions](#making-contributions)
  - [Issues](#issues)
  - [Pull Requests](#pull-requests)
  - [Code Style](#code-style)
  - [Testing](#testing)
  - [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Architecture Guidelines](#architecture-guidelines)
- [Review Process](#review-process)
- [Community](#community)

## Code of Conduct

UltraLink follows a Code of Conduct that all contributors are expected to adhere to. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

1. **Fork the repository**
   - Click the "Fork" button on the [UltraLink repository](https://github.com/ultralink/ultralink).

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/ultralink.git
   cd ultralink
   ```

3. **Set up the upstream remote**
   ```bash
   git remote add upstream https://github.com/ultralink/ultralink.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Run tests to ensure everything works**
   ```bash
   npm test
   ```

## Development Environment

UltraLink requires:
- Node.js 14 or higher
- NPM 6 or higher

Recommended tools:
- VS Code with the following extensions:
  - ESLint
  - Prettier
  - Jest Runner
- Git with LFS support (for some example assets)

## Making Contributions

### Issues

- Search existing issues before creating a new one
- Use issue templates when available
- For bugs, include:
  - Steps to reproduce
  - Expected behavior
  - Actual behavior
  - Environment details (OS, Node.js version, etc.)
  - Error messages or logs
- For features, include:
  - Clear description of the feature
  - Rationale for adding the feature
  - Example use cases
  - Any relevant mockups or diagrams

### Pull Requests

1. **Create a branch for your changes**
   ```bash
   git checkout -b feature/my-feature
   # or
   git checkout -b fix/my-bugfix
   ```

2. **Make your changes and commit them**
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```
   - Follow [Conventional Commits](https://www.conventionalcommits.org/) format
   - Use types like `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

3. **Pull latest upstream changes**
   ```bash
   git pull upstream main
   ```

4. **Push your changes to your fork**
   ```bash
   git push origin feature/my-feature
   ```

5. **Create a pull request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

### Code Style

UltraLink follows a consistent code style enforced by ESLint and Prettier:

- Run `npm run lint` to check code style
- Run `npm run lint:fix` to automatically fix issues
- Configure your editor to use ESLint and Prettier

Key style guidelines:
- Use ES6+ features
- 2-space indentation
- Semi-colons required
- Single quotes for strings
- No trailing commas
- Max line length of 100 characters

### Testing

All contributions should include appropriate tests:

- Unit tests for individual functions and components
- Integration tests for interactions between components
- End-to-end tests for user workflows

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

Test coverage thresholds:
- 80% line coverage
- 80% function coverage
- 80% branch coverage

### Documentation

Documentation is crucial for UltraLink:

- Update relevant documentation for new features
- Document public APIs with JSDoc comments
- Include examples for non-trivial features
- Update the changelog for significant changes

To build and review documentation locally:
```bash
npm run docs:build
npm run docs:serve
```

## Project Structure

```
ultralink/
├── src/              # Source code
│   ├── core/         # Core functionality
│   ├── exporters/    # Export formats
│   ├── types/        # Type definitions
│   ├── integrity/    # Integrity checking
│   └── index.js      # Main entry point
├── tests/            # Test files
│   ├── unit/         # Unit tests
│   ├── integration/  # Integration tests
│   └── e2e/          # End-to-end tests
├── docs/             # Documentation
├── examples/         # Example projects
├── scripts/          # Build and maintenance scripts
└── ... configuration files
```

## Architecture Guidelines

When contributing, please follow these architectural principles:

1. **Modularity**: Keep components focused on a single responsibility
2. **Extensibility**: Design for extension through plugins and hooks
3. **Performance**: Consider performance implications, especially for large datasets
4. **Compatibility**: Maintain backward compatibility when possible
5. **Testability**: Design code to be easily testable
6. **Documentation**: Document design decisions and architecture

## Review Process

Pull requests are reviewed by at least one maintainer. The review process checks:

1. Code quality and style
2. Test coverage and correctness
3. Documentation completeness
4. Performance considerations
5. Security implications
6. Compatibility with existing features

Reviews typically happen within 1-3 business days.

## Community

- Join our [Discord server](https://discord.gg/ultralink) for real-time discussion
- Participate in [GitHub Discussions](https://github.com/ultralink/ultralink/discussions)
- Follow us on [Twitter](https://twitter.com/ultralinkjs) for updates

## Recognition

All contributors are recognized in our [CONTRIBUTORS.md](CONTRIBUTORS.md) file and on the project website.

Thank you for contributing to UltraLink! 🎉 
# Contributing to UltraLink

Thank you for your interest in contributing to UltraLink! This document provides guidelines and instructions for contributing to the project. By following these guidelines, you help maintain the quality and consistency of the codebase.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Workflow](#development-workflow)
  - [Branching Strategy](#branching-strategy)
  - [Commit Messages](#commit-messages)
  - [Code Style](#code-style)
- [Testing](#testing)
- [Documentation](#documentation)
- [Review Process](#review-process)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by the [UltraLink Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [maintainers@ultralink.org](mailto:maintainers@ultralink.org).

## Getting Started

Before you begin contributing, make sure you have:

1. A GitHub account
2. Git installed on your local machine
3. Node.js (LTS version recommended)
4. npm (comes with Node.js)
5. A code editor of your choice

For detailed setup instructions, see the [Development Setup Guide](development-setup.md).

## How to Contribute

### Reporting Bugs

If you find a bug in UltraLink, please report it by creating an issue on GitHub:

1. Check the [existing issues](https://github.com/ultralink/ultralink/issues) to avoid duplicates
2. Use the bug report template
3. Include the steps to reproduce the bug
4. Include the expected behavior
5. Include the actual behavior
6. Include your environment details (OS, Node.js version, UltraLink version)
7. If possible, include a minimal code example that reproduces the bug

**Bug Report Template**:

```markdown
**Description**
A clear and concise description of the bug.

**To Reproduce**
Steps to reproduce the behavior:
1. Create UltraLink instance with '...'
2. Add entities '....'
3. Export to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Actual Behavior**
A clear and concise description of what actually happened.

**Code Example**
```javascript
// A minimal code example that reproduces the bug
const ultralink = new UltraLink();
// ...
```

**Environment**
- OS: [e.g. Windows 10, macOS Monterey, Ubuntu 22.04]
- Node.js version: [e.g. 16.14.0]
- UltraLink version: [e.g. 0.5.2]

**Additional Context**
Add any other context about the problem here.
```

### Suggesting Enhancements

If you have an idea for an enhancement or a new feature, please create an issue on GitHub:

1. Check the [existing issues](https://github.com/ultralink/ultralink/issues) to avoid duplicates
2. Use the feature request template
3. Clearly describe the feature and its benefits
4. Provide examples of how the feature would be used
5. If possible, outline a potential implementation approach

**Feature Request Template**:

```markdown
**Description**
A clear and concise description of the feature.

**Problem It Solves**
Describe the problem or limitation this feature would address.

**Proposed Solution**
A clear and concise description of what you want to happen.

**Example Usage**
```javascript
// Example code showing how the feature would be used
const ultralink = new UltraLink();
// Use the new feature...
```

**Alternatives Considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional Context**
Add any other context or screenshots about the feature request here.
```

### Pull Requests

Ready to contribute code? Here's how to submit a pull request:

1. [Fork](https://github.com/ultralink/ultralink/fork) the repository
2. Clone your fork: `git clone https://github.com/your-username/ultralink.git`
3. Create a branch with a descriptive name (see [Branching Strategy](#branching-strategy))
4. Make your changes (see [Development Workflow](#development-workflow))
5. Run tests: `npm test`
6. Update documentation as needed
7. Commit your changes (see [Commit Messages](#commit-messages))
8. Push to your fork: `git push origin feature/your-feature-name`
9. [Create a pull request](https://github.com/ultralink/ultralink/compare) from your branch to UltraLink's `main` branch
10. Fill out the pull request template

**Pull Request Template**:

```markdown
**Description**
A clear and concise description of the changes.

**Related Issue**
Fixes #(issue number)

**Type of Change**
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

**Testing**
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

**Documentation**
- [ ] I have updated the documentation accordingly

**Additional Context**
Add any other context about the pull request here.
```

## Development Workflow

### Branching Strategy

We use a simplified Git workflow based on feature branches:

- `main`: The main branch containing the latest stable release
- `dev`: Development branch containing the next release features
- Feature branches: Created from `dev` and merged back into `dev` via pull requests

Branch naming conventions:

- `feature/short-description`: For new features
- `fix/issue-number-or-description`: For bug fixes
- `docs/description`: For documentation changes only
- `refactor/description`: For code refactoring without changing functionality
- `test/description`: For adding or modifying tests

Example:
```bash
# Creating a feature branch
git checkout dev
git pull
git checkout -b feature/yaml-exporter

# Creating a fix branch
git checkout dev
git pull
git checkout -b fix/issue-123-csv-export-bug
```

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages. This helps automate version bumps and generate changelogs.

Format:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or correcting tests
- `chore`: Changes to the build process, tools, etc.

Examples:
```
feat(exporters): add YAML exporter

Add a new exporter for YAML format. This allows users to export their knowledge
graphs to YAML format for easier consumption by other tools.

Closes #123
```

```
fix(csv): handle empty relationships correctly

The CSV exporter was generating invalid CSV when there were no relationships.
This commit fixes the issue by generating a header row even when there are no
relationships.

Fixes #456
```

### Code Style

UltraLink follows specific code style guidelines to maintain consistency throughout the codebase:

1. We use ESLint and Prettier for code formatting and style checking
2. Run `npm run lint` to check for style issues
3. Run `npm run lint:fix` to automatically fix style issues
4. Configure your editor to use the project's ESLint and Prettier configs

Key style guidelines:

- Use 2 spaces for indentation
- Use semicolons at the end of statements
- Use single quotes for strings
- Use camelCase for variables and functions
- Use PascalCase for classes
- Maximum line length is 100 characters
- Add JSDoc comments for all public APIs

## Testing

All code contributions should include appropriate tests:

1. Run existing tests: `npm test`
2. Write new tests for new features or bug fixes
3. Update tests when changing existing functionality
4. Aim for high test coverage, especially for critical paths

Testing guidelines:

- Place tests in the `tests/` directory, mirroring the structure of the `src/` directory
- Use Jest for testing
- Write both unit tests and integration tests
- Use mock data and fixtures when appropriate
- Test edge cases and error conditions

Example test:
```javascript
// tests/unit/exporters/yaml-exporter.test.js
const { UltraLink } = require('../../../src/core/ultralink');
const YAMLExporter = require('../../../src/exporters/yaml-exporter');
const yaml = require('yaml');

describe('YAMLExporter', () => {
  let ultralink;
  let exporter;
  
  beforeEach(() => {
    ultralink = new UltraLink();
    ultralink.addEntity('person1', 'person', { name: 'Alice' });
    exporter = new YAMLExporter(ultralink);
  });
  
  test('exports basic YAML', async () => {
    const result = await exporter.export();
    const parsed = yaml.parse(result);
    
    expect(parsed).toHaveProperty('entities');
    expect(parsed.entities).toHaveLength(1);
    expect(parsed.entities[0].attributes.name).toBe('Alice');
  });
});
```

## Documentation

Good documentation is crucial for the success of UltraLink. When contributing, please:

1. Update the documentation to reflect your changes
2. Document all public APIs with JSDoc comments
3. Add examples for new features
4. Keep the README and other markdown files up to date

Documentation types:

- **API Documentation**: JSDoc comments in source code
- **Guides**: Markdown files in the `docs/guides/` directory
- **Tutorials**: Markdown files in the `docs/tutorials/` directory
- **Reference**: Markdown files in the `docs/reference/` directory

JSDoc example:
```javascript
/**
 * Exports UltraLink data to YAML format
 * @param {Object} options - Export options
 * @param {boolean} [options.includeMetadata=true] - Whether to include metadata
 * @param {boolean} [options.flowStyle=false] - Whether to use flow style YAML
 * @param {number} [options.indent=2] - Indentation level
 * @returns {Promise<string>} YAML string representation of the knowledge graph
 * @throws {ExportError} If the export operation fails
 * @example
 * const yaml = await ultralink.toYAML({ flowStyle: true });
 * fs.writeFileSync('graph.yaml', yaml);
 */
async function toYAML(options = {}) {
  // Implementation...
}
```

## Review Process

All contributions go through a review process:

1. Automated checks: CI runs linting and tests on pull requests
2. Code review: At least one maintainer reviews the code
3. Feedback: You may be asked to make changes to your contribution
4. Approval: Once approved, a maintainer will merge your contribution

Review criteria:

- Code quality and style
- Test coverage
- Documentation completeness
- Performance considerations
- Backward compatibility (unless breaking change is intentional)

## Community

Join the UltraLink community:

- **GitHub Discussions**: For questions, ideas, and general discussion
- **Discord**: For real-time communication with other contributors
- **Mailing List**: For major announcements and updates
- **Stack Overflow**: For technical questions (use the `ultralink` tag)

## Recognition

We value all contributions, and we recognize contributors in several ways:

- All contributors are listed in the [CONTRIBUTORS.md](CONTRIBUTORS.md) file
- Significant contributions are highlighted in release notes
- Regular contributors may be invited to join the core team

Thank you for contributing to UltraLink! 
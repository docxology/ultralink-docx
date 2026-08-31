# UltraLink Project Index

This document provides an overview of all top-level files in the UltraLink project, explaining their purpose and relationships.

## Project Configuration

| File | Purpose | Relationship |
|------|---------|--------------|
| `.babelrc` | Babel transpiler configuration | Used by build system to convert modern JS to compatible versions |
| `.gitattributes` | Git attributes configuration | Ensures consistent line endings across different environments |
| `.gitignore` | Git ignored files list | Prevents unnecessary or sensitive files from being committed |
| `package.json` | Project metadata and dependencies | Core configuration for Node.js/npm project |
| `jest.setup.js` | Jest testing configuration | Referenced by Jest in package.json config |
| `jsdoc.json` | JSDoc documentation settings | Used to generate API documentation |

## Documentation

| File | Purpose | Relationship |
|------|---------|--------------|
| `README.md` | Project overview and introduction; the Agent Orientation section (2026-08-31) is the cold-start entry | Main entry point for users and developers |
| `CHANGELOG.md` | Version history and updates | Referenced by README for tracking changes |
| `CODE_OF_CONDUCT.md` | Community guidelines | Referenced by CONTRIBUTING.md |
| `CONTRIBUTING.md` | Contribution process | References CODE_OF_CONDUCT.md |
| `INSTALLATION.md` | Installation guide | Referenced by README.md |
| `EXAMPLES.md` | Usage examples | Referenced by README.md |
| `License.md` | Licensing information | Referenced by README.md and package.json |

## Documentation Flow

```
README.md 
  ├── INSTALLATION.md (How to install)
  ├── EXAMPLES.md (How to use)
  ├── CHANGELOG.md (What's changed)
  ├── License.md (Legal terms)
  └── CONTRIBUTING.md 
        └── CODE_OF_CONDUCT.md (Community standards)
```

## Development Flow

```
package.json (Project definition)
  ├── .babelrc (Code transpilation)
  ├── jsdoc.json (Documentation generation)
  └── jest.setup.js (Testing configuration)
```

## Version Control

```
.gitignore (Excluded files)
.gitattributes (File handling rules)
```

## Work In Progress

| File | Status | Recommendation |
|------|--------|---------------|
| `InferAnt_Stream_011.md` | Dated research stream note (2025-07-27); carries a local-note banner since 2026-08-31 | Keep under review; do not treat as current project documentation | 
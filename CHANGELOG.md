# Changelog

All notable changes to UltraLink will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- HTML Website export format with interactive visualization
- Full Blob export and import for complete data persistence
- System-specific output directories for all export formats
- Comprehensive test suite for all rendering targets
- Enhanced GraphML export with detailed attribute handling
- Performance benchmarking for all export formats
- Obsidian export with backlinks and frontmatter support
- Fallback visualization system for all formats (SVG, PNG, D3, Cytoscape)
- System-specific visualization examples for various knowledge domains
- Comprehensive project status documentation

### Changed
- Improved CSV export with better metadata handling
- Enhanced JSON export with configurable pretty-printing
- Optimized performance for large datasets
- Updated documentation with detailed export format information
- Enhanced test infrastructure with better mocking and async operation handling
- Improved visualization robustness across all supported systems

### Fixed
- Preserve research graph metadata in JSON and round-trip nested CSV and GraphML attributes.
- Export an offline HTML website with working graph controls, theme assets, and custom CSS and JavaScript files.
- Render actual graph nodes and edges in SVG and documented wiki-links and backlinks in Obsidian.
- Generate real graph SVG in synchronous Full Blob exports and runnable Python scenes for Manim.
- Restore discovered export test entrypoints and include all non-performance suites in `npm test`.
- Resolved issues with GraphML attribute serialization
- Fixed relationship counting in Full Blob exports
- Corrected theme handling in HTML Website exports
- Addressed precision issues in JSON exports
- Fixed visualization testing issues related to D3.js integration
- Resolved UltraLink constructor issues in testing environment
- Added proper cleanup for async operations in tests

## [0.1.0] - 2025-03-03

### Added
- Initial release with core UltraLink functionality
- Basic entity and relationship management
- Support for attributes and metadata
- JSON export format
- GraphML export format
- CSV export format
- Basic documentation and examples

[Unreleased]: https://github.com/docxology/ultralink-docx/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/docxology/ultralink-docx/releases/tag/v0.1.0
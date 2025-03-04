# HTML Website Export Improvements (March 2025)

## Overview

The UltraLink HTML Website export feature has been significantly enhanced to provide a more interactive, responsive, and user-friendly experience. These improvements make the exported HTML websites more suitable for exploring and sharing complex UltraLink datasets.

## Key Improvements

### 1. Responsive Design

- **Mobile-friendly layout**: The layout automatically adjusts to different screen sizes with media queries
- **Responsive SVG**: The visualization uses `viewBox` for proper scaling on all devices
- **Flexible containers**: All UI elements resize proportionally to the available space

### 2. Interactive Navigation

- **Zoom and Pan Controls**: 
  - Added intuitive zoom buttons (+/-/reset)
  - Implemented mouse wheel and touch gesture support for zooming
  - Added drag-to-pan functionality
  - Added double-click to zoom in on nodes

- **Enhanced Entity Navigation**:
  - Clicking an entity in the sidebar highlights and centers it in the graph
  - Clicking a relationship in the details panel navigates to the related entity
  - Added automatic centering of selected entities in the visualization

### 3. Improved Entity Display

- **Card-like Layout**:
  - Organized entity details into visually distinct sections
  - Added better spacing and visual hierarchy
  - Improved relationship display with clearer connection information

- **Relationship Attributes**:
  - Added display of relationship attributes in the details view
  - Enhanced formatting of relationship metadata

### 4. Additional Features

- **Name/Title Fallback**:
  - Added support for using `title` attribute as a fallback when `name` is not available
  - Improved handling of entities without name or title attributes

- **Clear Filters Button**:
  - Added a convenient button to reset all filters at once
  - Improves usability when exploring large datasets

- **Theme Enhancements**:
  - Improved styling for existing themes (default, dark, light, academic, ocean)
  - Better theme-specific adjustments for controls and UI elements

## Implementation Details

- The `toHTMLWebsite()` method in `UltraLink` class was updated to include the new features
- All improvements maintain backward compatibility with existing code
- Comprehensive tests were added in `tests/integration/html-website-features.test.js`
- Updated troubleshooting documentation in `docs/troubleshooting/html-website-export.md`

## Benefits

- **Better User Experience**: More intuitive navigation and interaction
- **Enhanced Accessibility**: Improved readability and device compatibility
- **Richer Data Exploration**: More context and easier navigation between related entities
- **More Professional Appearance**: Polished styling with modern UI conventions

## Example Usage

```javascript
// Generate an interactive HTML website with the new features
const htmlFiles = ultralink.toHTMLWebsite({
  title: 'My UltraLink Visualization',
  description: 'Interactive visualization of my data',
  theme: 'dark' // One of: 'default', 'dark', 'light', 'academic', 'ocean'
});

// Save the generated files
Object.entries(htmlFiles).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(outputDir, filename), content);
});
``` 
# HTML Website Export Troubleshooting

## Overview

The HTML Website export feature in UltraLink generates interactive web applications for visualizing and exploring UltraLink datasets. This document covers common issues and solutions related to HTML website generation.

## JSON Data Parsing

### JSON String vs. Object Issue

**Problem**: In versions before March 2025, a common issue with HTML Website exports was that the JSON data in the `index.html` file was not properly parsed. The data was included as a string literal instead of a JavaScript object, causing the D3.js visualization to fail.

**Symptoms**:
- The entity list in the sidebar is empty
- No visualization appears in the main content area
- The network graph isn't rendered
- Console errors about accessing properties of undefined

**Cause**: The UltraLink `toHTMLWebsite()` method was embedding the JSON data as a string without parsing it:

```javascript
// INCORRECT (old implementation)
const data = ${JSON.stringify(this.toJSON(), null, 2)};

// This resulted in HTML like:
const data = "{\"entities\":[{...}]}"; // String, not an object
```

**Solution**: The issue was fixed by parsing the JSON string before stringifying it for the template:

```javascript
// CORRECT (fixed implementation)
const data = ${JSON.stringify(JSON.parse(this.toJSON()))};

// This results in HTML like:
const data = {"entities":[{...}]}; // Actual JavaScript object
```

### Verifying Proper JSON Parsing

To verify that your HTML Website export is correctly handling JSON data:

1. Open the generated `index.html` file
2. Look for the `const data =` line in the `<script>` section
3. Check if the data is defined as a JavaScript object (no quotes around the opening curly brace)
4. Correct format: `const data = {"entities":[...]}` (no quotes)
5. Incorrect format: `const data = "{\"entities\":[...]}"`

## Entity Name Display Issues

### Unnamed Project Entities

**Problem**: Project entities may appear as "unnamed" in the entity list and details.

**Cause**: Project entities often use a `title` attribute instead of `name`, but the HTML Website template specifically looks for the `name` attribute.

**Solution**: Either:

1. Add a `name` attribute to your project entities:
   ```javascript
   ultralink.addEntity('project1', 'project', {
     name: 'My Project',  // Add this line
     title: 'My Project',
     // other attributes...
   });
   ```

2. Use the built-in title fallback (available in version 2.1.0+):
   ```javascript
   // The code now checks for name OR title as a fallback
   const name = entity.attributes.name || entity.attributes.title || entity.id;
   ```

## Interactive Features

### Zoom and Pan Navigation

The HTML website now includes zoom and pan controls for easier navigation of complex graphs:

1. **Zoom buttons**: Located in the top-right corner of the visualization
   - `+` : Zoom in
   - `-` : Zoom out
   - `⟳` : Reset zoom and pan to default view

2. **Mouse/touch controls**:
   - **Zoom**: Mouse wheel or pinch gesture
   - **Pan**: Click and drag or touch and drag
   - **Double-click**: Zoom in on a specific area
   - **Double-click on background**: Reset view

3. **Node centering**: When selecting a node, the view automatically centers on that node

### Filter and Search Controls

The sidebar includes improved filtering and search features:

1. **Entity type filtering**: Check/uncheck entity types to show/hide them
2. **Search box**: Filter entities by name or title
3. **Clear filters button**: Reset all filters with one click

## Responsive Design

The HTML website now supports responsive design for better viewing on various devices:

1. **Mobile layout**: On smaller screens, the layout adjusts to stack the sidebar above the visualization
2. **Responsive SVG**: The graph visualization uses `viewBox` for proper scaling on all screen sizes
3. **Adaptive styling**: UI elements adjust their size and position based on available space

## Styling and Themes

### Enhanced Entity Details Display

Entity details are now displayed in a card-like format for better readability:

1. **Card layout**: Entity details are grouped in visually distinct sections
2. **Attribute formatting**: Improved table layout for attributes
3. **Interactive relationships**: Click on related entities to navigate the graph

### Custom Themes

The HTML Website export supports several built-in themes:
- default
- dark
- light
- academic
- ocean

To use a custom theme:

```javascript
const htmlFiles = ultralink.toHTMLWebsite({
  title: 'My UltraLink Dataset',
  description: 'Interactive visualization of my data',
  theme: 'academic' // One of: 'default', 'dark', 'light', 'academic', 'ocean'
});
```

## Visualization Layout Issues

### Nodes Overlap or Bunch Together

**Problem**: In large datasets, nodes may overlap or bunch together, making the visualization difficult to read.

**Solution**:
1. Adjust the force simulation parameters:
   ```javascript
   simulation
     .force('charge', d3.forceManyBody().strength(-200)) // Increase negative value
     .force('link', d3.forceLink().distance(100)) // Increase distance
   ```

2. Use the zoom controls to focus on specific areas of interest
3. Filter entities by type to reduce the number of displayed nodes

## Browser Compatibility

### SVG Rendering Differences

The D3.js visualization uses SVG, which may render differently across browsers.

**Best practices**:
1. Test in multiple browsers (Chrome, Firefox, Safari, Edge)
2. The responsive SVG implementation with viewBox helps ensure consistency
3. Avoid browser-specific features

## Performance Optimization

For large datasets, HTML Website exports may experience performance issues:

1. **Filter by type**: Use entity type filters to show only relevant nodes
2. **Use the search feature**: Narrow down to specific entities of interest
3. **Adjust simulation parameters**: Modify force strength and link distance
4. **Consider splitting large datasets**: Create separate views for different parts of your data

## Systems of Interest Exports

When exporting Systems of Interest (like Research Team or Desert Ecosystem), make sure that:

1. All entities have a `name` attribute where possible (though `title` will now work as a fallback)
2. Relationships are properly defined
3. The dataset has a reasonable size for interactive visualization 
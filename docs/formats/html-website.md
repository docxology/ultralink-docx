# HTML Website Export Format

The UltraLink HTML Website export format generates a self-contained, interactive web application for visualizing, exploring, and sharing UltraLink datasets.

## Overview

The HTML Website export is designed to provide an accessible, interactive way to explore UltraLink datasets without requiring specialized software. It creates a complete web application with interactive visualizations, search functionality, filtering, and detailed entity views.

## Use Cases

- **Data Presentation**: Share UltraLink data with stakeholders who don't have UltraLink installed
- **Interactive Documentation**: Create explorable documentation of complex systems
- **Public Knowledge Bases**: Publish knowledge graphs for public access
- **Data Exploration**: Visually explore relationships and connections in data
- **Embeddable Visualizations**: Embed visualizations in other websites or applications

## Output Structure

The HTML Website export generates a directory structure containing everything needed to serve a standalone website:

```
website/
├── index.html                # Main entry point
├── entities/                 # Individual entity pages
│   ├── entity-1.html         
│   ├── entity-2.html
│   └── ...
├── data/                     # Data files
│   ├── entities.json         # Entity data
│   └── links.json            # Relationship data
├── js/                       # JavaScript files
│   ├── main.js               # Main application logic
│   ├── d3.min.js             # D3.js visualization library
│   └── search.js             # Search functionality
└── css/                      # Stylesheets
    ├── main.css              # Main stylesheet
    └── themes/               # Theme files
        ├── light.css         # Light theme
        └── dark.css          # Dark theme
```

## Features

### Interactive Network Visualization

The HTML Website includes an interactive D3.js-powered network visualization that:
- Shows entities as nodes and relationships as edges
- Allows zooming and panning for exploration
- Supports node selection and highlighting
- Provides contextual information on hover
- Filters nodes and edges by type or attribute

### Entity Details

Each entity has its own dedicated page that includes:
- All entity attributes with formatted values
- Incoming and outgoing relationships
- Related entities with links
- Metadata and provenance information
- Custom visualizations specific to the entity type

### Search and Navigation

Users can search and navigate the dataset through:
- Full-text search across all entities and attributes
- Type-based filtering
- Alphabetical indexes
- Clickable relationship paths
- Breadcrumb navigation

### Responsive Design

The website is responsive and works across devices:
- Desktop-optimized visualization for large screens
- Mobile-friendly layout for small screens
- Touch support for tablets and touchscreens
- Accessible keyboard navigation

## Export Options

The HTML Website export can be customized with various options:

```javascript
const htmlWebsite = ultralink.toHTMLWebsite({
  // Basic options
  title: 'My UltraLink Dataset',
  description: 'Interactive exploration of my dataset',
  language: 'en',
  
  // Theming
  theme: 'light', // 'light', 'dark', or a custom theme name
  colors: {
    primary: '#4a6fa5',
    secondary: '#57a773',
    accent: '#ef8354',
    background: '#ffffff',
    text: '#333333'
  },
  
  // Visualization options
  visualization: {
    enabled: true,
    layout: 'force', // 'force', 'radial', 'hierarchical', etc.
    nodeSize: 'degree', // 'fixed', 'degree', 'centrality', etc.
    edgeWidth: 'weight', // 'fixed', 'weight', etc.
    physics: {
      gravitationalConstant: -50,
      springConstant: 0.08,
      springLength: 100
    }
  },
  
  // Content options
  includeAttributes: true,
  includeMetadata: true,
  includeTypes: ['all'], // or specific types to include
  excludeTypes: [], // types to exclude
  maxEntities: 1000, // limit for very large datasets
  
  // Advanced options
  scripts: [], // additional script files to include
  styles: [], // additional CSS files to include
  templates: {}, // custom HTML templates
  embedLibraries: true // include libraries in output (vs. CDN links)
});
```

## Generating the HTML Website

### Basic Export

```javascript
const { UltraLink } = require('ultralink');
const fs = require('fs');
const path = require('path');

// Create and populate UltraLink instance
const ultralink = new UltraLink();
// ... add entities and relationships ...

// Generate HTML Website
const htmlWebsite = ultralink.toHTMLWebsite({
  title: 'My Knowledge Base',
  description: 'Interactive exploration of my knowledge base'
});

// Save to disk
const outputDir = path.join(__dirname, 'output/website');
fs.mkdirSync(outputDir, { recursive: true });

Object.entries(htmlWebsite).forEach(([filename, content]) => {
  const filePath = path.join(outputDir, filename);
  
  // Create subdirectories if needed
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  
  // Write file
  fs.writeFileSync(filePath, content);
});

console.log(`HTML Website exported to ${outputDir}`);
```

### Custom Theme

```javascript
// Create a custom theme
const customTheme = {
  name: 'ocean',
  colors: {
    primary: '#0077cc',
    secondary: '#00bbad',
    accent: '#ff7700',
    background: '#f0f8ff',
    text: '#333333',
    nodeColors: {
      person: '#4a6fa5',
      document: '#57a773',
      concept: '#ef8354'
    }
  },
  fonts: {
    main: 'Roboto, sans-serif',
    headings: 'Montserrat, sans-serif',
    code: 'Fira Code, monospace'
  }
};

// Apply the custom theme
const htmlWebsite = ultralink.toHTMLWebsite({
  title: 'Ocean Themed Website',
  theme: customTheme
});
```

### Custom Visualization

```javascript
// Configure a hierarchical visualization
const htmlWebsite = ultralink.toHTMLWebsite({
  visualization: {
    layout: 'hierarchical',
    hierarchical: {
      direction: 'TB', // Top to Bottom
      sortMethod: 'directed',
      nodeSpacing: 150,
      levelSeparation: 200
    },
    interaction: {
      navigationButtons: true,
      keyboard: true,
      hover: true
    }
  }
});
```

## Serving the Website

The generated HTML Website can be served in several ways:

### Local Development Server

```bash
# Using Node.js http-server
npx http-server ./output/website -o

# Using Python
cd ./output/website
python -m http.server 8000
```

### Deployment Options

- **Static Hosting**: Upload to services like GitHub Pages, Netlify, Vercel, etc.
- **Server Integration**: Serve from Node.js, Apache, Nginx, etc.
- **Desktop Application**: Package with Electron for desktop distribution
- **Offline Distribution**: Zip the files for offline sharing

## Customization

### Custom Templates

```javascript
// Define custom templates
const customTemplates = {
  entityPage: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>{{title}} - {{entity.id}}</title>
      <link rel="stylesheet" href="../css/main.css">
    </head>
    <body class="entity-page">
      <header>
        <nav>{{> navigation}}</nav>
      </header>
      <main>
        <h1>{{entity.attributes.name}}</h1>
        <div class="entity-details">
          {{#each entity.attributes}}
            <div class="attribute">
              <strong>{{@key}}:</strong> {{this}}
            </div>
          {{/each}}
        </div>
        <div class="relationships">
          <h2>Relationships</h2>
          {{> relationshipsList}}
        </div>
      </main>
      <footer>
        {{> footer}}
      </footer>
      <script src="../js/main.js"></script>
    </body>
    </html>
  `,
  // Other templates...
};

// Apply custom templates
const htmlWebsite = ultralink.toHTMLWebsite({
  templates: customTemplates
});
```

### Custom Scripts

```javascript
// Add custom analytics and interaction scripts
const htmlWebsite = ultralink.toHTMLWebsite({
  scripts: [
    { src: 'https://cdn.example.com/analytics.js', async: true },
    { content: `
      // Custom interaction code
      document.addEventListener('DOMContentLoaded', () => {
        // Initialize custom interactions
        initCustomFeatures();
      });
      
      function initCustomFeatures() {
        // Custom code here
      }
    `}
  ]
});
```

## Browser Compatibility

The HTML Website export is compatible with modern browsers:

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 60+ | Full support for all features |
| Firefox | 60+ | Full support for all features |
| Safari | 12+ | May have minor visualization differences |
| Edge | 79+ (Chromium-based) | Full support for all features |
| IE | Not supported | Legacy browsers not supported |

## Accessibility

The HTML Website implements several accessibility features:

- Semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast
- Responsive text sizing
- Focus indicators

## Performance Considerations

For large datasets:

- Consider limiting the number of entities displayed in visualizations
- Use the `maxEntities` option to limit very large datasets
- Enable progressive loading for smoother user experience
- Consider disabling complex visualizations for extremely large datasets
- Use the `optimize` option to apply automatic performance optimizations

```javascript
// Optimize for large datasets
const htmlWebsite = ultralink.toHTMLWebsite({
  maxEntities: 1000,
  optimize: true,
  progressiveLoading: true,
  visualization: {
    simplifyThreshold: 500, // Simplify visualization when more than 500 nodes
    enableWebGL: true // Use WebGL rendering for better performance
  }
});
```

## Security Considerations

When serving HTML Website exports publicly:

- The export is static and does not include server-side code
- External scripts are disabled by default
- User input is sanitized to prevent XSS attacks
- Content Security Policy (CSP) headers are recommended when serving
- Data is embedded in the export by default (could include sensitive information)

To enhance security:

```javascript
// Enhance security
const htmlWebsite = ultralink.toHTMLWebsite({
  security: {
    sanitizeData: true, // Remove potentially sensitive data
    contentSecurityPolicy: true, // Generate CSP meta tags
    noExternalResources: true // Don't use external CDNs
  }
});
```

## Related Resources

- [HTML Website API Reference](../api/html-website.md)
- [Visualization Guide](../guides/visualization.md)
- [Customization Options](../advanced/customization.md)
- [D3.js Documentation](https://d3js.org/) 
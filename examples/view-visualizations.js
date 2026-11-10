const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Escape text placed into HTML (file and directory names come from disk).
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function viewLink(system, file, type, label) {
  const href = `/view?file=${encodeURIComponent(`${system}/visualization/${file}`)}&type=${type}`;
  return `<li><a href="${escapeHtml(href)}">${label}: ${escapeHtml(file)}</a></li>`;
}

// Create basic HTTP server
const server = http.createServer((req, res) => {
  // Parse URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Handle root path - show list of available visualizations
  if (pathname === '/') {
    const systemsDir = path.join(__dirname, 'output', 'systems');
    let html = '<html><head><title>Visualization Viewer</title>';
    html += '<style>body { font-family: Arial, sans-serif; margin: 20px; } ';
    html += 'h1 { color: #2c3e50; } ';
    html += '.system { margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 5px; } ';
    html += 'h2 { color: #3498db; margin-top: 0; } ';
    html += 'ul { list-style-type: none; padding: 0; } ';
    html += 'li { margin: 8px 0; } ';
    html += 'a { color: #2980b9; text-decoration: none; } ';
    html += 'a:hover { text-decoration: underline; } ';
    html += '</style></head><body>';
    html += '<h1>UltraLink Visualization Viewer</h1>';
    
    // List all systems
    const systems = fs.readdirSync(systemsDir);
    systems.forEach(system => {
      const vizDir = path.join(systemsDir, system, 'visualization');
      if (fs.existsSync(vizDir)) {
        html += `<div class="system">`;
        html += `<h2>${escapeHtml(system)}</h2>`;
        html += `<ul>`;
        
        // List visualizations for this system
        const files = fs.readdirSync(vizDir);
        files.forEach(file => {
          if (file.endsWith('.d3.js')) {
            html += viewLink(system, file, 'd3', 'View D3 Visualization');
          } else if (file.endsWith('.cytoscape.js')) {
            html += viewLink(system, file, 'cytoscape', 'View Cytoscape Visualization');
          }
        });
        
        html += `</ul></div>`;
      }
    });
    
    html += '</body></html>';
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }
  
  // Handle viewing a specific visualization
  if (pathname === '/view') {
    const { file, type } = parsedUrl.query;
    if (!file) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing file parameter');
      return;
    }
    
    // Ensure the file path is safe (prevent directory traversal)
    const systemsRoot = path.join(__dirname, 'output', 'systems');
    const filePath = path.resolve(systemsRoot, String(file));
    if (!filePath.startsWith(systemsRoot + path.sep)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid file parameter');
      return;
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Visualization file not found');
      return;
    }
    
    // Read and serve the file as HTML
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading visualization file');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
    return;
  }
  
  // Handle 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Page not found');
});

// Start server
const PORT = 3000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Visualization server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
}); 

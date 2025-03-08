<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Cytoscape.js Visualization</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.23.0/cytoscape.min.js"></script>
  <style>
    html, body { margin: 0; height: 100%; overflow: hidden; }
    #cy { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="cy"></div>
  <script>
    const cy = cytoscape({
      container: document.getElementById('cy'),
      elements: {"nodes":[],"edges":[]},
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#95A5A6',
            'label': 'data(label)'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#ccc'
          }
        }
      ]
    });
  </script>
</body>
</html>
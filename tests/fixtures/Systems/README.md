# UltraLink Systems of Interest

This directory contains various Systems of Interest that are used to test UltraLink's capabilities across different domains and scenarios. Each system demonstrates a distinct use case and helps verify that UltraLink can correctly model, render, and analyze diverse types of relational data.

## Directory Structure

Each system is contained in its own subdirectory:

```
Systems/
├── DesertEcosystem/    # Desert ecosystem with animals, plants, and abiotic factors
├── ResearchTeam/       # Research team with members, projects, and publications
└── [YourSystem]/       # Add your own systems here
```

## Included Systems

### Desert Ecosystem

A representation of a desert ecosystem, including:
- Desert animals with their adaptations and behaviors
- Desert plants and their survival mechanisms
- Abiotic factors (temperature, water sources, geological features)
- Relationships between organisms and their environment (predator-prey, adaptations, habitats)

### Research Team

A model of an academic research team, including:
- Team members with roles and expertise
- Research projects and their timelines
- Publications and citation networks
- Equipment and resources
- Knowledge domains and research areas

## Adding New Systems

To add a new System of Interest:

1. Create a new directory under `Systems/` with a descriptive name
2. Create a JavaScript module that exports:
   - A function `createXXXDataset()` that returns a populated UltraLink instance
   - Optionally, a function `createXXXSubset(subset)` that returns a subset of the data

Example structure for a new system:

```javascript
/**
 * YourSystem Test Fixtures
 * 
 * Description of what this system models...
 */

const { UltraLink } = require('../../../../src');

/**
 * Create a complete YourSystem dataset
 * @returns {UltraLink} Populated UltraLink instance
 */
function createYourSystemDataset() {
  const ultralink = new UltraLink({
    // Configuration...
  });
  
  // Define entity and relationship types
  
  // Create entities
  
  // Create relationships
  
  return ultralink;
}

/**
 * Create a subset of the YourSystem dataset
 * @param {string} subset - The subset to create
 * @returns {UltraLink} Populated UltraLink instance with a subset of the data
 */
function createYourSystemSubset(subset) {
  // Create a subset...
}

module.exports = {
  createYourSystemDataset,
  createYourSystemSubset
};
```

3. Update the `createSystem()` function in `tests/runners/all-systems-render-test.js` to include your new system:

```javascript
async function createSystem(systemName) {
  switch(systemName) {
    case 'DesertEcosystem':
      return createDesertEcosystemDataset();
    case 'ResearchTeam':
      return createResearchTeamDataset();
    case 'YourSystem':
      return createYourSystemDataset();
    default:
      throw new Error(`Unknown system: ${systemName}`);
  }
}
```

## Running Tests

To run tests for all systems:

```bash
npm run test:systems
```

The test runner will:
1. Discover all systems in this directory
2. Create instances of each system
3. Render each system in all supported formats (JSON, GraphML, CSV, Obsidian)
4. Validate the outputs to ensure they meet the expected format
5. Generate a comprehensive report of the results

Output files will be saved to `output/systems/` and logs to `logs/systems/`. 
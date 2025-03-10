/**
 * UltraLink Integrity Checking Example
 * 
 * This example demonstrates how to use the integrity checking functionality.
 */

const { UltraLink } = require('../src');

// Create a new UltraLink instance
const ultralink = new UltraLink();

// Create some valid entities
ultralink.addEntity('Alan Turing', 'person', {
  name: 'Alan Turing',
  birthDate: 'June 23, 1912',
  nationality: 'British',
  occupation: 'Mathematician'
});

ultralink.addEntity('Cambridge', 'institution', {
  name: 'University of Cambridge',
  location: 'Cambridge, UK',
  founded: 1209
});

ultralink.addEntity('Princeton', 'institution', {
  name: 'Princeton University',
  location: 'Princeton, New Jersey, USA',
  founded: 1746
});

// Create valid relationships
ultralink.addLink('Alan Turing', 'Cambridge', 'studied_at', {
  years: '1931-1934',
  degree: 'Bachelor of Arts in Mathematics'
});

ultralink.addLink('Alan Turing', 'Princeton', 'studied_at', {
  years: '1936-1938',
  degree: 'PhD in Mathematics'
});

// Run integrity checks
console.log('Running basic integrity checks...');
const basicCheckResults = ultralink.checkIntegrity();
console.log(`Basic integrity checks passed: ${basicCheckResults.passed}`);
console.log(`Issues found: ${basicCheckResults.issues.length}`);
console.log(basicCheckResults.issues);

// Now let's create an invalid relationship (referring to a non-existent entity)
try {
  console.log('\nAttempting to create an invalid relationship...');
  ultralink.addLink('Alan Turing', 'Oxford', 'visited');
} catch (error) {
  console.log(`Error: ${error.message}`);
}

// Let's create a relationship with validation rules
console.log('\nCreating entities with validation rules...');
const schema = {
  person: {
    required: ['name', 'birthDate'],
    optional: ['deathDate', 'nationality', 'occupation', 'bio']
  },
  publication: {
    required: ['title', 'year'],
    optional: ['journal', 'authors', 'abstract']
  }
};

const ultralink2 = new UltraLink({ schema });

// This should pass validation
ultralink2.addEntity('Alan Turing', 'person', {
  name: 'Alan Turing',
  birthDate: 'June 23, 1912'
});

// This should print a validation warning for missing required property 'year'
try {
  ultralink2.addEntity('Computing Machinery and Intelligence', 'publication', {
    title: 'Computing Machinery and Intelligence',
    journal: 'Mind'
  });
} catch (error) {
  console.log(`Validation error: ${error.message}`);
}

// Running more advanced integrity checks
console.log('\nRunning advanced integrity checks...');
const advancedCheckResults = ultralink.checkIntegrity({
  checkForOrphans: true,
  validateRelationships: true,
  validateSchemas: true,
  repairAutomatically: false
});

console.log(`Advanced integrity checks passed: ${advancedCheckResults.passed}`);
console.log(`Issues found: ${advancedCheckResults.issues.length}`);
console.log(advancedCheckResults.issues);

// Now let's repair any issues
if (advancedCheckResults.issues.length > 0) {
  console.log('\nAttempting to repair issues...');
  const repairResults = ultralink.repairIntegrityIssues(advancedCheckResults.issues);
  console.log(`Repairs attempted: ${repairResults.attempted}`);
  console.log(`Repairs succeeded: ${repairResults.succeeded}`);
  console.log(`Repairs failed: ${repairResults.failed}`);
}

// Final integrity check after repairs
console.log('\nFinal integrity check after repairs...');
const finalCheckResults = ultralink.checkIntegrity();
console.log(`Final integrity checks passed: ${finalCheckResults.passed}`);
console.log(`Remaining issues: ${finalCheckResults.issues.length}`); 
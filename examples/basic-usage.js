/**
 * UltraLink Basic Usage Example
 * 
 * This example demonstrates the basic functionality of the UltraLink system.
 */

const { UltraLink } = require('../src');

// Create a new UltraLink instance
const ultralink = new UltraLink();

// Create some entities
const alanTuring = ultralink.createEntity('person', 'Alan Turing', {
  name: 'Alan Turing',
  birthDate: 'June 23, 1912',
  deathDate: 'June 7, 1954',
  nationality: 'British',
  occupation: 'Mathematician, computer scientist, logician, cryptanalyst',
  bio: 'Alan Mathison Turing OBE FRS was an English mathematician, computer scientist, logician, cryptanalyst, philosopher, and theoretical biologist. Turing was highly influential in the development of theoretical computer science, providing a formalization of the concepts of algorithm and computation with the Turing machine, which can be considered a model of a general-purpose computer. Turing is widely considered to be the father of theoretical computer science and artificial intelligence.'
});

const cambridge = ultralink.createEntity('place', 'Cambridge', {
  name: 'Cambridge',
  location: 'East of England',
  country: 'United Kingdom',
  population: '124,000',
  description: 'Cambridge is a university city and the county town of Cambridgeshire, England, on the River Cam approximately 55 miles (89 km) north of London.'
});

const computingMachine = ultralink.createEntity('concept', 'Computing Machine', {
  name: 'Computing Machine',
  field: 'Computer Science',
  definition: 'A device that manipulates data according to a set of instructions.',
  description: 'The concept of a computing machine was formalized by Alan Turing with his theoretical Turing machine, which remains a central object of study in theory of computation.'
});

// Add links between entities
ultralink.createLink('Alan Turing', 'Cambridge', 'studied_at', { years: '1931-1934' });
ultralink.createLink('Alan Turing', 'Computing Machine', 'pioneered');
ultralink.createLink('Computing Machine', 'Alan Turing', 'pioneered_by');

// Parse a text document with Obsidian-style links
const documentContent = `
# The Birth of Computer Science

[[Alan Turing]] is widely regarded as the father of theoretical computer science.
During his time at [[Cambridge]], he developed foundational concepts of computation.
His work on the [[Computing Machine]] laid the groundwork for modern computers.

Other notable figures include [[John von Neumann]] and [[Claude Shannon]].
`;

// Parse the document
ultralink.parse(documentContent, 'The Birth of Computer Science');

// Export entities to Obsidian format
const obsidianOutput = ultralink.exportAll('obsidian');

// Print the exported content for one entity
console.log('=== ALAN TURING (OBSIDIAN FORMAT) ===');
console.log(obsidianOutput['Alan Turing']);

console.log('\n=== COMPUTING MACHINE (OBSIDIAN FORMAT) ===');
console.log(obsidianOutput['Computing Machine']);

console.log('\n=== THE BIRTH OF COMPUTER SCIENCE (OBSIDIAN FORMAT) ===');
console.log(obsidianOutput['The Birth of Computer Science']);

// Using custom formatters
console.log('\n=== ALAN TURING (TEMPLATE FORMAT) ===');
console.log(ultralink.formatEntity('Alan Turing'));

// Add a custom parser for a different link format
ultralink.addCustomParser(/@([a-zA-Z0-9_]+)/g, (match) => ({
  target: match[1],
  type: 'mention',
  metadata: { format: 'at-mention' }
}));

// Parse content with the custom format
const socialContent = `
Check out @AlanTuring's pioneering work on computation.
Also worth reading: @JohnVonNeumann and @ClaudeShannon.
`;

ultralink.parse(socialContent, 'Social Post');

console.log('\n=== SOCIAL POST (OBSIDIAN FORMAT) ===');
console.log(obsidianOutput['Social Post']);

// Get all links of a specific type
const studiedAtLinks = Object.entries(ultralink.store.entities).reduce((acc, [id, entity]) => {
  const relevantLinks = entity.links.filter(link => link.type === 'studied_at');
  if (relevantLinks.length > 0) {
    acc[id] = relevantLinks;
  }
  return acc;
}, {});

console.log('\n=== STUDIED AT RELATIONSHIPS ===');
console.log(JSON.stringify(studiedAtLinks, null, 2)); 
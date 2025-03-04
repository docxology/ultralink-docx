/**
 * Research Team Integration Tests
 * 
 * Tests to verify UltraLink can handle complex research team dataset
 */

const { UltraLink } = require('../../src');
const { createResearchTeamDataset, createResearchTeamSubset } = require('../fixtures/research-team');

describe('Research Team Integration Tests', () => {
  let ultralink;

  beforeEach(() => {
    ultralink = createResearchTeamDataset();
  });

  test('should correctly identify all researchers', () => {
    const researchers = ultralink.findEntitiesByType('person');
    expect(researchers.length).toBe(6);
    expect(researchers.map(r => r.attributes.name)).toContain('Alice Chen');
    expect(researchers.map(r => r.attributes.name)).toContain('Bob Smith');
  });

  test('should find entities by attribute value', () => {
    const activeEntities = ultralink.findEntitiesByAttribute('status', 'active');
    expect(activeEntities.length).toBeGreaterThan(0);
    expect(activeEntities.every(e => e.attributes.status === 'active')).toBe(true);
  });

  test('should identify all project leads', () => {
    const leads = ultralink.findRelationships('leads');
    expect(leads.length).toBe(2);
    expect(leads.map(l => l.source)).toContain('alice-chen');
    expect(leads.map(l => l.source)).toContain('bob-smith');
  });

  test('should find all mentorship relationships', () => {
    const mentorships = ultralink.findRelationships('mentors');
    expect(mentorships.length).toBe(2);
    expect(mentorships.some(m => 
      m.source === 'alice-chen' && m.target === 'carol-jones'
    )).toBe(true);
  });

  test('should identify equipment usage', () => {
    const equipmentUsage = ultralink.findRelationships('uses');
    expect(equipmentUsage.length).toBe(4);
    expect(equipmentUsage.some(u => 
      u.source === 'computer-vision-project' && u.target === 'gpu-cluster'
    )).toBe(true);
  });

  test('should find all publications by author', () => {
    const alicePublications = ultralink.findRelationships('authored', 'alice-chen');
    expect(alicePublications.length).toBe(1);
    expect(alicePublications[0].target).toBe('vision-paper-2022');
  });

  test('should identify knowledge area expertise', () => {
    const expertise = ultralink.findRelationships('has_expertise_in');
    expect(expertise.length).toBe(7);
    expect(expertise.filter(e => e.source === 'alice-chen').length).toBe(2);
  });

  test('should find project focus areas', () => {
    const focusAreas = ultralink.findRelationships('focuses_on');
    expect(focusAreas.length).toBe(3);
    expect(focusAreas.some(f => 
      f.source === 'computer-vision-project' && f.target === 'computer-vision'
    )).toBe(true);
  });

  test('should create valid subset of people data', () => {
    const peopleSubset = ultralink.createSubset('people');
    expect(peopleSubset.entities.size).toBe(6);
    expect(peopleSubset.links.size).toBe(0);
  });

  test('should create valid subset of project data', () => {
    const projectSubset = ultralink.createSubset('projects');
    expect(projectSubset.entities.size).toBe(9); // 3 projects + 6 people
    expect(projectSubset.links.size).toBeGreaterThan(0);
  });

  test('should create valid subset of publication data', () => {
    const pubSubset = ultralink.createSubset('publications');
    expect(pubSubset.entities.size).toBe(8); // 2 publications + 6 people
    expect(pubSubset.links.size).toBeGreaterThan(0);
  });

  test('should handle invalid subset type', () => {
    expect(() => {
      ultralink.createSubset('invalid');
    }).toThrow('Unknown aspect: invalid');
  });
}); 
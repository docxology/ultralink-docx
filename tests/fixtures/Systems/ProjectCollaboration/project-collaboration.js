/**
 * Project Collaboration System Test Fixtures
 * 
 * This module provides test data for a project collaboration system.
 * The dataset demonstrates UltraLink's capabilities for modeling project management and collaboration.
 */

const { UltraLink } = require('../../../../src');

/**
 * Creates a Project Collaboration dataset modeling team collaboration components
 * @returns {UltraLink} Populated UltraLink instance
 */
function createProjectCollaborationDataset() {
  // Create a new UltraLink instance
  const ultralink = new UltraLink();
  
  // Add core entities
  ultralink.addEntity('project', 'container', {
    name: 'Sample Project',
    description: 'A sample project for testing',
    start_date: '2025-01-01',
    end_date: '2025-12-31',
    status: 'active'
  });
  
  // Add team members
  ultralink.addEntity('emilie', 'person', {
    name: 'Emilie Johnson',
    role: 'Project Manager',
    email: 'emilie@example.com'
  });
  
  ultralink.addEntity('sam', 'person', {
    name: 'Sam Wilson',
    role: 'Developer',
    email: 'sam@example.com'
  });
  
  ultralink.addEntity('peter', 'person', {
    name: 'Peter Brown',
    role: 'Designer',
    email: 'peter@example.com'
  });
  
  ultralink.addEntity('team_member_1', 'person', {
    name: 'Alice Smith',
    role: 'Project Manager',
    email: 'alice@example.com'
  });
  
  ultralink.addEntity('team_member_2', 'person', {
    name: 'Bob Johnson',
    role: 'Developer',
    email: 'bob@example.com'
  });
  
  ultralink.addEntity('team_member_3', 'person', {
    name: 'Carol Davis',
    role: 'Designer',
    email: 'carol@example.com'
  });
  
  // Add tasks
  ultralink.addEntity('task_1', 'task', {
    name: 'Project Planning',
    description: 'Create project plan and timeline',
    status: 'completed',
    priority: 'high',
    due_date: '2025-01-15'
  });
  
  ultralink.addEntity('task_2', 'task', {
    name: 'Design Mockups',
    description: 'Create design mockups for the application',
    status: 'in_progress',
    priority: 'medium',
    due_date: '2025-02-28'
  });
  
  ultralink.addEntity('task_3', 'task', {
    name: 'Backend Development',
    description: 'Develop backend services',
    status: 'not_started',
    priority: 'high',
    due_date: '2025-04-30'
  });
  
  // Add documents
  ultralink.addEntity('document_1', 'document', {
    name: 'Project Specification',
    description: 'Detailed project specifications',
    version: '1.2',
    last_updated: '2025-01-10'
  });
  
  ultralink.addEntity('document_2', 'document', {
    name: 'Design Guidelines',
    description: 'UI/UX design guidelines',
    version: '1.0',
    last_updated: '2025-02-15'
  });
  
  // Add relationships
  ultralink.addRelationship('project', 'emilie', 'has_member');
  ultralink.addRelationship('project', 'sam', 'has_member');
  ultralink.addRelationship('project', 'peter', 'has_member');
  
  ultralink.addRelationship('project', 'team_member_1', 'has_member');
  ultralink.addRelationship('project', 'team_member_2', 'has_member');
  ultralink.addRelationship('project', 'team_member_3', 'has_member');
  
  ultralink.addRelationship('project', 'task_1', 'contains');
  ultralink.addRelationship('project', 'task_2', 'contains');
  ultralink.addRelationship('project', 'task_3', 'contains');
  
  ultralink.addRelationship('project', 'document_1', 'contains');
  ultralink.addRelationship('project', 'document_2', 'contains');
  
  ultralink.addRelationship('team_member_1', 'task_1', 'assigned_to');
  ultralink.addRelationship('team_member_3', 'task_2', 'assigned_to');
  ultralink.addRelationship('team_member_2', 'task_3', 'assigned_to');
  
  ultralink.addRelationship('team_member_1', 'document_1', 'created');
  ultralink.addRelationship('team_member_3', 'document_2', 'created');
  
  ultralink.addRelationship('task_2', 'task_1', 'depends_on');
  ultralink.addRelationship('task_3', 'task_2', 'depends_on');
  
  return ultralink;
}

module.exports = {
  createProjectCollaborationDataset
}; 
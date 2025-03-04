/**
 * USA History Test Fixtures
 * 
 * This module provides test data for the History of the United States, demonstrating
 * UltraLink's powerful temporal analysis and vector embedding capabilities.
 * The dataset showcases:
 * - Historical events across different time periods
 * - Key historical figures and their connections
 * - Political, social, and economic developments
 * - Geographic elements and their changes over time
 * - Semantic relationships between historical concepts
 * - Temporal analysis of evolving themes and ideologies
 */

const { UltraLink } = require('../../../../src');

/**
 * Creates a USA History dataset showcasing temporal and vector capabilities
 * @returns {UltraLink} Populated UltraLink instance with temporal and vector features
 */
function createUSAHistoryDataset() {
  // Initialize UltraLink 
  const ultralink = new UltraLink();
  
  // ===== PERIODS =====
  // Define major historical periods for temporal grouping
  ultralink.addEntity('colonial-period', 'time_period', {
    name: 'Colonial Period',
    startYear: 1607,
    endYear: 1776,
    description: 'Period of American colonization by European powers, primarily Great Britain'
  });
  
  ultralink.addEntity('revolutionary-war', 'time_period', {
    name: 'American Revolution',
    startYear: 1775,
    endYear: 1783,
    description: 'War for independence from Great Britain'
  });
  
  ultralink.addEntity('early-republic', 'time_period', {
    name: 'Early Republic',
    startYear: 1783,
    endYear: 1815,
    description: 'Formation and early development of the United States government'
  });
  
  ultralink.addEntity('antebellum', 'time_period', {
    name: 'Antebellum Era',
    startYear: 1815,
    endYear: 1861,
    description: 'Period of growth and division leading to the Civil War'
  });
  
  ultralink.addEntity('civil-war', 'time_period', {
    name: 'Civil War',
    startYear: 1861,
    endYear: 1865,
    description: 'War between the Union and Confederate states'
  });
  
  ultralink.addEntity('reconstruction', 'time_period', {
    name: 'Reconstruction',
    startYear: 1865,
    endYear: 1877,
    description: 'Post-Civil War rebuilding and integration of Southern states'
  });
  
  ultralink.addEntity('gilded-age', 'time_period', {
    name: 'Gilded Age',
    startYear: 1877,
    endYear: 1900,
    description: 'Era of rapid economic growth, industrialization, and wealth inequality'
  });
  
  ultralink.addEntity('progressive-era', 'time_period', {
    name: 'Progressive Era',
    startYear: 1900,
    endYear: 1920,
    description: 'Period of social activism and political reform'
  });
  
  ultralink.addEntity('roaring-twenties', 'time_period', {
    name: 'Roaring Twenties',
    startYear: 1920,
    endYear: 1929,
    description: 'Period of economic prosperity and cultural dynamism'
  });
  
  ultralink.addEntity('great-depression', 'time_period', {
    name: 'Great Depression',
    startYear: 1929,
    endYear: 1941,
    description: 'Severe economic downturn causing high unemployment and economic hardship'
  });
  
  ultralink.addEntity('world-war-2', 'time_period', {
    name: 'World War II',
    startYear: 1941,
    endYear: 1945,
    description: 'American involvement in the global conflict'
  });
  
  ultralink.addEntity('cold-war', 'time_period', {
    name: 'Cold War',
    startYear: 1945,
    endYear: 1991,
    description: 'Geopolitical tension between the United States and Soviet Union'
  });
  
  ultralink.addEntity('civil-rights', 'time_period', {
    name: 'Civil Rights Movement',
    startYear: 1954,
    endYear: 1968,
    description: 'Movement for racial equality and ending discrimination'
  });
  
  ultralink.addEntity('modern-era', 'time_period', {
    name: 'Modern Era',
    startYear: 1991,
    endYear: 2023,
    description: 'Post-Cold War period to present day'
  });

  // ===== HISTORICAL EVENTS =====
  // Colonial Period
  ultralink.addEntity('jamestown-founding', 'event', {
    name: 'Founding of Jamestown',
    date: '1607-05-14',
    location: 'Virginia',
    description: 'First permanent English settlement in North America',
    significance: 'Established English presence in North America',
    vector: [-0.12, 0.35, 0.02, 0.41, -0.18, 0.22]  // Simplified vector for demo
  });
  
  ultralink.addEntity('plymouth-colony', 'event', {
    name: 'Plymouth Colony Established',
    date: '1620-12-21',
    location: 'Massachusetts',
    description: 'Pilgrims establish Plymouth Colony after arriving on the Mayflower',
    significance: 'Early religious settlement that shaped New England culture',
    vector: [-0.10, 0.32, 0.05, 0.40, -0.15, 0.25]  // Similar to Jamestown but with slight variations
  });
  
  ultralink.addEntity('declaration-independence', 'event', {
    name: 'Declaration of Independence',
    date: '1776-07-04',
    location: 'Philadelphia, Pennsylvania',
    description: 'Formal declaration of independence from Great Britain',
    significance: 'Foundational document establishing American independence',
    keywords: ['independence', 'liberty', 'revolution', 'rights'],
    vector: [0.45, 0.28, 0.34, 0.12, 0.22, -0.15]  // Represents freedom/rights concepts
  });
  
  ultralink.addEntity('constitutional-convention', 'event', {
    name: 'Constitutional Convention',
    date: '1787-05-25',
    endDate: '1787-09-17',
    location: 'Philadelphia, Pennsylvania',
    description: 'Convention to create a new constitution for the United States',
    significance: 'Created the United States Constitution',
    keywords: ['constitution', 'government', 'federalism', 'compromise'],
    vector: [0.42, 0.25, 0.38, 0.10, 0.24, -0.12]  // Similar to Declaration but with governance focus
  });
  
  ultralink.addEntity('louisiana-purchase', 'event', {
    name: 'Louisiana Purchase',
    date: '1803-04-30',
    location: 'Paris, France',
    description: 'Purchase of the Louisiana Territory from France',
    significance: 'Doubled the size of the United States',
    keywords: ['expansion', 'territory', 'Jefferson', 'Napoleon'],
    vector: [0.05, 0.42, -0.15, 0.28, 0.33, 0.22]  // Represents territorial expansion concepts
  });
  
  ultralink.addEntity('civil-war-start', 'event', {
    name: 'Civil War Begins',
    date: '1861-04-12',
    location: 'Fort Sumter, South Carolina',
    description: 'Confederate forces attack Fort Sumter, beginning the Civil War',
    significance: 'Started the bloodiest conflict in American history',
    keywords: ['war', 'slavery', 'secession', 'conflict'],
    vector: [-0.35, -0.22, -0.42, -0.18, -0.30, -0.25]  // Represents conflict concepts
  });
  
  ultralink.addEntity('emancipation-proclamation', 'event', {
    name: 'Emancipation Proclamation',
    date: '1863-01-01',
    location: 'Washington, D.C.',
    description: 'Lincoln declares slaves in Confederate states to be free',
    significance: 'Changed the character of the Civil War and began the process of ending slavery',
    keywords: ['slavery', 'freedom', 'Lincoln', 'abolition'],
    vector: [0.48, 0.30, 0.38, 0.15, 0.25, -0.10]  // Similar to Declaration but with freedom focus
  });
  
  ultralink.addEntity('civil-war-end', 'event', {
    name: 'Civil War Ends',
    date: '1865-04-09',
    location: 'Appomattox Court House, Virginia',
    description: 'General Lee surrenders to General Grant, effectively ending the Civil War',
    significance: 'Ended the Civil War and preserved the Union',
    keywords: ['surrender', 'war end', 'Lee', 'Grant', 'reconciliation'],
    vector: [0.10, 0.15, 0.20, 0.30, 0.25, 0.22]  // Represents resolution concepts
  });
  
  ultralink.addEntity('womens-suffrage', 'event', {
    name: '19th Amendment',
    date: '1920-08-18',
    location: 'United States',
    description: 'Constitutional amendment giving women the right to vote',
    significance: 'Major achievement for women\'s rights and democracy',
    keywords: ['women', 'voting', 'rights', 'suffrage', 'equality'],
    vector: [0.46, 0.32, 0.33, 0.14, 0.26, -0.12]  // Similar to other rights-based vectors
  });
  
  ultralink.addEntity('stock-market-crash', 'event', {
    name: 'Stock Market Crash',
    date: '1929-10-29',
    location: 'New York, New York',
    description: 'Stock market crashes, triggering the Great Depression',
    significance: 'Led to the worst economic crisis in American history',
    keywords: ['depression', 'economy', 'crash', 'financial', 'poverty'],
    vector: [-0.32, -0.18, -0.38, -0.25, -0.28, -0.20]  // Represents economic downturn
  });
  
  ultralink.addEntity('pearl-harbor', 'event', {
    name: 'Attack on Pearl Harbor',
    date: '1941-12-07',
    location: 'Pearl Harbor, Hawaii',
    description: 'Japanese forces attack the US Naval base at Pearl Harbor',
    significance: 'Brought the United States into World War II',
    keywords: ['war', 'Japan', 'attack', 'World War II', 'Roosevelt'],
    vector: [-0.38, -0.28, -0.42, -0.20, -0.32, -0.30]  // Similar to Civil War but more negative
  });
  
  ultralink.addEntity('mlk-speech', 'event', {
    name: 'I Have a Dream Speech',
    date: '1963-08-28',
    location: 'Washington, D.C.',
    description: 'Martin Luther King Jr. delivers his famous speech during the March on Washington',
    significance: 'Defining moment in the Civil Rights Movement',
    keywords: ['civil rights', 'equality', 'King', 'dream', 'racial justice'],
    vector: [0.50, 0.35, 0.40, 0.18, 0.28, -0.08]  // Strongest freedom/rights vector
  });
  
  ultralink.addEntity('moon-landing', 'event', {
    name: 'Moon Landing',
    date: '1969-07-20',
    location: 'Moon',
    description: 'NASA\'s Apollo 11 mission lands humans on the Moon',
    significance: 'Major achievement in space exploration and technology',
    keywords: ['space', 'NASA', 'Apollo', 'Armstrong', 'technology'],
    vector: [0.25, 0.45, 0.05, 0.38, 0.15, 0.42]  // Represents scientific achievement
  });
  
  ultralink.addEntity('september-11', 'event', {
    name: 'September 11 Attacks',
    date: '2001-09-11',
    location: 'New York, Washington D.C., Pennsylvania',
    description: 'Terrorist attacks using hijacked airplanes',
    significance: 'Deadliest terrorist attack in history, led to major changes in US foreign policy',
    keywords: ['terrorism', 'attack', 'security', 'war on terror', 'tragedy'],
    vector: [-0.42, -0.35, -0.48, -0.25, -0.38, -0.32]  // Most negative vector
  });
  
  ultralink.addEntity('obama-election', 'event', {
    name: 'Barack Obama Elected President',
    date: '2008-11-04',
    location: 'United States',
    description: 'Barack Obama elected as first African American president of the United States',
    significance: 'Historic milestone in American race relations and politics',
    keywords: ['election', 'Obama', 'presidency', 'African American', 'milestone'],
    vector: [0.42, 0.30, 0.35, 0.20, 0.28, 0.15]  // Positive leadership/milestone vector
  });

  // ===== HISTORICAL FIGURES =====
  ultralink.addEntity('washington', 'person', {
    name: 'George Washington',
    birth: '1732-02-22',
    death: '1799-12-14',
    role: 'Military leader, 1st President',
    significance: 'Led Continental Army, first US President, established presidential precedents',
    keywords: ['president', 'revolutionary war', 'founding father', 'Mount Vernon'],
    vector: [0.40, 0.32, 0.28, 0.25, 0.38, 0.22]  // Leadership vector
  });
  
  ultralink.addEntity('jefferson', 'person', {
    name: 'Thomas Jefferson',
    birth: '1743-04-13',
    death: '1826-07-04',
    role: 'Statesman, 3rd President',
    significance: 'Authored Declaration of Independence, expanded US territory, founded University of Virginia',
    keywords: ['declaration', 'president', 'founding father', 'Monticello', 'Louisiana Purchase'],
    vector: [0.38, 0.35, 0.32, 0.30, 0.25, 0.18]  // Intellectual leadership vector
  });
  
  ultralink.addEntity('lincoln', 'person', {
    name: 'Abraham Lincoln',
    birth: '1809-02-12',
    death: '1865-04-15',
    role: '16th President',
    significance: 'Preserved the Union during Civil War, emancipated slaves, modernized economy',
    keywords: ['civil war', 'emancipation', 'Gettysburg', 'assassination', 'union'],
    vector: [0.42, 0.36, 0.30, 0.28, 0.32, 0.15]  // Strong leadership in crisis vector
  });
  
  ultralink.addEntity('douglass', 'person', {
    name: 'Frederick Douglass',
    birth: '1818-02-01',
    death: '1895-02-20',
    role: 'Abolitionist, Writer',
    significance: 'Escaped slave who became leading abolitionist and advocate for equality',
    keywords: ['abolition', 'slavery', 'civil rights', 'orator', 'writer'],
    vector: [0.44, 0.36, 0.34, 0.25, 0.30, 0.12]  // Similar to rights vectors but with personal struggle element
  });
  
  ultralink.addEntity('roosevelt-fdr', 'person', {
    name: 'Franklin D. Roosevelt',
    birth: '1882-01-30',
    death: '1945-04-12',
    role: '32nd President',
    significance: 'Led US through Great Depression and most of World War II, established New Deal programs',
    keywords: ['New Deal', 'depression', 'World War II', 'polio', 'four terms'],
    vector: [0.40, 0.34, 0.30, 0.25, 0.35, 0.20]  // Leadership in crisis vector similar to Lincoln
  });
  
  ultralink.addEntity('mlk', 'person', {
    name: 'Martin Luther King Jr.',
    birth: '1929-01-15',
    death: '1968-04-04',
    role: 'Civil Rights Leader',
    significance: 'Led nonviolent civil rights movement, advocated for racial equality',
    keywords: ['civil rights', 'nonviolence', 'dream speech', 'equality', 'Nobel Peace Prize'],
    vector: [0.48, 0.38, 0.42, 0.30, 0.35, 0.15]  // Rights advocacy with moral leadership
  });

  // ===== CONCEPTS =====
  ultralink.addEntity('democracy', 'concept', {
    name: 'Democracy',
    description: 'System of government by the people, typically through elected representatives',
    keywords: ['voting', 'representation', 'elections', 'governance', 'people'],
    vector: [0.35, 0.30, 0.40, 0.25, 0.32, 0.22]  // Governance concept vector
  });
  
  ultralink.addEntity('slavery', 'concept', {
    name: 'Slavery',
    description: 'System of forced labor where people are owned as property',
    keywords: ['bondage', 'plantation', 'abolition', 'slaves', 'human property'],
    vector: [-0.40, -0.32, -0.45, -0.38, -0.42, -0.30]  // Strongly negative human rights violation vector
  });
  
  ultralink.addEntity('manifest-destiny', 'concept', {
    name: 'Manifest Destiny',
    description: 'Belief that American settlers were destined to expand across North America',
    keywords: ['expansion', 'westward', 'territory', 'settlement', 'imperialism'],
    vector: [0.10, 0.38, -0.05, 0.42, 0.25, 0.30]  // Territorial expansion vector
  });
  
  ultralink.addEntity('civil-rights-concept', 'concept', {
    name: 'Civil Rights',
    description: 'Rights to personal liberty and equality under the law',
    keywords: ['equality', 'rights', 'discrimination', 'freedom', 'justice'],
    vector: [0.46, 0.35, 0.42, 0.28, 0.32, 0.15]  // Rights-based concept vector
  });
  
  ultralink.addEntity('american-dream', 'concept', {
    name: 'American Dream',
    description: 'Belief that anyone can achieve success and prosperity through hard work',
    keywords: ['opportunity', 'success', 'prosperity', 'upward mobility', 'work ethic'],
    vector: [0.35, 0.42, 0.30, 0.25, 0.28, 0.38]  // Aspirational concept vector
  });

  // ===== DOCUMENTS =====
  ultralink.addEntity('declaration-doc', 'document', {
    name: 'Declaration of Independence',
    date: '1776-07-04',
    authors: ['Thomas Jefferson', 'Continental Congress'],
    description: 'Document declaring the thirteen American colonies as independent sovereign states',
    significance: 'Foundational document of the United States',
    keywords: ['independence', 'liberty', 'rights', 'revolution', 'Jefferson'],
    vector: [0.45, 0.30, 0.35, 0.15, 0.25, -0.10]  // Same as declaration event
  });
  
  ultralink.addEntity('constitution-doc', 'document', {
    name: 'United States Constitution',
    date: '1787-09-17',
    authors: ['Constitutional Convention Delegates'],
    description: 'Supreme law of the United States establishing the structure of the federal government',
    significance: 'Foundational legal document of the United States',
    keywords: ['government', 'law', 'rights', 'federalism', 'branches'],
    vector: [0.42, 0.28, 0.38, 0.12, 0.22, -0.08]  // Similar to constitutional convention
  });
  
  ultralink.addEntity('gettysburg-address', 'document', {
    name: 'Gettysburg Address',
    date: '1863-11-19',
    authors: ['Abraham Lincoln'],
    description: 'Speech given by President Lincoln during the Civil War',
    significance: 'Redefined the purpose of the Civil War and American democracy',
    keywords: ['civil war', 'liberty', 'democracy', 'equality', 'Lincoln'],
    vector: [0.44, 0.32, 0.36, 0.18, 0.28, -0.05]  // Combination of Lincoln and democracy vectors
  });

  // ===== RELATIONSHIPS =====
  // Link events to periods
  ultralink.addLink('jamestown-founding', 'colonial-period', 'occurred_during');
  ultralink.addLink('plymouth-colony', 'colonial-period', 'occurred_during');
  ultralink.addLink('declaration-independence', 'revolutionary-war', 'occurred_during');
  ultralink.addLink('constitutional-convention', 'early-republic', 'occurred_during');
  ultralink.addLink('louisiana-purchase', 'early-republic', 'occurred_during');
  ultralink.addLink('civil-war-start', 'civil-war', 'occurred_during');
  ultralink.addLink('emancipation-proclamation', 'civil-war', 'occurred_during');
  ultralink.addLink('civil-war-end', 'civil-war', 'occurred_during');
  ultralink.addLink('womens-suffrage', 'progressive-era', 'occurred_during');
  ultralink.addLink('stock-market-crash', 'great-depression', 'occurred_during');
  ultralink.addLink('pearl-harbor', 'world-war-2', 'occurred_during');
  ultralink.addLink('mlk-speech', 'civil-rights', 'occurred_during');
  ultralink.addLink('mlk-speech', 'cold-war', 'occurred_during');
  ultralink.addLink('moon-landing', 'cold-war', 'occurred_during');
  ultralink.addLink('september-11', 'modern-era', 'occurred_during');
  ultralink.addLink('obama-election', 'modern-era', 'occurred_during');
  
  // Link people to events
  ultralink.addLink('washington', 'declaration-independence', 'participated_in');
  ultralink.addLink('jefferson', 'declaration-independence', 'created');
  ultralink.addLink('jefferson', 'louisiana-purchase', 'initiated');
  ultralink.addLink('lincoln', 'civil-war-start', 'led_during');
  ultralink.addLink('lincoln', 'emancipation-proclamation', 'issued');
  ultralink.addLink('lincoln', 'civil-war-end', 'led_during');
  ultralink.addLink('roosevelt-fdr', 'pearl-harbor', 'led_during');
  ultralink.addLink('mlk', 'mlk-speech', 'delivered');
  
  // Link people to concepts
  ultralink.addLink('washington', 'democracy', 'championed');
  ultralink.addLink('jefferson', 'democracy', 'championed');
  ultralink.addLink('douglass', 'slavery', 'opposed');
  ultralink.addLink('douglass', 'civil-rights-concept', 'championed');
  ultralink.addLink('lincoln', 'slavery', 'opposed');
  ultralink.addLink('mlk', 'civil-rights-concept', 'championed');
  
  // Link events to concepts
  ultralink.addLink('declaration-independence', 'democracy', 'exemplifies');
  ultralink.addLink('emancipation-proclamation', 'slavery', 'opposed');
  ultralink.addLink('louisiana-purchase', 'manifest-destiny', 'exemplifies');
  ultralink.addLink('mlk-speech', 'civil-rights-concept', 'exemplifies');
  ultralink.addLink('obama-election', 'american-dream', 'exemplifies');
  
  // Link documents to people
  ultralink.addLink('declaration-doc', 'jefferson', 'authored_by');
  ultralink.addLink('constitution-doc', 'washington', 'supported_by');
  ultralink.addLink('gettysburg-address', 'lincoln', 'authored_by');
  
  // Link documents to events
  ultralink.addLink('declaration-doc', 'declaration-independence', 'produced_during');
  ultralink.addLink('constitution-doc', 'constitutional-convention', 'produced_during');
  ultralink.addLink('gettysburg-address', 'civil-war', 'produced_during');

  // ===== TEMPORAL DATA =====
  // Add temporal data for democracy concept
  ultralink.addEntity('democracy-1776', 'temporal_snapshot', {
    entityId: 'democracy',
    timestamp: '1776',
    popularity: 0.4,
    global_influence: 0.2,
    description: 'Democracy at founding of United States'
  });
  
  ultralink.addEntity('democracy-1800', 'temporal_snapshot', {
    entityId: 'democracy',
    timestamp: '1800',
    popularity: 0.5,
    global_influence: 0.3,
    description: 'Democracy in early republic era'
  });
  
  ultralink.addEntity('democracy-1850', 'temporal_snapshot', {
    entityId: 'democracy',
    timestamp: '1850',
    popularity: 0.6,
    global_influence: 0.4,
    description: 'Democracy in pre-Civil War America'
  });
  
  ultralink.addEntity('democracy-1900', 'temporal_snapshot', {
    entityId: 'democracy',
    timestamp: '1900',
    popularity: 0.7,
    global_influence: 0.5,
    description: 'Democracy during Progressive Era'
  });
  
  ultralink.addEntity('democracy-1950', 'temporal_snapshot', {
    entityId: 'democracy',
    timestamp: '1950',
    popularity: 0.8,
    global_influence: 0.7,
    description: 'Democracy during Cold War'
  });
  
  ultralink.addEntity('democracy-2000', 'temporal_snapshot', {
    entityId: 'democracy',
    timestamp: '2000',
    popularity: 0.9,
    global_influence: 0.8,
    description: 'Democracy in modern era'
  });
  
  ultralink.addEntity('democracy-2020', 'temporal_snapshot', {
    entityId: 'democracy',
    timestamp: '2020',
    popularity: 0.85,
    global_influence: 0.75,
    description: 'Democracy in contemporary America'
  });
  
  // Add temporal relationships for democracy snapshots
  ultralink.addLink('democracy', 'democracy-1776', 'has_state_at');
  ultralink.addLink('democracy', 'democracy-1800', 'has_state_at');
  ultralink.addLink('democracy', 'democracy-1850', 'has_state_at');
  ultralink.addLink('democracy', 'democracy-1900', 'has_state_at');
  ultralink.addLink('democracy', 'democracy-1950', 'has_state_at');
  ultralink.addLink('democracy', 'democracy-2000', 'has_state_at');
  ultralink.addLink('democracy', 'democracy-2020', 'has_state_at');
  
  // Add temporal data for slavery concept
  ultralink.addEntity('slavery-1700', 'temporal_snapshot', {
    entityId: 'slavery',
    timestamp: '1700',
    acceptance: 0.8,
    economic_importance: 0.7,
    description: 'Slavery in colonial America'
  });
  
  ultralink.addEntity('slavery-1776', 'temporal_snapshot', {
    entityId: 'slavery',
    timestamp: '1776',
    acceptance: 0.7,
    economic_importance: 0.8,
    description: 'Slavery at founding of United States'
  });
  
  ultralink.addEntity('slavery-1800', 'temporal_snapshot', {
    entityId: 'slavery',
    timestamp: '1800',
    acceptance: 0.65,
    economic_importance: 0.85,
    description: 'Slavery during early republic'
  });
  
  ultralink.addEntity('slavery-1850', 'temporal_snapshot', {
    entityId: 'slavery',
    timestamp: '1850',
    acceptance: 0.5,
    economic_importance: 0.8,
    description: 'Slavery during antebellum period'
  });
  
  ultralink.addEntity('slavery-1863', 'temporal_snapshot', {
    entityId: 'slavery',
    timestamp: '1863',
    acceptance: 0.3,
    economic_importance: 0.6,
    description: 'Slavery during Civil War'
  });
  
  ultralink.addEntity('slavery-1870', 'temporal_snapshot', {
    entityId: 'slavery',
    timestamp: '1870',
    acceptance: 0.1,
    economic_importance: 0.1,
    description: 'Slavery after emancipation'
  });
  
  // Add temporal relationships for slavery snapshots
  ultralink.addLink('slavery', 'slavery-1700', 'has_state_at');
  ultralink.addLink('slavery', 'slavery-1776', 'has_state_at');
  ultralink.addLink('slavery', 'slavery-1800', 'has_state_at');
  ultralink.addLink('slavery', 'slavery-1850', 'has_state_at');
  ultralink.addLink('slavery', 'slavery-1863', 'has_state_at');
  ultralink.addLink('slavery', 'slavery-1870', 'has_state_at');
  
  // Add key historical snapshots as entities
  ultralink.addEntity('founding-era', 'historical_snapshot', {
    date: '1789-04-30',
    description: 'Beginning of George Washington\'s presidency',
    significance: 'Start of the Constitutional government of the United States'
  });
  
  ultralink.addEntity('pre-civil-war', 'historical_snapshot', {
    date: '1860-11-06',
    description: 'Election of Abraham Lincoln',
    significance: 'Event that triggered secession of Southern states'
  });
  
  ultralink.addEntity('civil-rights-era', 'historical_snapshot', {
    date: '1964-07-02',
    description: 'Civil Rights Act of 1964',
    significance: 'Landmark civil rights legislation'
  });
  
  ultralink.addEntity('post-cold-war', 'historical_snapshot', {
    date: '1991-12-26',
    description: 'Dissolution of the Soviet Union',
    significance: 'End of the Cold War and beginning of a new geopolitical era'
  });

  // ===== SEMANTIC VECTORS & CLUSTERING =====
  // Add vector space definitions as metadata
  ultralink.addEntity('ideological-space', 'vector_space', {
    name: 'Ideological Positions',
    description: 'Ideological positions and political philosophies',
    dimensions: ['individual_liberty', 'equality', 'government_role', 'tradition', 'progress', 'isolationism']
  });
  
  ultralink.addEntity('social-values-space', 'vector_space', {
    name: 'Social Values',
    description: 'Social and cultural values across time',
    dimensions: ['individualism', 'community', 'diversity', 'spirituality', 'materialism', 'civic_duty']
  });
  
  // Add clusters as entities
  ultralink.addEntity('founding-principles-cluster', 'semantic_cluster', {
    name: 'Founding Principles',
    centerVector: [0.4, 0.35, 0.25, 0.3, 0.25, 0.1],
    vectorSpace: 'ideological-space',
    description: 'Cluster representing founding principles of American democracy'
  });
  
  ultralink.addEntity('civil-rights-cluster', 'semantic_cluster', {
    name: 'Civil Rights Movement',
    centerVector: [0.45, 0.4, 0.3, 0.2, 0.35, 0.15],
    vectorSpace: 'ideological-space',
    description: 'Cluster representing civil rights movement principles'
  });
  
  ultralink.addEntity('economic-development-cluster', 'semantic_cluster', {
    name: 'Economic Development',
    centerVector: [0.3, 0.25, 0.35, 0.25, 0.3, 0.25],
    vectorSpace: 'ideological-space',
    description: 'Cluster representing economic development principles'
  });
  
  // Add entities to clusters
  ultralink.addLink('democracy', 'founding-principles-cluster', 'belongs_to_cluster');
  ultralink.addLink('declaration-doc', 'founding-principles-cluster', 'belongs_to_cluster');
  ultralink.addLink('constitution-doc', 'founding-principles-cluster', 'belongs_to_cluster');
  ultralink.addLink('washington', 'founding-principles-cluster', 'belongs_to_cluster');
  ultralink.addLink('jefferson', 'founding-principles-cluster', 'belongs_to_cluster');
  
  ultralink.addLink('civil-rights-concept', 'civil-rights-cluster', 'belongs_to_cluster');
  ultralink.addLink('mlk', 'civil-rights-cluster', 'belongs_to_cluster');
  ultralink.addLink('mlk-speech', 'civil-rights-cluster', 'belongs_to_cluster');
  ultralink.addLink('douglass', 'civil-rights-cluster', 'belongs_to_cluster');
  
  ultralink.addLink('american-dream', 'economic-development-cluster', 'belongs_to_cluster');
  ultralink.addLink('roosevelt-fdr', 'economic-development-cluster', 'belongs_to_cluster');
  ultralink.addLink('stock-market-crash', 'economic-development-cluster', 'belongs_to_cluster');
  
  // Add vector analysis results as entities
  ultralink.addEntity('democracy-rights-similarity', 'similarity_analysis', {
    name: 'Democracy and Civil Rights Relationship',
    entities: ['democracy', 'civil-rights-concept'],
    similarity: 0.85,
    interpretation: 'Strong conceptual link between democratic governance and civil rights'
  });
  
  ultralink.addEntity('liberty-dream-similarity', 'similarity_analysis', {
    name: 'Liberty and American Dream Relationship',
    entities: ['declaration-independence', 'american-dream'],
    similarity: 0.78,
    interpretation: 'American founding principles closely aligned with aspirational values'
  });
  
  // Add concept drift analysis as entities
  ultralink.addEntity('democracy-evolution', 'concept_drift', {
    name: 'Evolution of Democracy',
    concept: 'democracy',
    startPoint: '1776',
    endPoint: '2020',
    drift: 0.35,
    interpretation: 'Significant expansion of democratic concepts to include broader participation'
  });
  
  ultralink.addEntity('equality-evolution', 'concept_drift', {
    name: 'Evolution of Equality',
    concept: 'civil-rights-concept',
    startPoint: '1776',
    endPoint: '2020',
    drift: 0.62,
    interpretation: 'Major transformation in understanding of equality across demographic groups'
  });

  return ultralink;
}

/**
 * Creates a subset of the USA History dataset focused on a specific time period
 * @param {Object} options Configuration object with subset parameters
 * @returns {UltraLink} Filtered UltraLink instance
 */
function createUSAHistorySubset(options = {}) {
  const { period, theme, vectorSpace } = options;
  const fullDataset = createUSAHistoryDataset();
  
  // Implementation would filter the full dataset based on parameters
  // For this example, we'll just return the full dataset
  return fullDataset;
}

module.exports = {
  createUSAHistoryDataset,
  createUSAHistorySubset
}; 
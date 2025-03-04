/**
 * Desert Ecosystem Test Fixtures
 * 
 * This module provides test data for a desert ecosystem scenario that demonstrates
 * UltraLink's capabilities for modeling complex natural systems. The example includes:
 * - Desert animals with adaptations and behaviors
 * - Desert plants and their survival mechanisms
 * - Abiotic factors such as temperature, water sources, and geological features
 * - Interrelationships between organisms and their environment
 */

const { UltraLink } = require('../../../../src');

/**
 * Create a complete desert ecosystem dataset
 * @returns {UltraLink} Populated UltraLink instance
 */
function createDesertEcosystemDataset() {
  const desertEcosystem = new UltraLink();
  
  // Add Desert Animals
  desertEcosystem.addEntity('camel', 'animal', {
    name: 'Dromedary Camel',
    scientificName: 'Camelus dromedarius',
    lifespan: 40,
    diet: 'herbivore',
    status: 'least concern',
    description: 'The dromedary camel is a large, single-humped ungulate adapted for desert conditions.',
    adaptations: [
      'Can go for long periods without water',
      'Humps store fat for energy',
      'Thick fur insulates against heat',
      'Specialized eyelids and nostrils for sand protection',
      'Can tolerate extreme temperatures'
    ]
  });

  desertEcosystem.addEntity('fennec_fox', 'animal', {
    name: 'Fennec Fox',
    scientificName: 'Vulpes zerda',
    lifespan: 12,
    diet: 'omnivore',
    status: 'least concern',
    description: 'The smallest canid species, known for its unusually large ears.',
    adaptations: [
      'Large ears dissipate heat and detect prey underground',
      'Thick fur insulates against cold nights',
      'Kidney adaptations to conserve water',
      'Pale coat reflects sunlight',
      'Nocturnal behavior to avoid daytime heat'
    ]
  });

  desertEcosystem.addEntity('desert_monitor', 'animal', {
    name: 'Desert Monitor',
    scientificName: 'Varanus griseus',
    lifespan: 15,
    diet: 'carnivore',
    status: 'least concern',
    description: 'A large lizard found across North Africa and parts of Asia.',
    adaptations: [
      'Heat-resistant scales',
      'Efficient water conservation',
      'Can remain inactive for long periods',
      'Burrows to escape extreme temperatures'
    ]
  });

  desertEcosystem.addEntity('sidewinder', 'animal', {
    name: 'Sidewinder Rattlesnake',
    scientificName: 'Crotalus cerastes',
    lifespan: 20,
    diet: 'carnivore',
    status: 'least concern',
    description: 'Venomous pit viper known for its sideways movement across sand.',
    adaptations: [
      'Sidewinding locomotion minimizes contact with hot sand',
      'Heat-sensing pits detect prey',
      'Scales provide camouflage in sandy environments',
      'Specialized breathing to prevent sand inhalation'
    ]
  });

  desertEcosystem.addEntity('scorpion', 'animal', {
    name: 'Deathstalker Scorpion',
    scientificName: 'Leiurus quinquestriatus',
    lifespan: 5,
    diet: 'carnivore',
    status: 'least concern',
    description: 'One of the most dangerous scorpion species, with potent venom.',
    adaptations: [
      'Nocturnal behavior to avoid heat',
      'Exoskeleton prevents water loss',
      'UV fluorescence may help detect light levels',
      'Burrowing behavior for temperature regulation'
    ]
  });

  desertEcosystem.addEntity('darkling_beetle', 'animal', {
    name: 'Darkling Beetle',
    scientificName: 'Tenebrionidae family',
    lifespan: 2,
    diet: 'omnivore',
    status: 'least concern',
    description: 'Desert beetles with numerous adaptations for arid environments.',
    adaptations: [
      'Waxy cuticle reduces water loss',
      'Can collect water from fog on body',
      'Stands with head down and abdomen raised to collect moisture',
      'Nocturnal to avoid daytime heat'
    ]
  });

  desertEcosystem.addEntity('roadrunner', 'animal', {
    name: 'Greater Roadrunner',
    scientificName: 'Geococcyx californianus',
    lifespan: 8,
    diet: 'carnivore',
    status: 'least concern',
    description: 'Fast-running ground cuckoo that rarely flies.',
    adaptations: [
      'Can extract water from prey',
      'Salt glands to excrete excess salt',
      'Ground-dwelling to avoid flying in thin, hot air',
      'Special feathers for insulation'
    ]
  });

  // NEW DESERT ANIMALS
  desertEcosystem.addEntity('desert_tortoise', 'animal', {
    name: 'Desert Tortoise',
    scientificName: 'Gopherus agassizii',
    lifespan: 80,
    diet: 'herbivore',
    status: 'vulnerable',
    description: 'Long-lived reptile of the Mojave and Sonoran deserts with high-domed shell.',
    adaptations: [
      'Can store water in bladder for extended periods',
      'Digs burrows to escape extreme temperatures',
      'Metabolic adaptations to survive drought',
      'Specialized digestive system for low-quality plant material',
      'Slow metabolism conserves energy'
    ]
  });

  desertEcosystem.addEntity('cactus_wren', 'animal', {
    name: 'Cactus Wren',
    scientificName: 'Campylorhynchus brunneicapillus',
    lifespan: 7,
    diet: 'insectivore',
    status: 'least concern',
    description: 'Desert bird that builds nests in cholla and other cacti for protection.',
    adaptations: [
      'Obtains most water from food rather than drinking',
      'Specialized nest-building in protective cacti',
      'Heat-resistant metabolism',
      'Efficient kidney function to conserve water'
    ]
  });

  desertEcosystem.addEntity('kangaroo_rat', 'animal', {
    name: 'Merriam\'s Kangaroo Rat',
    scientificName: 'Dipodomys merriami',
    lifespan: 5,
    diet: 'granivore',
    status: 'least concern',
    description: 'Small desert rodent with highly specialized adaptations for water conservation.',
    adaptations: [
      'Can survive without drinking water',
      'Extracts water metabolically from dry seeds',
      'Specialized kidneys concentrate urine',
      'Nocturnal to avoid daytime heat',
      'Burrows underground during day to avoid heat'
    ]
  });

  desertEcosystem.addEntity('gila_monster', 'animal', {
    name: 'Gila Monster',
    scientificName: 'Heloderma suspectum',
    lifespan: 20,
    diet: 'carnivore',
    status: 'near threatened',
    description: 'Venomous lizard of the southwestern US and northwestern Mexico.',
    adaptations: [
      'Stores fat in tail for long periods without food',
      'Venomous bite for efficient predation',
      'Thick skin reduces water loss',
      'Slow metabolism allows for infrequent feeding',
      'Can survive on as few as 3-4 meals per year'
    ]
  });

  desertEcosystem.addEntity('javelina', 'animal', {
    name: 'Javelina',
    scientificName: 'Pecari tajacu',
    lifespan: 10,
    diet: 'omnivore',
    status: 'least concern',
    description: 'Also known as collared peccary, a pig-like mammal adapted to desert environments.',
    adaptations: [
      'Can consume water-rich cacti including prickly pear',
      'Active in early morning and evening to avoid heat',
      'Social behavior reduces predation risk',
      'Specialized digestive system for desert plants'
    ]
  });

  // Add Desert Plants
  desertEcosystem.addEntity('saguaro', 'plant', {
    name: 'Saguaro Cactus',
    scientificName: 'Carnegiea gigantea',
    height: 1200, // up to 12 meters
    waterRequirement: 'very low',
    description: 'Iconic columnar cactus with arm-like branches.',
    adaptations: [
      'Accordion-like pleats expand when absorbing water',
      'Extensive shallow root system',
      'Thick waxy coating to reduce water loss',
      'Slow growth to conserve energy',
      'CAM photosynthesis for water conservation'
    ]
  });

  desertEcosystem.addEntity('barrel_cactus', 'plant', {
    name: 'Barrel Cactus',
    scientificName: 'Ferocactus wislizeni',
    height: 150, // up to 1.5 meters
    waterRequirement: 'very low',
    description: 'Cylindrical-shaped cactus known for tilting toward the sun.',
    adaptations: [
      'Ribbed structure allows expansion during water absorption',
      'Thick waxy coating to reduce evaporation',
      'Spines create microclimate of shade',
      'Can survive extremely high temperatures'
    ]
  });

  desertEcosystem.addEntity('mesquite', 'plant', {
    name: 'Honey Mesquite',
    scientificName: 'Prosopis glandulosa',
    height: 900, // up to 9 meters
    waterRequirement: 'low',
    description: 'Deciduous tree with deep roots that can access groundwater.',
    adaptations: [
      'Extremely deep taproots can reach 50m below surface',
      'Small leaves reduce water loss',
      'Drought deciduous - can shed leaves during extreme drought',
      'Nitrogen fixing ability improves soil quality'
    ]
  });

  desertEcosystem.addEntity('creosote_bush', 'plant', {
    name: 'Creosote Bush',
    scientificName: 'Larrea tridentata',
    height: 300, // up to 3 meters
    waterRequirement: 'very low',
    description: 'One of the most drought-tolerant plants, can live over 10,000 years.',
    adaptations: [
      'Resinous coating on leaves prevents water loss',
      'Toxins in soil prevent other plants from growing nearby (allelopathy)',
      'Small leaves reduce surface area for evaporation',
      'Can survive with just 75mm of annual rainfall'
    ]
  });

  desertEcosystem.addEntity('desert_poppy', 'plant', {
    name: 'Desert Poppy',
    scientificName: 'Eschscholzia glyptosperma',
    height: 30,
    waterRequirement: 'low',
    description: 'Annual wildflower that blooms spectacularly after rains.',
    adaptations: [
      'Seeds can remain dormant for years until rainfall',
      'Quick lifecycle to complete before drought returns',
      'Deep taproots to access underground moisture',
      'Waxy leaf coating to reduce evaporation'
    ]
  });

  // NEW DESERT PLANTS
  desertEcosystem.addEntity('ocotillo', 'plant', {
    name: 'Ocotillo',
    scientificName: 'Fouquieria splendens',
    height: 500, // up to 5 meters
    waterRequirement: 'low',
    description: 'Spindly desert plant with bright red flowers.',
    adaptations: [
      'Drought deciduous - drops leaves during dry periods',
      'Grows leaves quickly after rain',
      'Deep tap root',
      'Waxy coating on stems',
      'Thorns for protection'
    ]
  });

  desertEcosystem.addEntity('brittlebush', 'plant', {
    name: 'Brittlebush',
    scientificName: 'Encelia farinosa',
    height: 150, // up to 1.5 meters
    waterRequirement: 'very low',
    description: 'Common desert shrub with silvery leaves and yellow flowers.',
    adaptations: [
      'Resinous sap seals wounds to prevent water loss',
      'Light-colored leaves reflect sunlight',
      'Dense leaf hairs (trichomes) reduce water loss',
      'Seasonal leaf drop during extreme drought',
      'Quick response to rainfall with new growth'
    ]
  });

  desertEcosystem.addEntity('desert_ironwood', 'plant', {
    name: 'Desert Ironwood',
    scientificName: 'Olneya tesota',
    height: 1000, // up to 10 meters
    waterRequirement: 'low',
    description: 'Long-lived desert tree with extremely dense wood, can live 800+ years.',
    adaptations: [
      'Nitrogen fixing capability improves soil',
      'Extremely deep root system',
      'Small, drought-deciduous leaves',
      'Dense wood stores water',
      'Provides "nurse plant" habitat for other species'
    ]
  });

  desertEcosystem.addEntity('agave', 'plant', {
    name: 'Century Plant',
    scientificName: 'Agave americana',
    height: 200, // up to 2 meters (rosette, flower stalk much taller)
    waterRequirement: 'very low',
    description: 'Large succulent that flowers once at the end of its life.',
    adaptations: [
      'CAM photosynthesis to conserve water',
      'Thick, waxy leaves reduce water loss',
      'Rosette form channels water to central root',
      'Fibrous leaf structure for structural support',
      'Monocarpic lifecycle (flowers once then dies)'
    ]
  });

  desertEcosystem.addEntity('joshua_tree', 'plant', {
    name: 'Joshua Tree',
    scientificName: 'Yucca brevifolia',
    height: 1200, // up to 12 meters
    waterRequirement: 'low',
    description: 'Iconic tree-like yucca of the Mojave Desert with unique appearance.',
    adaptations: [
      'Extensive shallow root system',
      'Thick, moisture-retaining trunk',
      'Waxy, spine-tipped leaves reduce water loss',
      'Specialized pollination relationship with yucca moth',
      'Slow growth rate conserves resources'
    ]
  });

  // Add prickly pear cactus entity
  desertEcosystem.addEntity('prickly_pear', 'plant', {
    name: 'Prickly Pear Cactus',
    scientificName: 'Opuntia spp.',
    height: 200, // up to 2 meters
    waterRequirement: 'very low',
    description: 'Flat-padded cacti with colorful fruits and sharp spines.',
    adaptations: [
      'Flat pads maximize photosynthesis while minimizing surface area',
      'Waxy coating reduces water loss',
      'Shallow, extensive root system',
      'Spines protect from herbivores and provide shade'
    ]
  });

  desertEcosystem.addEntity('cholla_cactus', 'plant', {
    name: 'Cholla Cactus',
    scientificName: 'Cylindropuntia spp.',
    height: 300, // up to 3 meters
    waterRequirement: 'very low',
    description: 'Known for detachable barbed spines that easily attach to passersby.',
    adaptations: [
      'Segmented structure allows for vegetative reproduction',
      'Dense, barbed spines deter predation',
      'Water storage in stem segments',
      'Shallow but extensive root system'
    ]
  });
  
  // Group entity for general desert plants
  desertEcosystem.addEntity('other_plants', 'plant', {
    name: 'Various Desert Plants',
    description: 'Collection of various smaller desert plants and grasses',
    waterRequirement: 'low to moderate',
    adaptations: [
      'Various drought adaptations',
      'Seasonal growth patterns',
      'Seed dormancy during dry periods'
    ]
  });

  // Add Abiotic Factors
  desertEcosystem.addEntity('heat', 'abiotic_factor', {
    name: 'Extreme Heat',
    type: 'climate',
    description: 'Daytime temperatures regularly exceeding 40°C (104°F) in summer.',
    impact: 'extreme'
  });

  desertEcosystem.addEntity('temperature_variation', 'abiotic_factor', {
    name: 'Temperature Variation',
    type: 'climate',
    description: 'Large daily temperature fluctuations, often exceeding 20°C between day and night.',
    impact: 'high'
  });

  desertEcosystem.addEntity('aridity', 'abiotic_factor', {
    name: 'Aridity',
    type: 'climate',
    description: 'Low precipitation, typically less than 250mm annually, with high evaporation rates.',
    impact: 'extreme'
  });

  desertEcosystem.addEntity('sand_dunes', 'abiotic_factor', {
    name: 'Sand Dunes',
    type: 'geological',
    description: 'Mounds of windblown sand that can move and shift over time.',
    impact: 'high'
  });

  desertEcosystem.addEntity('rocky_outcrops', 'abiotic_factor', {
    name: 'Rocky Outcrops',
    type: 'geological',
    description: 'Exposed rock formations that provide shade and shelter.',
    impact: 'medium'
  });

  desertEcosystem.addEntity('oasis', 'abiotic_factor', {
    name: 'Oasis',
    type: 'water',
    description: 'Isolated water source surrounded by desert, often fed by underground springs.',
    impact: 'high'
  });

  desertEcosystem.addEntity('ephemeral_streams', 'abiotic_factor', {
    name: 'Ephemeral Streams',
    type: 'water',
    description: 'Temporary waterways that flow only after rainfall events.',
    impact: 'medium'
  });

  desertEcosystem.addEntity('sandy_soil', 'abiotic_factor', {
    name: 'Sandy Soil',
    type: 'soil',
    description: 'Coarse-grained soil with poor water retention but good drainage.',
    impact: 'high'
  });

  desertEcosystem.addEntity('desert_pavement', 'abiotic_factor', {
    name: 'Desert Pavement',
    type: 'geological',
    description: 'Dense layer of pebbles and rocks at the surface, formed by wind removing fine particles.',
    impact: 'high'
  });

  desertEcosystem.addEntity('desert_varnish', 'abiotic_factor', {
    name: 'Desert Varnish',
    type: 'geological',
    description: 'Dark coating on exposed rock surfaces, composed of clay minerals with iron and manganese oxides.',
    impact: 'low'
  });

  desertEcosystem.addEntity('playa', 'abiotic_factor', {
    name: 'Playa',
    type: 'geological',
    description: 'Flat, dry lake bed that occasionally floods after heavy rain.',
    impact: 'medium'
  });

  desertEcosystem.addEntity('flash_floods', 'abiotic_factor', {
    name: 'Flash Floods',
    type: 'water',
    description: 'Sudden, intense flooding events often occurring in desert washes after heavy rainfall.',
    impact: 'extreme'
  });

  // Add Microhabitats
  desertEcosystem.addEntity('wash', 'microhabitat', {
    name: 'Desert Wash',
    description: 'Dry streambed that carries water only after rainfall, often with distinct vegetation.',
    type: 'seasonal_wetland',
    area: 'variable',
    soilMoisture: 'higher than surroundings'
  });

  desertEcosystem.addEntity('dune_field', 'microhabitat', {
    name: 'Sand Dune Field',
    description: 'Area of wind-deposited sand formations with specialized plant and animal communities.',
    type: 'aeolian',
    area: 'large',
    soilMoisture: 'extremely low'
  });

  desertEcosystem.addEntity('rocky_slope', 'microhabitat', {
    name: 'Rocky Slope',
    description: 'Elevated area with exposed bedrock and boulders, providing shade and shelter.',
    type: 'lithic',
    area: 'medium',
    soilMoisture: 'very low'
  });

  desertEcosystem.addEntity('canyon', 'microhabitat', {
    name: 'Desert Canyon',
    description: 'Deep, narrow channel with steep walls, often with increased moisture and biodiversity.',
    type: 'erosional',
    area: 'variable',
    soilMoisture: 'variable'
  });

  // Add Biological Interactions
  desertEcosystem.addEntity('pollination_yucca', 'interaction', {
    name: 'Yucca-Moth Pollination',
    description: 'Specialized mutualistic relationship between yucca plants and yucca moths.',
    type: 'mutualism',
    participants: ['joshua_tree', 'yucca_moth'],
    strength: 'obligate'
  });

  desertEcosystem.addEntity('nurse_plant', 'interaction', {
    name: 'Nurse Plant Relationship',
    description: 'Protection of seedlings by established desert plants providing shade and improved soil.',
    type: 'commensalism',
    participants: ['desert_ironwood', 'saguaro'],
    strength: 'facultative'
  });

  desertEcosystem.addEntity('seed_dispersal', 'interaction', {
    name: 'Seed Dispersal',
    description: 'Movement of plant seeds by desert animals, aiding plant reproduction and distribution.',
    type: 'mutualism',
    participants: ['mesquite', 'coyote'],
    strength: 'facultative'
  });

  // Add missing animal for yucca moth relationship
  desertEcosystem.addEntity('yucca_moth', 'animal', {
    name: 'Yucca Moth',
    scientificName: 'Tegeticula yuccasella',
    lifespan: 0.5, // months
    diet: 'herbivore',
    status: 'least concern',
    description: 'Small moth with specialized relationship with Joshua trees and other yuccas.',
    adaptations: [
      'Specialized mouthparts for collecting pollen',
      'Ovipositor for laying eggs in yucca flowers',
      'Lifecycle synchronized with yucca flowering',
      'Larvae feed only on some yucca seeds, preserving others'
    ]
  });

  // Add missing animal for seed dispersal relationship
  desertEcosystem.addEntity('coyote', 'animal', {
    name: 'Coyote',
    scientificName: 'Canis latrans',
    lifespan: 14,
    diet: 'omnivore',
    status: 'least concern',
    description: 'Adaptable canid found throughout North American deserts and beyond.',
    adaptations: [
      'Can survive on minimal water obtained from prey',
      'Opportunistic feeding habits',
      'Highly adaptable to different habitats',
      'Active during cooler parts of day',
      'Efficient predator of small desert mammals'
    ]
  });

  // Establish Relationships
  
  // Adaptation Relationships - Animals to Abiotic Factors
  desertEcosystem.addLink('camel', 'heat', 'adapted_to', {
    adaptationMechanism: 'Physiological temperature regulation',
    strength: 'extreme'
  });
  
  desertEcosystem.addLink('fennec_fox', 'heat', 'adapted_to', {
    adaptationMechanism: 'Large ears for heat dissipation',
    strength: 'strong'
  });
  
  desertEcosystem.addLink('darkling_beetle', 'aridity', 'adapted_to', {
    adaptationMechanism: 'Water harvesting from air',
    strength: 'extreme'
  });
  
  desertEcosystem.addLink('sidewinder', 'sand_dunes', 'adapted_to', {
    adaptationMechanism: 'Specialized locomotion',
    strength: 'extreme'
  });

  // NEW ANIMAL ADAPTATIONS
  desertEcosystem.addLink('desert_tortoise', 'aridity', 'adapted_to', {
    adaptationMechanism: 'Water storage in bladder',
    strength: 'extreme'
  });
  
  desertEcosystem.addLink('kangaroo_rat', 'aridity', 'adapted_to', {
    adaptationMechanism: 'Metabolic water production',
    strength: 'extreme'
  });
  
  desertEcosystem.addLink('gila_monster', 'heat', 'adapted_to', {
    adaptationMechanism: 'Fat storage and seasonal activity',
    strength: 'strong'
  });
  
  desertEcosystem.addLink('cactus_wren', 'heat', 'adapted_to', {
    adaptationMechanism: 'Behavioral thermoregulation',
    strength: 'strong'
  });
  
  desertEcosystem.addLink('javelina', 'aridity', 'adapted_to', {
    adaptationMechanism: 'Consumption of water-rich cacti',
    strength: 'moderate'
  });
  
  desertEcosystem.addLink('yucca_moth', 'aridity', 'adapted_to', {
    adaptationMechanism: 'Short lifecycle synchronized with yucca flowering',
    strength: 'extreme'
  });
  
  desertEcosystem.addLink('coyote', 'aridity', 'adapted_to', {
    adaptationMechanism: 'Obtaining moisture from prey',
    strength: 'strong'
  });
  
  // Adaptation Relationships - Plants to Abiotic Factors
  desertEcosystem.addLink('saguaro', 'heat', 'adapted_to', {
    adaptationMechanism: 'Pleated structure for expansion',
    strength: 'extreme'
  });
  
  desertEcosystem.addLink('barrel_cactus', 'aridity', 'adapted_to', {
    adaptationMechanism: 'Water storage tissue',
    strength: 'extreme'
  });
  
  desertEcosystem.addLink('mesquite', 'aridity', 'adapted_to', {
    adaptationMechanism: 'Deep root system',
    strength: 'extreme'
  });
  
  desertEcosystem.addLink('creosote_bush', 'aridity', 'adapted_to', {
    adaptationMechanism: 'Resinous coating on leaves',
    strength: 'extreme'
  });

  // NEW PLANT ADAPTATIONS
  desertEcosystem.addLink('ocotillo', 'temperature_variation', 'adapted_to', {
    adaptationMechanism: 'Rapid leaf production after rain',
    strength: 'extreme'
  });
  
  desertEcosystem.addLink('brittlebush', 'heat', 'adapted_to', {
    adaptationMechanism: 'Reflective leaf surfaces',
    strength: 'strong'
  });
  
  desertEcosystem.addLink('desert_ironwood', 'aridity', 'adapted_to', {
    adaptationMechanism: 'Dense wood tissue',
    strength: 'extreme'
  });
  
  desertEcosystem.addLink('agave', 'aridity', 'adapted_to', {
    adaptationMechanism: 'CAM photosynthesis',
    strength: 'extreme'
  });
  
  desertEcosystem.addLink('joshua_tree', 'sandy_soil', 'grows_in', {
    frequency: 'permanent',
    dependency: 'high'
  });
  
  // Habitat Relationships - Animals to Microhabitats
  desertEcosystem.addLink('sidewinder', 'dune_field', 'lives_in', {
    frequency: 'permanent',
    dependency: 'high'
  });
  
  desertEcosystem.addLink('desert_tortoise', 'rocky_slope', 'lives_in', {
    frequency: 'seasonal',
    dependency: 'medium'
  });
  
  desertEcosystem.addLink('cactus_wren', 'wash', 'lives_in', {
    frequency: 'permanent',
    dependency: 'medium'
  });
  
  desertEcosystem.addLink('gila_monster', 'rocky_slope', 'lives_in', {
    frequency: 'permanent',
    dependency: 'high'
  });
  
  desertEcosystem.addLink('javelina', 'canyon', 'lives_in', {
    frequency: 'permanent',
    dependency: 'medium'
  });
  
  desertEcosystem.addLink('kangaroo_rat', 'dune_field', 'lives_in', {
    frequency: 'permanent',
    dependency: 'high'
  });
  
  desertEcosystem.addLink('scorpion', 'rocky_slope', 'lives_in', {
    frequency: 'permanent',
    dependency: 'medium'
  });
  
  desertEcosystem.addLink('coyote', 'canyon', 'lives_in', {
    frequency: 'permanent',
    dependency: 'low'
  });
  
  // Habitat Relationships - Plants to Microhabitats
  desertEcosystem.addLink('saguaro', 'rocky_slope', 'grows_in', {
    frequency: 'permanent',
    dependency: 'medium'
  });
  
  desertEcosystem.addLink('mesquite', 'wash', 'grows_in', {
    frequency: 'permanent',
    dependency: 'high'
  });
  
  desertEcosystem.addLink('desert_ironwood', 'wash', 'grows_in', {
    frequency: 'permanent',
    dependency: 'medium'
  });
  
  desertEcosystem.addLink('brittlebush', 'rocky_slope', 'grows_in', {
    frequency: 'permanent',
    dependency: 'medium'
  });
  
  // Feeding Relationships
  desertEcosystem.addLink('coyote', 'kangaroo_rat', 'preys_on', {
    frequency: 'common',
    method: 'hunting'
  });
  
  desertEcosystem.addLink('coyote', 'desert_tortoise', 'preys_on', {
    frequency: 'rare',
    method: 'opportunistic'
  });
  
  desertEcosystem.addLink('sidewinder', 'kangaroo_rat', 'preys_on', {
    frequency: 'common',
    method: 'ambush'
  });
  
  desertEcosystem.addLink('desert_monitor', 'scorpion', 'preys_on', {
    frequency: 'occasional',
    method: 'hunting'
  });
  
  desertEcosystem.addLink('gila_monster', 'cactus_wren', 'preys_on', {
    frequency: 'occasional',
    method: 'raiding nests'
  });
  
  desertEcosystem.addLink('roadrunner', 'scorpion', 'preys_on', {
    frequency: 'common',
    method: 'hunting'
  });
  
  desertEcosystem.addLink('roadrunner', 'sidewinder', 'preys_on', {
    frequency: 'occasional',
    method: 'hunting'
  });
  
  desertEcosystem.addLink('javelina', 'prickly_pear', 'consumes', {
    frequency: 'common',
    method: 'grazing'
  });
  
  desertEcosystem.addLink('desert_tortoise', 'desert_poppy', 'consumes', {
    frequency: 'seasonal',
    method: 'grazing'
  });
  
  desertEcosystem.addLink('kangaroo_rat', 'mesquite', 'consumes', {
    frequency: 'common',
    method: 'seed collection'
  });
  
  // Plant-Plant Interactions
  desertEcosystem.addLink('desert_ironwood', 'saguaro', 'nurses', {
    relationship: 'provides shade and protection',
    strength: 'strong'
  });
  
  desertEcosystem.addLink('mesquite', 'desert_poppy', 'facilitates', {
    relationship: 'improves soil conditions',
    strength: 'moderate'
  });
  
  desertEcosystem.addLink('creosote_bush', 'other_plants', 'inhibits', {
    relationship: 'allelopathy',
    strength: 'strong',
    description: 'Creosote bushes release toxins that inhibit growth of other plants nearby'
  });
  
  // Symbiotic Relationships
  desertEcosystem.addLink('joshua_tree', 'yucca_moth', 'mutual_dependency', {
    relationship: 'obligate reproductive site',
    strength: 'extreme'
  });
  
  desertEcosystem.addLink('yucca_moth', 'joshua_tree', 'mutual_dependency', {
    relationship: 'obligate reproductive site',
    strength: 'extreme'
  });
  
  // Relationship type definitions removed as createRelationshipType is not implemented in UltraLink class
  // These would define proper relationship schemas when the feature is implemented
  
  return desertEcosystem;
}

/**
 * Create a subset of the desert ecosystem dataset
 * @param {string} subset - The subset to create ('predator_prey', 'adaptations', 'water_relationships')
 * @returns {UltraLink} Populated UltraLink instance with a subset of the data
 */
function createDesertEcosystemSubset(subset) {
  const desertEcosystem = new UltraLink();
  
  // Create a subset based on the specified parameter
  switch(subset) {
    case 'predator_prey':
      // Create only animals and their predator-prey relationships
      const predators = ['fennec_fox', 'sidewinder', 'roadrunner', 'desert_monitor'];
      const prey = ['darkling_beetle', 'fennec_fox', 'scorpion', 'sidewinder'];
      
      // Create animal entities
      for (const id of [...new Set([...predators, ...prey])]) {
        // We'd need to add the appropriate attributes here in a real implementation
        desertEcosystem.addEntity(id, 'animal', { name: id.replace('_', ' ') });
      }
      
      // Create predator-prey relationships
      desertEcosystem.addLink('fennec_fox', 'darkling_beetle', 'preys_on');
      desertEcosystem.addLink('sidewinder', 'fennec_fox', 'preys_on');
      desertEcosystem.addLink('roadrunner', 'scorpion', 'preys_on');
      desertEcosystem.addLink('desert_monitor', 'sidewinder', 'preys_on');
      break;
      
    case 'adaptations':
      // Only create adaptation relationships
      // Animals
      desertEcosystem.addEntity('camel', 'animal', { name: 'Dromedary Camel' });
      desertEcosystem.addEntity('fennec_fox', 'animal', { name: 'Fennec Fox' });
      desertEcosystem.addEntity('darkling_beetle', 'animal', { name: 'Darkling Beetle' });
      desertEcosystem.addEntity('scorpion', 'animal', { name: 'Deathstalker Scorpion' });
      
      // Plants
      desertEcosystem.addEntity('saguaro', 'plant', { name: 'Saguaro Cactus' });
      desertEcosystem.addEntity('creosote_bush', 'plant', { name: 'Creosote Bush' });
      desertEcosystem.addEntity('mesquite', 'plant', { name: 'Honey Mesquite' });
      desertEcosystem.addEntity('desert_poppy', 'plant', { name: 'Desert Poppy' });
      
      // Abiotic factors
      desertEcosystem.addEntity('heat', 'abiotic_factor', { name: 'Extreme Heat', type: 'climate' });
      desertEcosystem.addEntity('aridity', 'abiotic_factor', { name: 'Aridity', type: 'climate' });
      desertEcosystem.addEntity('temperature_variation', 'abiotic_factor', { name: 'Temperature Variation', type: 'climate' });
      
      // Adaptations
      desertEcosystem.addLink('camel', 'heat', 'adapted_to');
      desertEcosystem.addLink('camel', 'aridity', 'adapted_to');
      desertEcosystem.addLink('fennec_fox', 'heat', 'adapted_to');
      desertEcosystem.addLink('darkling_beetle', 'aridity', 'adapted_to');
      desertEcosystem.addLink('scorpion', 'temperature_variation', 'adapted_to');
      desertEcosystem.addLink('saguaro', 'aridity', 'adapted_to');
      desertEcosystem.addLink('creosote_bush', 'aridity', 'adapted_to');
      desertEcosystem.addLink('mesquite', 'aridity', 'adapted_to');
      desertEcosystem.addLink('desert_poppy', 'aridity', 'adapted_to');
      break;
      
    case 'water_relationships':
      // Only create water-related entities and relationships
      // Animals
      desertEcosystem.addEntity('camel', 'animal', { name: 'Dromedary Camel' });
      
      // Plants
      desertEcosystem.addEntity('saguaro', 'plant', { name: 'Saguaro Cactus' });
      desertEcosystem.addEntity('mesquite', 'plant', { name: 'Honey Mesquite' });
      
      // Water sources
      desertEcosystem.addEntity('oasis', 'abiotic_factor', { name: 'Oasis', type: 'water' });
      desertEcosystem.addEntity('ephemeral_streams', 'abiotic_factor', { name: 'Ephemeral Streams', type: 'water' });
      desertEcosystem.addEntity('aridity', 'abiotic_factor', { name: 'Aridity', type: 'climate' });
      
      // Water relationships
      desertEcosystem.addLink('camel', 'oasis', 'requires');
      desertEcosystem.addLink('saguaro', 'ephemeral_streams', 'requires');
      desertEcosystem.addLink('mesquite', 'oasis', 'requires');
      desertEcosystem.addLink('camel', 'aridity', 'adapted_to');
      desertEcosystem.addLink('saguaro', 'aridity', 'adapted_to');
      desertEcosystem.addLink('mesquite', 'aridity', 'adapted_to');
      break;
      
    default:
      throw new Error(`Unknown subset type: ${subset}`);
  }
  
  return desertEcosystem;
}

// Export the dataset creation functions
module.exports = {
  createDesertEcosystemDataset,
  createDesertEcosystemSubset
}; 
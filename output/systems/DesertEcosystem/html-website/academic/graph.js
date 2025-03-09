// Graph visualization data
const data = {
  "nodes": [
    {
      "id": "camel",
      "type": "animal",
      "label": "Dromedary Camel",
      "attributes": {
        "name": "Dromedary Camel",
        "scientificName": "Camelus dromedarius",
        "lifespan": 40,
        "diet": "herbivore",
        "status": "least concern",
        "description": "The dromedary camel is a large, single-humped ungulate adapted for desert conditions.",
        "adaptations": [
          "Can go for long periods without water",
          "Humps store fat for energy",
          "Thick fur insulates against heat",
          "Specialized eyelids and nostrils for sand protection",
          "Can tolerate extreme temperatures"
        ]
      }
    },
    {
      "id": "fennec_fox",
      "type": "animal",
      "label": "Fennec Fox",
      "attributes": {
        "name": "Fennec Fox",
        "scientificName": "Vulpes zerda",
        "lifespan": 12,
        "diet": "omnivore",
        "status": "least concern",
        "description": "The smallest canid species, known for its unusually large ears.",
        "adaptations": [
          "Large ears dissipate heat and detect prey underground",
          "Thick fur insulates against cold nights",
          "Kidney adaptations to conserve water",
          "Pale coat reflects sunlight",
          "Nocturnal behavior to avoid daytime heat"
        ]
      }
    },
    {
      "id": "desert_monitor",
      "type": "animal",
      "label": "Desert Monitor",
      "attributes": {
        "name": "Desert Monitor",
        "scientificName": "Varanus griseus",
        "lifespan": 15,
        "diet": "carnivore",
        "status": "least concern",
        "description": "A large lizard found across North Africa and parts of Asia.",
        "adaptations": [
          "Heat-resistant scales",
          "Efficient water conservation",
          "Can remain inactive for long periods",
          "Burrows to escape extreme temperatures"
        ]
      }
    },
    {
      "id": "sidewinder",
      "type": "animal",
      "label": "Sidewinder Rattlesnake",
      "attributes": {
        "name": "Sidewinder Rattlesnake",
        "scientificName": "Crotalus cerastes",
        "lifespan": 20,
        "diet": "carnivore",
        "status": "least concern",
        "description": "Venomous pit viper known for its sideways movement across sand.",
        "adaptations": [
          "Sidewinding locomotion minimizes contact with hot sand",
          "Heat-sensing pits detect prey",
          "Scales provide camouflage in sandy environments",
          "Specialized breathing to prevent sand inhalation"
        ]
      }
    },
    {
      "id": "scorpion",
      "type": "animal",
      "label": "Deathstalker Scorpion",
      "attributes": {
        "name": "Deathstalker Scorpion",
        "scientificName": "Leiurus quinquestriatus",
        "lifespan": 5,
        "diet": "carnivore",
        "status": "least concern",
        "description": "One of the most dangerous scorpion species, with potent venom.",
        "adaptations": [
          "Nocturnal behavior to avoid heat",
          "Exoskeleton prevents water loss",
          "UV fluorescence may help detect light levels",
          "Burrowing behavior for temperature regulation"
        ]
      }
    },
    {
      "id": "darkling_beetle",
      "type": "animal",
      "label": "Darkling Beetle",
      "attributes": {
        "name": "Darkling Beetle",
        "scientificName": "Tenebrionidae family",
        "lifespan": 2,
        "diet": "omnivore",
        "status": "least concern",
        "description": "Desert beetles with numerous adaptations for arid environments.",
        "adaptations": [
          "Waxy cuticle reduces water loss",
          "Can collect water from fog on body",
          "Stands with head down and abdomen raised to collect moisture",
          "Nocturnal to avoid daytime heat"
        ]
      }
    },
    {
      "id": "roadrunner",
      "type": "animal",
      "label": "Greater Roadrunner",
      "attributes": {
        "name": "Greater Roadrunner",
        "scientificName": "Geococcyx californianus",
        "lifespan": 8,
        "diet": "carnivore",
        "status": "least concern",
        "description": "Fast-running ground cuckoo that rarely flies.",
        "adaptations": [
          "Can extract water from prey",
          "Salt glands to excrete excess salt",
          "Ground-dwelling to avoid flying in thin, hot air",
          "Special feathers for insulation"
        ]
      }
    },
    {
      "id": "desert_tortoise",
      "type": "animal",
      "label": "Desert Tortoise",
      "attributes": {
        "name": "Desert Tortoise",
        "scientificName": "Gopherus agassizii",
        "lifespan": 80,
        "diet": "herbivore",
        "status": "vulnerable",
        "description": "Long-lived reptile of the Mojave and Sonoran deserts with high-domed shell.",
        "adaptations": [
          "Can store water in bladder for extended periods",
          "Digs burrows to escape extreme temperatures",
          "Metabolic adaptations to survive drought",
          "Specialized digestive system for low-quality plant material",
          "Slow metabolism conserves energy"
        ]
      }
    },
    {
      "id": "cactus_wren",
      "type": "animal",
      "label": "Cactus Wren",
      "attributes": {
        "name": "Cactus Wren",
        "scientificName": "Campylorhynchus brunneicapillus",
        "lifespan": 7,
        "diet": "insectivore",
        "status": "least concern",
        "description": "Desert bird that builds nests in cholla and other cacti for protection.",
        "adaptations": [
          "Obtains most water from food rather than drinking",
          "Specialized nest-building in protective cacti",
          "Heat-resistant metabolism",
          "Efficient kidney function to conserve water"
        ]
      }
    },
    {
      "id": "kangaroo_rat",
      "type": "animal",
      "label": "Merriam's Kangaroo Rat",
      "attributes": {
        "name": "Merriam's Kangaroo Rat",
        "scientificName": "Dipodomys merriami",
        "lifespan": 5,
        "diet": "granivore",
        "status": "least concern",
        "description": "Small desert rodent with highly specialized adaptations for water conservation.",
        "adaptations": [
          "Can survive without drinking water",
          "Extracts water metabolically from dry seeds",
          "Specialized kidneys concentrate urine",
          "Nocturnal to avoid daytime heat",
          "Burrows underground during day to avoid heat"
        ]
      }
    },
    {
      "id": "gila_monster",
      "type": "animal",
      "label": "Gila Monster",
      "attributes": {
        "name": "Gila Monster",
        "scientificName": "Heloderma suspectum",
        "lifespan": 20,
        "diet": "carnivore",
        "status": "near threatened",
        "description": "Venomous lizard of the southwestern US and northwestern Mexico.",
        "adaptations": [
          "Stores fat in tail for long periods without food",
          "Venomous bite for efficient predation",
          "Thick skin reduces water loss",
          "Slow metabolism allows for infrequent feeding",
          "Can survive on as few as 3-4 meals per year"
        ]
      }
    },
    {
      "id": "javelina",
      "type": "animal",
      "label": "Javelina",
      "attributes": {
        "name": "Javelina",
        "scientificName": "Pecari tajacu",
        "lifespan": 10,
        "diet": "omnivore",
        "status": "least concern",
        "description": "Also known as collared peccary, a pig-like mammal adapted to desert environments.",
        "adaptations": [
          "Can consume water-rich cacti including prickly pear",
          "Active in early morning and evening to avoid heat",
          "Social behavior reduces predation risk",
          "Specialized digestive system for desert plants"
        ]
      }
    },
    {
      "id": "saguaro",
      "type": "plant",
      "label": "Saguaro Cactus",
      "attributes": {
        "name": "Saguaro Cactus",
        "scientificName": "Carnegiea gigantea",
        "height": 1200,
        "waterRequirement": "very low",
        "description": "Iconic columnar cactus with arm-like branches.",
        "adaptations": [
          "Accordion-like pleats expand when absorbing water",
          "Extensive shallow root system",
          "Thick waxy coating to reduce water loss",
          "Slow growth to conserve energy",
          "CAM photosynthesis for water conservation"
        ]
      }
    },
    {
      "id": "barrel_cactus",
      "type": "plant",
      "label": "Barrel Cactus",
      "attributes": {
        "name": "Barrel Cactus",
        "scientificName": "Ferocactus wislizeni",
        "height": 150,
        "waterRequirement": "very low",
        "description": "Cylindrical-shaped cactus known for tilting toward the sun.",
        "adaptations": [
          "Ribbed structure allows expansion during water absorption",
          "Thick waxy coating to reduce evaporation",
          "Spines create microclimate of shade",
          "Can survive extremely high temperatures"
        ]
      }
    },
    {
      "id": "mesquite",
      "type": "plant",
      "label": "Honey Mesquite",
      "attributes": {
        "name": "Honey Mesquite",
        "scientificName": "Prosopis glandulosa",
        "height": 900,
        "waterRequirement": "low",
        "description": "Deciduous tree with deep roots that can access groundwater.",
        "adaptations": [
          "Extremely deep taproots can reach 50m below surface",
          "Small leaves reduce water loss",
          "Drought deciduous - can shed leaves during extreme drought",
          "Nitrogen fixing ability improves soil quality"
        ]
      }
    },
    {
      "id": "creosote_bush",
      "type": "plant",
      "label": "Creosote Bush",
      "attributes": {
        "name": "Creosote Bush",
        "scientificName": "Larrea tridentata",
        "height": 300,
        "waterRequirement": "very low",
        "description": "One of the most drought-tolerant plants, can live over 10,000 years.",
        "adaptations": [
          "Resinous coating on leaves prevents water loss",
          "Toxins in soil prevent other plants from growing nearby (allelopathy)",
          "Small leaves reduce surface area for evaporation",
          "Can survive with just 75mm of annual rainfall"
        ]
      }
    },
    {
      "id": "desert_poppy",
      "type": "plant",
      "label": "Desert Poppy",
      "attributes": {
        "name": "Desert Poppy",
        "scientificName": "Eschscholzia glyptosperma",
        "height": 30,
        "waterRequirement": "low",
        "description": "Annual wildflower that blooms spectacularly after rains.",
        "adaptations": [
          "Seeds can remain dormant for years until rainfall",
          "Quick lifecycle to complete before drought returns",
          "Deep taproots to access underground moisture",
          "Waxy leaf coating to reduce evaporation"
        ]
      }
    },
    {
      "id": "ocotillo",
      "type": "plant",
      "label": "Ocotillo",
      "attributes": {
        "name": "Ocotillo",
        "scientificName": "Fouquieria splendens",
        "height": 500,
        "waterRequirement": "low",
        "description": "Spindly desert plant with bright red flowers.",
        "adaptations": [
          "Drought deciduous - drops leaves during dry periods",
          "Grows leaves quickly after rain",
          "Deep tap root",
          "Waxy coating on stems",
          "Thorns for protection"
        ]
      }
    },
    {
      "id": "brittlebush",
      "type": "plant",
      "label": "Brittlebush",
      "attributes": {
        "name": "Brittlebush",
        "scientificName": "Encelia farinosa",
        "height": 150,
        "waterRequirement": "very low",
        "description": "Common desert shrub with silvery leaves and yellow flowers.",
        "adaptations": [
          "Resinous sap seals wounds to prevent water loss",
          "Light-colored leaves reflect sunlight",
          "Dense leaf hairs (trichomes) reduce water loss",
          "Seasonal leaf drop during extreme drought",
          "Quick response to rainfall with new growth"
        ]
      }
    },
    {
      "id": "desert_ironwood",
      "type": "plant",
      "label": "Desert Ironwood",
      "attributes": {
        "name": "Desert Ironwood",
        "scientificName": "Olneya tesota",
        "height": 1000,
        "waterRequirement": "low",
        "description": "Long-lived desert tree with extremely dense wood, can live 800+ years.",
        "adaptations": [
          "Nitrogen fixing capability improves soil",
          "Extremely deep root system",
          "Small, drought-deciduous leaves",
          "Dense wood stores water",
          "Provides \"nurse plant\" habitat for other species"
        ]
      }
    },
    {
      "id": "agave",
      "type": "plant",
      "label": "Century Plant",
      "attributes": {
        "name": "Century Plant",
        "scientificName": "Agave americana",
        "height": 200,
        "waterRequirement": "very low",
        "description": "Large succulent that flowers once at the end of its life.",
        "adaptations": [
          "CAM photosynthesis to conserve water",
          "Thick, waxy leaves reduce water loss",
          "Rosette form channels water to central root",
          "Fibrous leaf structure for structural support",
          "Monocarpic lifecycle (flowers once then dies)"
        ]
      }
    },
    {
      "id": "joshua_tree",
      "type": "plant",
      "label": "Joshua Tree",
      "attributes": {
        "name": "Joshua Tree",
        "scientificName": "Yucca brevifolia",
        "height": 1200,
        "waterRequirement": "low",
        "description": "Iconic tree-like yucca of the Mojave Desert with unique appearance.",
        "adaptations": [
          "Extensive shallow root system",
          "Thick, moisture-retaining trunk",
          "Waxy, spine-tipped leaves reduce water loss",
          "Specialized pollination relationship with yucca moth",
          "Slow growth rate conserves resources"
        ]
      }
    },
    {
      "id": "prickly_pear",
      "type": "plant",
      "label": "Prickly Pear Cactus",
      "attributes": {
        "name": "Prickly Pear Cactus",
        "scientificName": "Opuntia spp.",
        "height": 200,
        "waterRequirement": "very low",
        "description": "Flat-padded cacti with colorful fruits and sharp spines.",
        "adaptations": [
          "Flat pads maximize photosynthesis while minimizing surface area",
          "Waxy coating reduces water loss",
          "Shallow, extensive root system",
          "Spines protect from herbivores and provide shade"
        ]
      }
    },
    {
      "id": "cholla_cactus",
      "type": "plant",
      "label": "Cholla Cactus",
      "attributes": {
        "name": "Cholla Cactus",
        "scientificName": "Cylindropuntia spp.",
        "height": 300,
        "waterRequirement": "very low",
        "description": "Known for detachable barbed spines that easily attach to passersby.",
        "adaptations": [
          "Segmented structure allows for vegetative reproduction",
          "Dense, barbed spines deter predation",
          "Water storage in stem segments",
          "Shallow but extensive root system"
        ]
      }
    },
    {
      "id": "other_plants",
      "type": "plant",
      "label": "Various Desert Plants",
      "attributes": {
        "name": "Various Desert Plants",
        "description": "Collection of various smaller desert plants and grasses",
        "waterRequirement": "low to moderate",
        "adaptations": [
          "Various drought adaptations",
          "Seasonal growth patterns",
          "Seed dormancy during dry periods"
        ]
      }
    },
    {
      "id": "heat",
      "type": "abiotic_factor",
      "label": "Extreme Heat",
      "attributes": {
        "name": "Extreme Heat",
        "type": "climate",
        "description": "Daytime temperatures regularly exceeding 40°C (104°F) in summer.",
        "impact": "extreme"
      }
    },
    {
      "id": "temperature_variation",
      "type": "abiotic_factor",
      "label": "Temperature Variation",
      "attributes": {
        "name": "Temperature Variation",
        "type": "climate",
        "description": "Large daily temperature fluctuations, often exceeding 20°C between day and night.",
        "impact": "high"
      }
    },
    {
      "id": "aridity",
      "type": "abiotic_factor",
      "label": "Aridity",
      "attributes": {
        "name": "Aridity",
        "type": "climate",
        "description": "Low precipitation, typically less than 250mm annually, with high evaporation rates.",
        "impact": "extreme"
      }
    },
    {
      "id": "sand_dunes",
      "type": "abiotic_factor",
      "label": "Sand Dunes",
      "attributes": {
        "name": "Sand Dunes",
        "type": "geological",
        "description": "Mounds of windblown sand that can move and shift over time.",
        "impact": "high"
      }
    },
    {
      "id": "rocky_outcrops",
      "type": "abiotic_factor",
      "label": "Rocky Outcrops",
      "attributes": {
        "name": "Rocky Outcrops",
        "type": "geological",
        "description": "Exposed rock formations that provide shade and shelter.",
        "impact": "medium"
      }
    },
    {
      "id": "oasis",
      "type": "abiotic_factor",
      "label": "Oasis",
      "attributes": {
        "name": "Oasis",
        "type": "water",
        "description": "Isolated water source surrounded by desert, often fed by underground springs.",
        "impact": "high"
      }
    },
    {
      "id": "ephemeral_streams",
      "type": "abiotic_factor",
      "label": "Ephemeral Streams",
      "attributes": {
        "name": "Ephemeral Streams",
        "type": "water",
        "description": "Temporary waterways that flow only after rainfall events.",
        "impact": "medium"
      }
    },
    {
      "id": "sandy_soil",
      "type": "abiotic_factor",
      "label": "Sandy Soil",
      "attributes": {
        "name": "Sandy Soil",
        "type": "soil",
        "description": "Coarse-grained soil with poor water retention but good drainage.",
        "impact": "high"
      }
    },
    {
      "id": "desert_pavement",
      "type": "abiotic_factor",
      "label": "Desert Pavement",
      "attributes": {
        "name": "Desert Pavement",
        "type": "geological",
        "description": "Dense layer of pebbles and rocks at the surface, formed by wind removing fine particles.",
        "impact": "high"
      }
    },
    {
      "id": "desert_varnish",
      "type": "abiotic_factor",
      "label": "Desert Varnish",
      "attributes": {
        "name": "Desert Varnish",
        "type": "geological",
        "description": "Dark coating on exposed rock surfaces, composed of clay minerals with iron and manganese oxides.",
        "impact": "low"
      }
    },
    {
      "id": "playa",
      "type": "abiotic_factor",
      "label": "Playa",
      "attributes": {
        "name": "Playa",
        "type": "geological",
        "description": "Flat, dry lake bed that occasionally floods after heavy rain.",
        "impact": "medium"
      }
    },
    {
      "id": "flash_floods",
      "type": "abiotic_factor",
      "label": "Flash Floods",
      "attributes": {
        "name": "Flash Floods",
        "type": "water",
        "description": "Sudden, intense flooding events often occurring in desert washes after heavy rainfall.",
        "impact": "extreme"
      }
    },
    {
      "id": "wash",
      "type": "microhabitat",
      "label": "Desert Wash",
      "attributes": {
        "name": "Desert Wash",
        "description": "Dry streambed that carries water only after rainfall, often with distinct vegetation.",
        "type": "seasonal_wetland",
        "area": "variable",
        "soilMoisture": "higher than surroundings"
      }
    },
    {
      "id": "dune_field",
      "type": "microhabitat",
      "label": "Sand Dune Field",
      "attributes": {
        "name": "Sand Dune Field",
        "description": "Area of wind-deposited sand formations with specialized plant and animal communities.",
        "type": "aeolian",
        "area": "large",
        "soilMoisture": "extremely low"
      }
    },
    {
      "id": "rocky_slope",
      "type": "microhabitat",
      "label": "Rocky Slope",
      "attributes": {
        "name": "Rocky Slope",
        "description": "Elevated area with exposed bedrock and boulders, providing shade and shelter.",
        "type": "lithic",
        "area": "medium",
        "soilMoisture": "very low"
      }
    },
    {
      "id": "canyon",
      "type": "microhabitat",
      "label": "Desert Canyon",
      "attributes": {
        "name": "Desert Canyon",
        "description": "Deep, narrow channel with steep walls, often with increased moisture and biodiversity.",
        "type": "erosional",
        "area": "variable",
        "soilMoisture": "variable"
      }
    },
    {
      "id": "pollination_yucca",
      "type": "interaction",
      "label": "Yucca-Moth Pollination",
      "attributes": {
        "name": "Yucca-Moth Pollination",
        "description": "Specialized mutualistic relationship between yucca plants and yucca moths.",
        "type": "mutualism",
        "participants": [
          "joshua_tree",
          "yucca_moth"
        ],
        "strength": "obligate"
      }
    },
    {
      "id": "nurse_plant",
      "type": "interaction",
      "label": "Nurse Plant Relationship",
      "attributes": {
        "name": "Nurse Plant Relationship",
        "description": "Protection of seedlings by established desert plants providing shade and improved soil.",
        "type": "commensalism",
        "participants": [
          "desert_ironwood",
          "saguaro"
        ],
        "strength": "facultative"
      }
    },
    {
      "id": "seed_dispersal",
      "type": "interaction",
      "label": "Seed Dispersal",
      "attributes": {
        "name": "Seed Dispersal",
        "description": "Movement of plant seeds by desert animals, aiding plant reproduction and distribution.",
        "type": "mutualism",
        "participants": [
          "mesquite",
          "coyote"
        ],
        "strength": "facultative"
      }
    },
    {
      "id": "yucca_moth",
      "type": "animal",
      "label": "Yucca Moth",
      "attributes": {
        "name": "Yucca Moth",
        "scientificName": "Tegeticula yuccasella",
        "lifespan": 0.5,
        "diet": "herbivore",
        "status": "least concern",
        "description": "Small moth with specialized relationship with Joshua trees and other yuccas.",
        "adaptations": [
          "Specialized mouthparts for collecting pollen",
          "Ovipositor for laying eggs in yucca flowers",
          "Lifecycle synchronized with yucca flowering",
          "Larvae feed only on some yucca seeds, preserving others"
        ]
      }
    },
    {
      "id": "coyote",
      "type": "animal",
      "label": "Coyote",
      "attributes": {
        "name": "Coyote",
        "scientificName": "Canis latrans",
        "lifespan": 14,
        "diet": "omnivore",
        "status": "least concern",
        "description": "Adaptable canid found throughout North American deserts and beyond.",
        "adaptations": [
          "Can survive on minimal water obtained from prey",
          "Opportunistic feeding habits",
          "Highly adaptable to different habitats",
          "Active during cooler parts of day",
          "Efficient predator of small desert mammals"
        ]
      }
    }
  ],
  "links": [
    {
      "source": "camel",
      "target": "heat",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Physiological temperature regulation",
        "strength": "extreme"
      }
    },
    {
      "source": "fennec_fox",
      "target": "heat",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Large ears for heat dissipation",
        "strength": "strong"
      }
    },
    {
      "source": "darkling_beetle",
      "target": "aridity",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Water harvesting from air",
        "strength": "extreme"
      }
    },
    {
      "source": "sidewinder",
      "target": "sand_dunes",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Specialized locomotion",
        "strength": "extreme"
      }
    },
    {
      "source": "desert_tortoise",
      "target": "aridity",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Water storage in bladder",
        "strength": "extreme"
      }
    },
    {
      "source": "kangaroo_rat",
      "target": "aridity",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Metabolic water production",
        "strength": "extreme"
      }
    },
    {
      "source": "gila_monster",
      "target": "heat",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Fat storage and seasonal activity",
        "strength": "strong"
      }
    },
    {
      "source": "cactus_wren",
      "target": "heat",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Behavioral thermoregulation",
        "strength": "strong"
      }
    },
    {
      "source": "javelina",
      "target": "aridity",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Consumption of water-rich cacti",
        "strength": "moderate"
      }
    },
    {
      "source": "yucca_moth",
      "target": "aridity",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Short lifecycle synchronized with yucca flowering",
        "strength": "extreme"
      }
    },
    {
      "source": "coyote",
      "target": "aridity",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Obtaining moisture from prey",
        "strength": "strong"
      }
    },
    {
      "source": "saguaro",
      "target": "heat",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Pleated structure for expansion",
        "strength": "extreme"
      }
    },
    {
      "source": "barrel_cactus",
      "target": "aridity",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Water storage tissue",
        "strength": "extreme"
      }
    },
    {
      "source": "mesquite",
      "target": "aridity",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Deep root system",
        "strength": "extreme"
      }
    },
    {
      "source": "creosote_bush",
      "target": "aridity",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Resinous coating on leaves",
        "strength": "extreme"
      }
    },
    {
      "source": "ocotillo",
      "target": "temperature_variation",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Rapid leaf production after rain",
        "strength": "extreme"
      }
    },
    {
      "source": "brittlebush",
      "target": "heat",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Reflective leaf surfaces",
        "strength": "strong"
      }
    },
    {
      "source": "desert_ironwood",
      "target": "aridity",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "Dense wood tissue",
        "strength": "extreme"
      }
    },
    {
      "source": "agave",
      "target": "aridity",
      "type": "adapted_to",
      "attributes": {
        "adaptationMechanism": "CAM photosynthesis",
        "strength": "extreme"
      }
    },
    {
      "source": "joshua_tree",
      "target": "sandy_soil",
      "type": "grows_in",
      "attributes": {
        "frequency": "permanent",
        "dependency": "high"
      }
    },
    {
      "source": "sidewinder",
      "target": "dune_field",
      "type": "lives_in",
      "attributes": {
        "frequency": "permanent",
        "dependency": "high"
      }
    },
    {
      "source": "desert_tortoise",
      "target": "rocky_slope",
      "type": "lives_in",
      "attributes": {
        "frequency": "seasonal",
        "dependency": "medium"
      }
    },
    {
      "source": "cactus_wren",
      "target": "wash",
      "type": "lives_in",
      "attributes": {
        "frequency": "permanent",
        "dependency": "medium"
      }
    },
    {
      "source": "gila_monster",
      "target": "rocky_slope",
      "type": "lives_in",
      "attributes": {
        "frequency": "permanent",
        "dependency": "high"
      }
    },
    {
      "source": "javelina",
      "target": "canyon",
      "type": "lives_in",
      "attributes": {
        "frequency": "permanent",
        "dependency": "medium"
      }
    },
    {
      "source": "kangaroo_rat",
      "target": "dune_field",
      "type": "lives_in",
      "attributes": {
        "frequency": "permanent",
        "dependency": "high"
      }
    },
    {
      "source": "scorpion",
      "target": "rocky_slope",
      "type": "lives_in",
      "attributes": {
        "frequency": "permanent",
        "dependency": "medium"
      }
    },
    {
      "source": "coyote",
      "target": "canyon",
      "type": "lives_in",
      "attributes": {
        "frequency": "permanent",
        "dependency": "low"
      }
    },
    {
      "source": "saguaro",
      "target": "rocky_slope",
      "type": "grows_in",
      "attributes": {
        "frequency": "permanent",
        "dependency": "medium"
      }
    },
    {
      "source": "mesquite",
      "target": "wash",
      "type": "grows_in",
      "attributes": {
        "frequency": "permanent",
        "dependency": "high"
      }
    },
    {
      "source": "desert_ironwood",
      "target": "wash",
      "type": "grows_in",
      "attributes": {
        "frequency": "permanent",
        "dependency": "medium"
      }
    },
    {
      "source": "brittlebush",
      "target": "rocky_slope",
      "type": "grows_in",
      "attributes": {
        "frequency": "permanent",
        "dependency": "medium"
      }
    },
    {
      "source": "coyote",
      "target": "kangaroo_rat",
      "type": "preys_on",
      "attributes": {
        "frequency": "common",
        "method": "hunting"
      }
    },
    {
      "source": "coyote",
      "target": "desert_tortoise",
      "type": "preys_on",
      "attributes": {
        "frequency": "rare",
        "method": "opportunistic"
      }
    },
    {
      "source": "sidewinder",
      "target": "kangaroo_rat",
      "type": "preys_on",
      "attributes": {
        "frequency": "common",
        "method": "ambush"
      }
    },
    {
      "source": "desert_monitor",
      "target": "scorpion",
      "type": "preys_on",
      "attributes": {
        "frequency": "occasional",
        "method": "hunting"
      }
    },
    {
      "source": "gila_monster",
      "target": "cactus_wren",
      "type": "preys_on",
      "attributes": {
        "frequency": "occasional",
        "method": "raiding nests"
      }
    },
    {
      "source": "roadrunner",
      "target": "scorpion",
      "type": "preys_on",
      "attributes": {
        "frequency": "common",
        "method": "hunting"
      }
    },
    {
      "source": "roadrunner",
      "target": "sidewinder",
      "type": "preys_on",
      "attributes": {
        "frequency": "occasional",
        "method": "hunting"
      }
    },
    {
      "source": "javelina",
      "target": "prickly_pear",
      "type": "consumes",
      "attributes": {
        "frequency": "common",
        "method": "grazing"
      }
    },
    {
      "source": "desert_tortoise",
      "target": "desert_poppy",
      "type": "consumes",
      "attributes": {
        "frequency": "seasonal",
        "method": "grazing"
      }
    },
    {
      "source": "kangaroo_rat",
      "target": "mesquite",
      "type": "consumes",
      "attributes": {
        "frequency": "common",
        "method": "seed collection"
      }
    },
    {
      "source": "desert_ironwood",
      "target": "saguaro",
      "type": "nurses",
      "attributes": {
        "relationship": "provides shade and protection",
        "strength": "strong"
      }
    },
    {
      "source": "mesquite",
      "target": "desert_poppy",
      "type": "facilitates",
      "attributes": {
        "relationship": "improves soil conditions",
        "strength": "moderate"
      }
    },
    {
      "source": "creosote_bush",
      "target": "other_plants",
      "type": "inhibits",
      "attributes": {
        "relationship": "allelopathy",
        "strength": "strong",
        "description": "Creosote bushes release toxins that inhibit growth of other plants nearby"
      }
    },
    {
      "source": "joshua_tree",
      "target": "yucca_moth",
      "type": "mutual_dependency",
      "attributes": {
        "relationship": "obligate reproductive site",
        "strength": "extreme"
      }
    },
    {
      "source": "yucca_moth",
      "target": "joshua_tree",
      "type": "mutual_dependency",
      "attributes": {
        "relationship": "obligate reproductive site",
        "strength": "extreme"
      }
    }
  ]
};

// Color mapping function
function getColorByType(type) {
  const colors = {
    person: '#4285F4',     // Google Blue
    project: '#EA4335',    // Google Red
    organization: '#FBBC04', // Google Yellow
    place: '#34A853',      // Google Green
    concept: '#9C27B0',    // Purple
    event: '#FF9800',      // Orange
    article: '#795548',    // Brown
    technology: '#607D8B', // Blue Grey
    default: '#9E9E9E'     // Grey
  };
  
  return colors[type] || colors.default;
}

// Initialize graph with data
function initializeGraph(data) {
  const container = document.getElementById('graph');
  if (!container) {
    console.error('Graph container not found');
    return;
  }
  
  // Calculate dimensions
  const containerWidth = container.clientWidth || 800;
  const containerHeight = container.clientHeight || 600;
  const width = Math.min(containerWidth, window.innerWidth - 50);
  const height = Math.min(containerHeight, window.innerHeight - 200);
  
  // Create SVG container
  const svg = d3.select('#graph')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', [0, 0, width, height])
    .attr('preserveAspectRatio', 'xMidYMid meet');
  
  // Add a rect to capture zoom events
  svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'transparent');
  
  // Set up zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });
  
  svg.call(zoom);
  
  // Create container group for zoom
  const g = svg.append('g');
  
  // Add defs for markers (arrowheads)
  const defs = svg.append('defs');
  defs.append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 20)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#999');
  
  // Create force simulation
  const simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(40));
  
  // Create container for links
  const link = g.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(data.links)
    .join('line')
    .attr('class', 'link')
    .attr('marker-end', 'url(#arrowhead)');
  
  // Create container for nodes
  const node = g.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(data.nodes)
    .join('g')
    .attr('class', 'node')
    .attr('data-id', d => d.id)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  // Add circles to nodes
  node.append('circle')
    .attr('r', 8)
    .attr('fill', d => getColorByType(d.type));
  
  // Add text labels to nodes
  node.append('text')
    .text(d => d.label)
    .attr('x', 12)
    .attr('y', 4)
    .attr('font-family', 'Helvetica, Arial, sans-serif')
    .attr('font-size', '12px')
    .attr('text-anchor', 'start');
  
  // Add title tooltips
  node.append('title')
    .text(d => `${d.label} (${d.type})`);
  
  // Update positions on simulation tick
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });
  
  // Add filter controls
  const typeFilters = document.getElementById('type-filters');
  if (typeFilters) {
    const entityTypes = [...new Set(data.nodes.map(d => d.type))];
    entityTypes.forEach(type => {
      const filterDiv = document.createElement('div');
      filterDiv.className = 'filter-item';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `filter-${type}`;
      checkbox.checked = true;
      checkbox.addEventListener('change', updateFilters);
      
      const label = document.createElement('label');
      label.htmlFor = `filter-${type}`;
      label.textContent = type;
      label.style.color = getColorByType(type);
      
      filterDiv.appendChild(checkbox);
      filterDiv.appendChild(label);
      typeFilters.appendChild(filterDiv);
    });
  }
  
  function updateFilters() {
    const typeFilters = document.getElementById('type-filters');
    if (!typeFilters) return;
    
    const visibleTypes = [];
    Array.from(typeFilters.querySelectorAll('input')).forEach(input => {
      if (input.checked) {
        const type = input.id.replace('filter-', '');
        visibleTypes.push(type);
      }
    });
    
    node.classed('hidden', d => !visibleTypes.includes(d.type));
    link.classed('hidden', d => {
      const sourceNode = data.nodes.find(node => node.id === (d.source.id || d.source));
      const targetNode = data.nodes.find(node => node.id === (d.target.id || d.target));
      return !sourceNode || !targetNode || 
             !visibleTypes.includes(sourceNode.type) || 
             !visibleTypes.includes(targetNode.type);
    });
  }
  
  // Setup zoom controls
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const zoomResetBtn = document.getElementById('zoom-reset');
  const clearFiltersBtn = document.getElementById('clear-filters');
  
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      svg.transition().duration(300).call(zoom.scaleBy, 1.5);
    });
  }
  
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      svg.transition().duration(300).call(zoom.scaleBy, 0.75);
    });
  }
  
  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => {
      svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
    });
  }
  
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      const typeFilters = document.getElementById('type-filters');
      if (typeFilters) {
        Array.from(typeFilters.querySelectorAll('input')).forEach(input => {
          input.checked = true;
        });
        updateFilters();
      }
    });
  }
  
  // Implement node selection functionality
  node.on('click', (event, d) => {
    // Reset all nodes and links
    node.classed('selected', false).classed('neighbor', false);
    link.classed('highlighted', false);
    
    // Highlight selected node
    d3.select(event.currentTarget).classed('selected', true);
    
    // Find and highlight connected nodes and links
    link.each(function(l) {
      if ((l.source.id === d.id || l.source === d.id) || 
          (l.target.id === d.id || l.target === d.id)) {
        d3.select(this).classed('highlighted', true);
        const otherId = (l.source.id === d.id || l.source === d.id) ? 
          (l.target.id || l.target) : (l.source.id || l.source);
        d3.select('[data-id="' + otherId + '"]').classed('neighbor', true);
      }
    });
  });
  
  // Double-click to open entity page
  node.on('dblclick', (event, d) => {
    window.location.href = d.id + '.html';
  });
  
  // Drag functions
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

// Initialize the visualization when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeGraph(data);
});
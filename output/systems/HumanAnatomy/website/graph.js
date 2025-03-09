// Graph visualization data
const data = {
  "nodes": [
    {
      "id": "circulatory_system",
      "type": "system",
      "label": "Circulatory System",
      "attributes": {
        "name": "Circulatory System",
        "description": "The system that circulates blood throughout the body, delivering oxygen and nutrients to cells and removing waste products.",
        "functions": [
          "Oxygen transport",
          "Nutrient delivery",
          "Waste removal",
          "Hormone transport",
          "Temperature regulation",
          "Immune defense"
        ],
        "volume": "5 liters of blood (average adult)"
      }
    },
    {
      "id": "respiratory_system",
      "type": "system",
      "label": "Respiratory System",
      "attributes": {
        "name": "Respiratory System",
        "description": "The system responsible for gas exchange, taking in oxygen and expelling carbon dioxide.",
        "functions": [
          "Gas exchange",
          "pH regulation",
          "Voice production",
          "Olfaction support"
        ],
        "capacity": "4-6 liters (average adult lung capacity)"
      }
    },
    {
      "id": "nervous_system",
      "type": "system",
      "label": "Nervous System",
      "attributes": {
        "name": "Nervous System",
        "description": "The complex network that coordinates body activities by transmitting signals between different body parts.",
        "functions": [
          "Sensory processing",
          "Motor control",
          "Cognition",
          "Memory",
          "Homeostasis regulation"
        ],
        "components": [
          "Central nervous system",
          "Peripheral nervous system",
          "Autonomic nervous system"
        ],
        "neurons": "Approximately 86 billion neurons"
      }
    },
    {
      "id": "skeletal_system",
      "type": "system",
      "label": "Skeletal System",
      "attributes": {
        "name": "Skeletal System",
        "description": "The framework of bones and connective tissues that supports the body, protects organs, and enables movement.",
        "functions": [
          "Structural support",
          "Organ protection",
          "Movement facilitation",
          "Blood cell production",
          "Mineral storage"
        ],
        "boneCount": 206
      }
    },
    {
      "id": "muscular_system",
      "type": "system",
      "label": "Muscular System",
      "attributes": {
        "name": "Muscular System",
        "description": "The system of muscles that enables movement, maintains posture, and generates heat.",
        "functions": [
          "Movement",
          "Posture maintenance",
          "Joint stabilization",
          "Heat production"
        ],
        "muscleCount": "Over 600 named muscles",
        "types": [
          "Skeletal muscle",
          "Smooth muscle",
          "Cardiac muscle"
        ]
      }
    },
    {
      "id": "digestive_system",
      "type": "system",
      "label": "Digestive System",
      "attributes": {
        "name": "Digestive System",
        "description": "The system that breaks down food into nutrients for absorption and eliminates waste.",
        "functions": [
          "Food breakdown",
          "Nutrient absorption",
          "Waste elimination"
        ],
        "length": "About 9 meters (30 feet) from mouth to anus"
      }
    },
    {
      "id": "endocrine_system",
      "type": "system",
      "label": "Endocrine System",
      "attributes": {
        "name": "Endocrine System",
        "description": "The collection of glands that produce hormones to regulate metabolism, growth, development, and other functions.",
        "functions": [
          "Hormone production",
          "Metabolism regulation",
          "Growth and development",
          "Mood regulation"
        ],
        "majorGlands": [
          "Pituitary",
          "Thyroid",
          "Parathyroid",
          "Adrenal",
          "Pancreas",
          "Gonads",
          "Pineal"
        ]
      }
    },
    {
      "id": "immune_system",
      "type": "system",
      "label": "Immune System",
      "attributes": {
        "name": "Immune System",
        "description": "The complex network that defends the body against pathogens and other threats.",
        "functions": [
          "Pathogen defense",
          "Wound healing",
          "Foreign substance detection",
          "Cancer surveillance"
        ],
        "components": [
          "White blood cells",
          "Antibodies",
          "Lymphatic system",
          "Spleen",
          "Thymus",
          "Bone marrow"
        ]
      }
    },
    {
      "id": "heart",
      "type": "organ",
      "label": "Heart",
      "attributes": {
        "name": "Heart",
        "description": "A muscular organ that pumps blood through the circulatory system by rhythmic contraction and dilation.",
        "weight": "250-350 grams",
        "location": "Mediastinum, left of midline",
        "chambers": [
          "Right atrium",
          "Right ventricle",
          "Left atrium",
          "Left ventricle"
        ],
        "beatRate": "60-100 beats per minute (at rest)"
      }
    },
    {
      "id": "lungs",
      "type": "organ",
      "label": "Lungs",
      "attributes": {
        "name": "Lungs",
        "description": "The primary organs of respiration, where gas exchange occurs between the air and blood.",
        "count": 2,
        "location": "Thoracic cavity",
        "parts": [
          "Bronchi",
          "Bronchioles",
          "Alveoli",
          "Pleura"
        ],
        "respirationRate": "12-20 breaths per minute (at rest)"
      }
    },
    {
      "id": "brain",
      "type": "organ",
      "label": "Brain",
      "attributes": {
        "name": "Brain",
        "description": "The central organ of the nervous system, responsible for processing sensory information and controlling bodily functions and behaviors.",
        "weight": "1300-1400 grams (average adult)",
        "location": "Cranial cavity",
        "lobes": [
          "Frontal",
          "Parietal",
          "Temporal",
          "Occipital"
        ],
        "energyUse": "20% of body's oxygen and calories"
      }
    },
    {
      "id": "liver",
      "type": "organ",
      "label": "Liver",
      "attributes": {
        "name": "Liver",
        "description": "The largest internal organ, performing hundreds of functions including detoxification, protein synthesis, and digestion.",
        "weight": "1.5 kg (average adult)",
        "location": "Right upper quadrant of abdomen",
        "lobes": [
          "Right lobe",
          "Left lobe",
          "Caudate lobe",
          "Quadrate lobe"
        ],
        "functions": [
          "Detoxification",
          "Bile production",
          "Protein synthesis",
          "Glycogen storage"
        ]
      }
    },
    {
      "id": "kidneys",
      "type": "organ",
      "label": "Kidneys",
      "attributes": {
        "name": "Kidneys",
        "description": "Bean-shaped organs that filter blood to produce urine, regulate electrolytes, and maintain acid-base balance.",
        "count": 2,
        "location": "Posterior abdominal wall, retroperitoneal",
        "weight": "120-170 grams each",
        "filterRate": "About 120-150 quarts of blood daily"
      }
    },
    {
      "id": "stomach",
      "type": "organ",
      "label": "Stomach",
      "attributes": {
        "name": "Stomach",
        "description": "A muscular, hollow organ that holds food and begins the digestion of proteins.",
        "location": "Left upper quadrant of abdomen",
        "capacity": "1-2 liters",
        "pH": "1.5-3.5 (highly acidic)",
        "regions": [
          "Cardia",
          "Fundus",
          "Body",
          "Pylorus"
        ]
      }
    },
    {
      "id": "intestines",
      "type": "organ",
      "label": "Intestines",
      "attributes": {
        "name": "Intestines",
        "description": "The long, coiled tube where most digestion and nutrient absorption occurs.",
        "parts": [
          "Small intestine",
          "Large intestine"
        ],
        "smallIntestineLength": "6-7 meters",
        "largeIntestineLength": "1.5 meters",
        "location": "Abdominal cavity"
      }
    },
    {
      "id": "pancreas",
      "type": "organ",
      "label": "Pancreas",
      "attributes": {
        "name": "Pancreas",
        "description": "A glandular organ that secretes digestive enzymes and hormones like insulin and glucagon.",
        "location": "Retroperitoneal, behind stomach",
        "weight": "70-100 grams",
        "functions": [
          "Digestive enzyme production",
          "Hormone secretion",
          "Blood glucose regulation"
        ]
      }
    },
    {
      "id": "spleen",
      "type": "organ",
      "label": "Spleen",
      "attributes": {
        "name": "Spleen",
        "description": "An organ that filters blood and helps defend against pathogens as part of the immune system.",
        "location": "Left upper quadrant of abdomen",
        "weight": "150 grams (average adult)",
        "functions": [
          "Blood filtration",
          "Old red blood cell removal",
          "Immune response support",
          "Blood storage"
        ]
      }
    },
    {
      "id": "skull",
      "type": "bone",
      "label": "Skull",
      "attributes": {
        "name": "Skull",
        "description": "The bony structure that forms the head, encases the brain, and supports facial structures.",
        "boneCount": 22,
        "majorBones": [
          "Frontal bone",
          "Parietal bones",
          "Temporal bones",
          "Occipital bone",
          "Sphenoid bone",
          "Ethmoid bone"
        ],
        "functions": [
          "Brain protection",
          "Facial structure support",
          "Sensory organ housing"
        ]
      }
    },
    {
      "id": "vertebral_column",
      "type": "bone",
      "label": "Vertebral Column (Spine)",
      "attributes": {
        "name": "Vertebral Column (Spine)",
        "description": "The flexible column of vertebrae that protects the spinal cord and supports the head and body.",
        "vertebraeCount": 33,
        "regions": [
          "Cervical (7)",
          "Thoracic (12)",
          "Lumbar (5)",
          "Sacral (5 fused)",
          "Coccygeal (4 fused)"
        ],
        "length": "70-75 cm (adult)"
      }
    },
    {
      "id": "ribcage",
      "type": "bone",
      "label": "Ribcage",
      "attributes": {
        "name": "Ribcage",
        "description": "The bony cage formed by the sternum, ribs, and thoracic vertebrae that protects vital organs.",
        "ribPairs": 12,
        "types": [
          "True ribs (1-7)",
          "False ribs (8-10)",
          "Floating ribs (11-12)"
        ],
        "functions": [
          "Heart and lung protection",
          "Respiratory movement support"
        ]
      }
    },
    {
      "id": "femur",
      "type": "bone",
      "label": "Femur",
      "attributes": {
        "name": "Femur",
        "description": "The thigh bone, the longest and strongest bone in the human body.",
        "count": 2,
        "location": "Thigh",
        "length": "45-50 cm (adult)",
        "strength": "Can support 30 times body weight"
      }
    },
    {
      "id": "heart_muscle",
      "type": "muscle",
      "label": "Cardiac Muscle",
      "attributes": {
        "name": "Cardiac Muscle",
        "description": "Specialized involuntary muscle tissue found only in the heart, allowing for coordinated contractions.",
        "type": "Cardiac",
        "control": "Involuntary",
        "properties": [
          "Striated",
          "Self-excitable",
          "Resistant to fatigue",
          "Interconnected by intercalated discs"
        ],
        "function": "Blood pumping through rhythmic contractions"
      }
    },
    {
      "id": "diaphragm",
      "type": "muscle",
      "label": "Diaphragm",
      "attributes": {
        "name": "Diaphragm",
        "description": "A dome-shaped skeletal muscle that separates the thoracic and abdominal cavities and is essential for breathing.",
        "type": "Skeletal",
        "control": "Both voluntary and involuntary",
        "location": "Between thoracic and abdominal cavities",
        "function": "Primary muscle of respiration"
      }
    },
    {
      "id": "biceps_brachii",
      "type": "muscle",
      "label": "Biceps Brachii",
      "attributes": {
        "name": "Biceps Brachii",
        "description": "A large muscle located on the front of the upper arm, primarily responsible for forearm flexion and supination.",
        "type": "Skeletal",
        "control": "Voluntary",
        "location": "Anterior compartment of the upper arm",
        "function": "Forearm flexion and supination"
      }
    },
    {
      "id": "quadriceps",
      "type": "muscle",
      "label": "Quadriceps Femoris",
      "attributes": {
        "name": "Quadriceps Femoris",
        "description": "A group of four muscles on the front of the thigh that extend the knee.",
        "type": "Skeletal",
        "control": "Voluntary",
        "location": "Anterior thigh",
        "components": [
          "Rectus femoris",
          "Vastus lateralis",
          "Vastus medialis",
          "Vastus intermedius"
        ],
        "function": "Knee extension and hip flexion"
      }
    },
    {
      "id": "aorta",
      "type": "blood_vessel",
      "label": "Aorta",
      "attributes": {
        "name": "Aorta",
        "description": "The largest artery in the body, carrying oxygenated blood from the left ventricle of the heart to the body.",
        "type": "Artery",
        "diameter": "2.5-3.5 cm",
        "sections": [
          "Ascending aorta",
          "Aortic arch",
          "Descending thoracic aorta",
          "Abdominal aorta"
        ],
        "function": "Distribution of oxygenated blood throughout the body"
      }
    },
    {
      "id": "coronary_arteries",
      "type": "blood_vessel",
      "label": "Coronary Arteries",
      "attributes": {
        "name": "Coronary Arteries",
        "description": "The arteries that supply blood to the heart muscle.",
        "type": "Artery",
        "majorBranches": [
          "Left main coronary artery",
          "Left anterior descending artery",
          "Left circumflex artery",
          "Right coronary artery"
        ],
        "function": "Blood supply to cardiac muscle"
      }
    },
    {
      "id": "pulmonary_arteries",
      "type": "blood_vessel",
      "label": "Pulmonary Arteries",
      "attributes": {
        "name": "Pulmonary Arteries",
        "description": "The arteries that carry deoxygenated blood from the heart to the lungs.",
        "type": "Artery",
        "branches": [
          "Right pulmonary artery",
          "Left pulmonary artery"
        ],
        "uniqueProperty": "One of the few arteries carrying deoxygenated blood",
        "function": "Transport of deoxygenated blood to lungs for oxygenation"
      }
    },
    {
      "id": "vena_cava",
      "type": "blood_vessel",
      "label": "Vena Cava",
      "attributes": {
        "name": "Vena Cava",
        "description": "The largest veins in the body, returning deoxygenated blood to the right atrium of the heart.",
        "type": "Vein",
        "components": [
          "Superior vena cava",
          "Inferior vena cava"
        ],
        "diameter": "2-3 cm",
        "function": "Return of deoxygenated blood to the heart"
      }
    },
    {
      "id": "spinal_cord",
      "type": "nerve",
      "label": "Spinal Cord",
      "attributes": {
        "name": "Spinal Cord",
        "description": "The cylindrical bundle of nerve fibers that extends from the brain and is protected by the vertebral column.",
        "length": "45 cm (average adult)",
        "location": "Within the vertebral canal",
        "function": "Conduction of neural signals between brain and body, reflex center",
        "components": [
          "Grey matter",
          "White matter",
          "Central canal"
        ]
      }
    },
    {
      "id": "vagus_nerve",
      "type": "nerve",
      "label": "Vagus Nerve",
      "attributes": {
        "name": "Vagus Nerve",
        "description": "The 10th cranial nerve, with the widest distribution in the body, controlling parasympathetic functions.",
        "type": "Cranial nerve",
        "number": "CN X",
        "function": "Parasympathetic control of heart, lungs, digestive tract; sensory information from viscera",
        "length": "Extends from brainstem to abdomen"
      }
    },
    {
      "id": "sciatic_nerve",
      "type": "nerve",
      "label": "Sciatic Nerve",
      "attributes": {
        "name": "Sciatic Nerve",
        "description": "The largest and longest nerve in the body, running from the lower back down through the leg.",
        "type": "Peripheral nerve",
        "origin": "L4-S3 spinal nerves",
        "function": "Motor and sensory innervation of lower limb",
        "diameter": "About 2 cm at its widest"
      }
    },
    {
      "id": "hypothalamus",
      "type": "nerve_center",
      "label": "Hypothalamus",
      "attributes": {
        "name": "Hypothalamus",
        "description": "A small region of the brain that coordinates both the autonomic nervous system and the endocrine system.",
        "location": "Below thalamus, above brainstem",
        "weight": "About 4 grams",
        "functions": [
          "Temperature regulation",
          "Hunger and thirst control",
          "Sleep-wake cycles",
          "Hormone production",
          "Autonomic function regulation"
        ]
      }
    },
    {
      "id": "neuron",
      "type": "cell",
      "label": "Neuron",
      "attributes": {
        "name": "Neuron",
        "description": "The basic functional unit of the nervous system, specialized for transmitting information.",
        "components": [
          "Cell body",
          "Dendrites",
          "Axon",
          "Synaptic terminals"
        ],
        "types": [
          "Motor neurons",
          "Sensory neurons",
          "Interneurons"
        ],
        "function": "Signal transmission and processing",
        "count": "Approximately 86 billion in the human brain"
      }
    },
    {
      "id": "red_blood_cell",
      "type": "cell",
      "label": "Red Blood Cell (Erythrocyte)",
      "attributes": {
        "name": "Red Blood Cell (Erythrocyte)",
        "description": "The most common type of blood cell, responsible for oxygen transport.",
        "shape": "Biconcave disc",
        "diameter": "7-8 micrometers",
        "lifespan": "120 days",
        "count": "4.5-5.5 million per microliter of blood",
        "uniqueProperty": "No nucleus in mature form",
        "function": "Oxygen and carbon dioxide transport"
      }
    },
    {
      "id": "cardiomyocyte",
      "type": "cell",
      "label": "Cardiomyocyte",
      "attributes": {
        "name": "Cardiomyocyte",
        "description": "Cardiac muscle cells that make up the heart muscle.",
        "length": "100 micrometers",
        "width": "10-25 micrometers",
        "properties": [
          "Striated",
          "Contains many mitochondria",
          "Connected by intercalated discs"
        ],
        "function": "Heart contraction",
        "uniqueProperty": "Can contract without neural stimulation"
      }
    },
    {
      "id": "epithelial_tissue",
      "type": "tissue",
      "label": "Epithelial Tissue",
      "attributes": {
        "name": "Epithelial Tissue",
        "description": "The tissue that forms the outer layer of the body and lines organs and cavities.",
        "types": [
          "Simple squamous",
          "Simple cuboidal",
          "Simple columnar",
          "Stratified squamous",
          "Transitional"
        ],
        "functions": [
          "Protection",
          "Absorption",
          "Filtration",
          "Secretion"
        ],
        "location": "Skin surface, organ linings, gland secretory units"
      }
    }
  ],
  "links": [
    {
      "source": "circulatory_system",
      "target": "respiratory_system",
      "type": "interacts_with",
      "attributes": {
        "description": "Blood picks up oxygen and releases carbon dioxide in the lungs"
      }
    },
    {
      "source": "circulatory_system",
      "target": "nervous_system",
      "type": "regulated_by",
      "attributes": {
        "description": "Heart rate and blood pressure are regulated by the autonomic nervous system"
      }
    },
    {
      "source": "muscular_system",
      "target": "skeletal_system",
      "type": "attaches_to",
      "attributes": {
        "description": "Muscles attach to bones via tendons to enable movement"
      }
    },
    {
      "source": "heart",
      "target": "circulatory_system",
      "type": "part_of",
      "attributes": {
        "description": "The heart is the central pump of the circulatory system"
      }
    },
    {
      "source": "lungs",
      "target": "respiratory_system",
      "type": "part_of",
      "attributes": {
        "description": "The lungs are the primary organs of the respiratory system"
      }
    },
    {
      "source": "brain",
      "target": "nervous_system",
      "type": "part_of",
      "attributes": {
        "description": "The brain is the central organ of the nervous system"
      }
    },
    {
      "source": "skull",
      "target": "skeletal_system",
      "type": "part_of",
      "attributes": {
        "description": "The skull is part of the axial skeleton"
      }
    },
    {
      "source": "liver",
      "target": "digestive_system",
      "type": "part_of",
      "attributes": {
        "description": "The liver produces bile for digestion and processes nutrients"
      }
    },
    {
      "source": "kidneys",
      "target": "circulatory_system",
      "type": "interacts_with",
      "attributes": {
        "description": "The kidneys filter blood to maintain homeostasis"
      }
    },
    {
      "source": "skull",
      "target": "brain",
      "type": "protects",
      "attributes": {
        "description": "The skull forms a protective case around the brain"
      }
    },
    {
      "source": "ribcage",
      "target": "heart",
      "type": "protects",
      "attributes": {
        "description": "The ribcage forms a protective structure around the heart"
      }
    },
    {
      "source": "ribcage",
      "target": "lungs",
      "type": "protects",
      "attributes": {
        "description": "The ribcage forms a protective structure around the lungs"
      }
    },
    {
      "source": "vertebral_column",
      "target": "spinal_cord",
      "type": "protects",
      "attributes": {
        "description": "The vertebral column forms a protective tunnel for the spinal cord"
      }
    },
    {
      "source": "heart",
      "target": "aorta",
      "type": "connects_to",
      "attributes": {
        "description": "The aorta emerges from the left ventricle of the heart"
      }
    },
    {
      "source": "heart",
      "target": "vena_cava",
      "type": "connects_to",
      "attributes": {
        "description": "The vena cava returns blood to the right atrium of the heart"
      }
    },
    {
      "source": "coronary_arteries",
      "target": "heart",
      "type": "supplies",
      "attributes": {
        "description": "The coronary arteries deliver oxygenated blood to heart muscle"
      }
    },
    {
      "source": "pulmonary_arteries",
      "target": "lungs",
      "type": "connects_to",
      "attributes": {
        "description": "The pulmonary arteries carry deoxygenated blood from the heart to the lungs"
      }
    },
    {
      "source": "brain",
      "target": "spinal_cord",
      "type": "connects_to",
      "attributes": {
        "description": "The brain connects to the spinal cord at the brainstem"
      }
    },
    {
      "source": "vagus_nerve",
      "target": "heart",
      "type": "innervates",
      "attributes": {
        "description": "The vagus nerve provides parasympathetic innervation to the heart"
      }
    },
    {
      "source": "vagus_nerve",
      "target": "stomach",
      "type": "innervates",
      "attributes": {
        "description": "The vagus nerve provides parasympathetic innervation to the stomach"
      }
    },
    {
      "source": "hypothalamus",
      "target": "endocrine_system",
      "type": "regulates",
      "attributes": {
        "description": "The hypothalamus produces hormones and controls the pituitary gland"
      }
    },
    {
      "source": "heart_muscle",
      "target": "heart",
      "type": "composes",
      "attributes": {
        "description": "The heart is composed primarily of cardiac muscle tissue"
      }
    },
    {
      "source": "diaphragm",
      "target": "respiratory_system",
      "type": "enables",
      "attributes": {
        "description": "The diaphragm is the primary muscle of breathing"
      }
    },
    {
      "source": "biceps_brachii",
      "target": "femur",
      "type": "moves",
      "attributes": {
        "description": "The biceps brachii flex the forearm at the elbow"
      }
    },
    {
      "source": "neuron",
      "target": "nervous_system",
      "type": "composes",
      "attributes": {
        "description": "Neurons are the primary functional cells of the nervous system"
      }
    },
    {
      "source": "red_blood_cell",
      "target": "circulatory_system",
      "type": "functions_in",
      "attributes": {
        "description": "Red blood cells transport oxygen throughout the circulatory system"
      }
    },
    {
      "source": "cardiomyocyte",
      "target": "heart_muscle",
      "type": "composes",
      "attributes": {
        "description": "Cardiomyocytes are the muscle cells that make up heart tissue"
      }
    },
    {
      "source": "epithelial_tissue",
      "target": "lungs",
      "type": "lines",
      "attributes": {
        "description": "Epithelial tissue lines the airways of the lungs"
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
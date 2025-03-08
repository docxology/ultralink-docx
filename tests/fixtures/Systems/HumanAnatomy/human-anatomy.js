/**
 * Human Anatomy Test Fixtures
 * 
 * This module provides test data for human anatomical structures that demonstrates
 * UltraLink's capabilities for modeling complex biological systems. The example includes:
 * - Major organ systems
 * - Individual organs
 * - Bones and skeletal structures
 * - Muscles and muscle groups
 * - Blood vessels and circulatory components
 * - Nerves and neural structures
 * - Cellular and tissue components
 * - Functional relationships between anatomical structures
 */

const { UltraLink } = require('../../../../src');

/**
 * Create a complete human anatomy dataset
 * @returns {UltraLink} Populated UltraLink instance
 */
function createHumanAnatomyDataset() {
  const humanAnatomy = new UltraLink();
  
  // ====================================================
  // ORGAN SYSTEMS
  // ====================================================
  
  humanAnatomy.addEntity('circulatory_system', 'system', {
    name: 'Circulatory System',
    description: 'The system that circulates blood throughout the body, delivering oxygen and nutrients to cells and removing waste products.',
    functions: ['Oxygen transport', 'Nutrient delivery', 'Waste removal', 'Hormone transport', 'Temperature regulation', 'Immune defense'],
    volume: '5 liters of blood (average adult)'
  });
  
  humanAnatomy.addEntity('respiratory_system', 'system', {
    name: 'Respiratory System',
    description: 'The system responsible for gas exchange, taking in oxygen and expelling carbon dioxide.',
    functions: ['Gas exchange', 'pH regulation', 'Voice production', 'Olfaction support'],
    capacity: '4-6 liters (average adult lung capacity)'
  });
  
  humanAnatomy.addEntity('nervous_system', 'system', {
    name: 'Nervous System',
    description: 'The complex network that coordinates body activities by transmitting signals between different body parts.',
    functions: ['Sensory processing', 'Motor control', 'Cognition', 'Memory', 'Homeostasis regulation'],
    components: ['Central nervous system', 'Peripheral nervous system', 'Autonomic nervous system'],
    neurons: 'Approximately 86 billion neurons'
  });
  
  humanAnatomy.addEntity('skeletal_system', 'system', {
    name: 'Skeletal System',
    description: 'The framework of bones and connective tissues that supports the body, protects organs, and enables movement.',
    functions: ['Structural support', 'Organ protection', 'Movement facilitation', 'Blood cell production', 'Mineral storage'],
    boneCount: 206
  });
  
  humanAnatomy.addEntity('muscular_system', 'system', {
    name: 'Muscular System',
    description: 'The system of muscles that enables movement, maintains posture, and generates heat.',
    functions: ['Movement', 'Posture maintenance', 'Joint stabilization', 'Heat production'],
    muscleCount: 'Over 600 named muscles',
    types: ['Skeletal muscle', 'Smooth muscle', 'Cardiac muscle']
  });
  
  humanAnatomy.addEntity('digestive_system', 'system', {
    name: 'Digestive System',
    description: 'The system that breaks down food into nutrients for absorption and eliminates waste.',
    functions: ['Food breakdown', 'Nutrient absorption', 'Waste elimination'],
    length: 'About 9 meters (30 feet) from mouth to anus'
  });
  
  humanAnatomy.addEntity('endocrine_system', 'system', {
    name: 'Endocrine System',
    description: 'The collection of glands that produce hormones to regulate metabolism, growth, development, and other functions.',
    functions: ['Hormone production', 'Metabolism regulation', 'Growth and development', 'Mood regulation'],
    majorGlands: ['Pituitary', 'Thyroid', 'Parathyroid', 'Adrenal', 'Pancreas', 'Gonads', 'Pineal']
  });
  
  humanAnatomy.addEntity('immune_system', 'system', {
    name: 'Immune System',
    description: 'The complex network that defends the body against pathogens and other threats.',
    functions: ['Pathogen defense', 'Wound healing', 'Foreign substance detection', 'Cancer surveillance'],
    components: ['White blood cells', 'Antibodies', 'Lymphatic system', 'Spleen', 'Thymus', 'Bone marrow']
  });
  
  // ====================================================
  // MAJOR ORGANS
  // ====================================================
  
  humanAnatomy.addEntity('heart', 'organ', {
    name: 'Heart',
    description: 'A muscular organ that pumps blood through the circulatory system by rhythmic contraction and dilation.',
    weight: '250-350 grams',
    location: 'Mediastinum, left of midline',
    chambers: ['Right atrium', 'Right ventricle', 'Left atrium', 'Left ventricle'],
    beatRate: '60-100 beats per minute (at rest)'
  });
  
  humanAnatomy.addEntity('lungs', 'organ', {
    name: 'Lungs',
    description: 'The primary organs of respiration, where gas exchange occurs between the air and blood.',
    count: 2,
    location: 'Thoracic cavity',
    parts: ['Bronchi', 'Bronchioles', 'Alveoli', 'Pleura'],
    respirationRate: '12-20 breaths per minute (at rest)'
  });
  
  humanAnatomy.addEntity('brain', 'organ', {
    name: 'Brain',
    description: 'The central organ of the nervous system, responsible for processing sensory information and controlling bodily functions and behaviors.',
    weight: '1300-1400 grams (average adult)',
    location: 'Cranial cavity',
    lobes: ['Frontal', 'Parietal', 'Temporal', 'Occipital'],
    energyUse: '20% of body\'s oxygen and calories'
  });
  
  humanAnatomy.addEntity('liver', 'organ', {
    name: 'Liver',
    description: 'The largest internal organ, performing hundreds of functions including detoxification, protein synthesis, and digestion.',
    weight: '1.5 kg (average adult)',
    location: 'Right upper quadrant of abdomen',
    lobes: ['Right lobe', 'Left lobe', 'Caudate lobe', 'Quadrate lobe'],
    functions: ['Detoxification', 'Bile production', 'Protein synthesis', 'Glycogen storage']
  });
  
  humanAnatomy.addEntity('kidneys', 'organ', {
    name: 'Kidneys',
    description: 'Bean-shaped organs that filter blood to produce urine, regulate electrolytes, and maintain acid-base balance.',
    count: 2,
    location: 'Posterior abdominal wall, retroperitoneal',
    weight: '120-170 grams each',
    filterRate: 'About 120-150 quarts of blood daily'
  });
  
  humanAnatomy.addEntity('stomach', 'organ', {
    name: 'Stomach',
    description: 'A muscular, hollow organ that holds food and begins the digestion of proteins.',
    location: 'Left upper quadrant of abdomen',
    capacity: '1-2 liters',
    pH: '1.5-3.5 (highly acidic)',
    regions: ['Cardia', 'Fundus', 'Body', 'Pylorus']
  });
  
  humanAnatomy.addEntity('intestines', 'organ', {
    name: 'Intestines',
    description: 'The long, coiled tube where most digestion and nutrient absorption occurs.',
    parts: ['Small intestine', 'Large intestine'],
    smallIntestineLength: '6-7 meters',
    largeIntestineLength: '1.5 meters',
    location: 'Abdominal cavity'
  });
  
  humanAnatomy.addEntity('pancreas', 'organ', {
    name: 'Pancreas',
    description: 'A glandular organ that secretes digestive enzymes and hormones like insulin and glucagon.',
    location: 'Retroperitoneal, behind stomach',
    weight: '70-100 grams',
    functions: ['Digestive enzyme production', 'Hormone secretion', 'Blood glucose regulation']
  });
  
  humanAnatomy.addEntity('spleen', 'organ', {
    name: 'Spleen',
    description: 'An organ that filters blood and helps defend against pathogens as part of the immune system.',
    location: 'Left upper quadrant of abdomen',
    weight: '150 grams (average adult)',
    functions: ['Blood filtration', 'Old red blood cell removal', 'Immune response support', 'Blood storage']
  });
  
  // ====================================================
  // SKELETAL STRUCTURES
  // ====================================================
  
  humanAnatomy.addEntity('skull', 'bone', {
    name: 'Skull',
    description: 'The bony structure that forms the head, encases the brain, and supports facial structures.',
    boneCount: 22,
    majorBones: ['Frontal bone', 'Parietal bones', 'Temporal bones', 'Occipital bone', 'Sphenoid bone', 'Ethmoid bone'],
    functions: ['Brain protection', 'Facial structure support', 'Sensory organ housing']
  });
  
  humanAnatomy.addEntity('vertebral_column', 'bone', {
    name: 'Vertebral Column (Spine)',
    description: 'The flexible column of vertebrae that protects the spinal cord and supports the head and body.',
    vertebraeCount: 33,
    regions: ['Cervical (7)', 'Thoracic (12)', 'Lumbar (5)', 'Sacral (5 fused)', 'Coccygeal (4 fused)'],
    length: '70-75 cm (adult)'
  });
  
  humanAnatomy.addEntity('ribcage', 'bone', {
    name: 'Ribcage',
    description: 'The bony cage formed by the sternum, ribs, and thoracic vertebrae that protects vital organs.',
    ribPairs: 12,
    types: ['True ribs (1-7)', 'False ribs (8-10)', 'Floating ribs (11-12)'],
    functions: ['Heart and lung protection', 'Respiratory movement support']
  });
  
  humanAnatomy.addEntity('femur', 'bone', {
    name: 'Femur',
    description: 'The thigh bone, the longest and strongest bone in the human body.',
    count: 2,
    location: 'Thigh',
    length: '45-50 cm (adult)',
    strength: 'Can support 30 times body weight'
  });
  
  // ====================================================
  // MUSCULAR STRUCTURES
  // ====================================================
  
  humanAnatomy.addEntity('heart_muscle', 'muscle', {
    name: 'Cardiac Muscle',
    description: 'Specialized involuntary muscle tissue found only in the heart, allowing for coordinated contractions.',
    type: 'Cardiac',
    control: 'Involuntary',
    properties: ['Striated', 'Self-excitable', 'Resistant to fatigue', 'Interconnected by intercalated discs'],
    function: 'Blood pumping through rhythmic contractions'
  });
  
  humanAnatomy.addEntity('diaphragm', 'muscle', {
    name: 'Diaphragm',
    description: 'A dome-shaped skeletal muscle that separates the thoracic and abdominal cavities and is essential for breathing.',
    type: 'Skeletal',
    control: 'Both voluntary and involuntary',
    location: 'Between thoracic and abdominal cavities',
    function: 'Primary muscle of respiration'
  });
  
  humanAnatomy.addEntity('biceps_brachii', 'muscle', {
    name: 'Biceps Brachii',
    description: 'A large muscle located on the front of the upper arm, primarily responsible for forearm flexion and supination.',
    type: 'Skeletal',
    control: 'Voluntary',
    location: 'Anterior compartment of the upper arm',
    function: 'Forearm flexion and supination'
  });
  
  humanAnatomy.addEntity('quadriceps', 'muscle', {
    name: 'Quadriceps Femoris',
    description: 'A group of four muscles on the front of the thigh that extend the knee.',
    type: 'Skeletal',
    control: 'Voluntary',
    location: 'Anterior thigh',
    components: ['Rectus femoris', 'Vastus lateralis', 'Vastus medialis', 'Vastus intermedius'],
    function: 'Knee extension and hip flexion'
  });
  
  // ====================================================
  // BLOOD VESSELS
  // ====================================================
  
  humanAnatomy.addEntity('aorta', 'blood_vessel', {
    name: 'Aorta',
    description: 'The largest artery in the body, carrying oxygenated blood from the left ventricle of the heart to the body.',
    type: 'Artery',
    diameter: '2.5-3.5 cm',
    sections: ['Ascending aorta', 'Aortic arch', 'Descending thoracic aorta', 'Abdominal aorta'],
    function: 'Distribution of oxygenated blood throughout the body'
  });
  
  humanAnatomy.addEntity('coronary_arteries', 'blood_vessel', {
    name: 'Coronary Arteries',
    description: 'The arteries that supply blood to the heart muscle.',
    type: 'Artery',
    majorBranches: ['Left main coronary artery', 'Left anterior descending artery', 'Left circumflex artery', 'Right coronary artery'],
    function: 'Blood supply to cardiac muscle'
  });
  
  humanAnatomy.addEntity('pulmonary_arteries', 'blood_vessel', {
    name: 'Pulmonary Arteries',
    description: 'The arteries that carry deoxygenated blood from the heart to the lungs.',
    type: 'Artery',
    branches: ['Right pulmonary artery', 'Left pulmonary artery'],
    uniqueProperty: 'One of the few arteries carrying deoxygenated blood',
    function: 'Transport of deoxygenated blood to lungs for oxygenation'
  });
  
  humanAnatomy.addEntity('vena_cava', 'blood_vessel', {
    name: 'Vena Cava',
    description: 'The largest veins in the body, returning deoxygenated blood to the right atrium of the heart.',
    type: 'Vein',
    components: ['Superior vena cava', 'Inferior vena cava'],
    diameter: '2-3 cm',
    function: 'Return of deoxygenated blood to the heart'
  });
  
  // ====================================================
  // NEURAL STRUCTURES
  // ====================================================
  
  humanAnatomy.addEntity('spinal_cord', 'nerve', {
    name: 'Spinal Cord',
    description: 'The cylindrical bundle of nerve fibers that extends from the brain and is protected by the vertebral column.',
    length: '45 cm (average adult)',
    location: 'Within the vertebral canal',
    function: 'Conduction of neural signals between brain and body, reflex center',
    components: ['Grey matter', 'White matter', 'Central canal']
  });
  
  humanAnatomy.addEntity('vagus_nerve', 'nerve', {
    name: 'Vagus Nerve',
    description: 'The 10th cranial nerve, with the widest distribution in the body, controlling parasympathetic functions.',
    type: 'Cranial nerve',
    number: 'CN X',
    function: 'Parasympathetic control of heart, lungs, digestive tract; sensory information from viscera',
    length: 'Extends from brainstem to abdomen'
  });
  
  humanAnatomy.addEntity('sciatic_nerve', 'nerve', {
    name: 'Sciatic Nerve',
    description: 'The largest and longest nerve in the body, running from the lower back down through the leg.',
    type: 'Peripheral nerve',
    origin: 'L4-S3 spinal nerves',
    function: 'Motor and sensory innervation of lower limb',
    diameter: 'About 2 cm at its widest'
  });
  
  humanAnatomy.addEntity('hypothalamus', 'nerve_center', {
    name: 'Hypothalamus',
    description: 'A small region of the brain that coordinates both the autonomic nervous system and the endocrine system.',
    location: 'Below thalamus, above brainstem',
    weight: 'About 4 grams',
    functions: ['Temperature regulation', 'Hunger and thirst control', 'Sleep-wake cycles', 'Hormone production', 'Autonomic function regulation']
  });
  
  // ====================================================
  // CELLULAR COMPONENTS
  // ====================================================
  
  humanAnatomy.addEntity('neuron', 'cell', {
    name: 'Neuron',
    description: 'The basic functional unit of the nervous system, specialized for transmitting information.',
    components: ['Cell body', 'Dendrites', 'Axon', 'Synaptic terminals'],
    types: ['Motor neurons', 'Sensory neurons', 'Interneurons'],
    function: 'Signal transmission and processing',
    count: 'Approximately 86 billion in the human brain'
  });
  
  humanAnatomy.addEntity('red_blood_cell', 'cell', {
    name: 'Red Blood Cell (Erythrocyte)',
    description: 'The most common type of blood cell, responsible for oxygen transport.',
    shape: 'Biconcave disc',
    diameter: '7-8 micrometers',
    lifespan: '120 days',
    count: '4.5-5.5 million per microliter of blood',
    uniqueProperty: 'No nucleus in mature form',
    function: 'Oxygen and carbon dioxide transport'
  });
  
  humanAnatomy.addEntity('cardiomyocyte', 'cell', {
    name: 'Cardiomyocyte',
    description: 'Cardiac muscle cells that make up the heart muscle.',
    length: '100 micrometers',
    width: '10-25 micrometers',
    properties: ['Striated', 'Contains many mitochondria', 'Connected by intercalated discs'],
    function: 'Heart contraction',
    uniqueProperty: 'Can contract without neural stimulation'
  });
  
  humanAnatomy.addEntity('epithelial_tissue', 'tissue', {
    name: 'Epithelial Tissue',
    description: 'The tissue that forms the outer layer of the body and lines organs and cavities.',
    types: ['Simple squamous', 'Simple cuboidal', 'Simple columnar', 'Stratified squamous', 'Transitional'],
    functions: ['Protection', 'Absorption', 'Filtration', 'Secretion'],
    location: 'Skin surface, organ linings, gland secretory units'
  });
  
  // ====================================================
  // RELATIONSHIPS
  // ====================================================
  
  // System relationships
  humanAnatomy.addLink('circulatory_system', 'respiratory_system', 'interacts_with', { 
    description: 'Blood picks up oxygen and releases carbon dioxide in the lungs' 
  });
  
  humanAnatomy.addLink('circulatory_system', 'nervous_system', 'regulated_by', {
    description: 'Heart rate and blood pressure are regulated by the autonomic nervous system'
  });
  
  humanAnatomy.addLink('muscular_system', 'skeletal_system', 'attaches_to', {
    description: 'Muscles attach to bones via tendons to enable movement'
  });
  
  // Organs within systems
  humanAnatomy.addLink('heart', 'circulatory_system', 'part_of', {
    description: 'The heart is the central pump of the circulatory system'
  });
  
  humanAnatomy.addLink('lungs', 'respiratory_system', 'part_of', {
    description: 'The lungs are the primary organs of the respiratory system'
  });
  
  humanAnatomy.addLink('brain', 'nervous_system', 'part_of', {
    description: 'The brain is the central organ of the nervous system'
  });
  
  humanAnatomy.addLink('skull', 'skeletal_system', 'part_of', {
    description: 'The skull is part of the axial skeleton'
  });
  
  humanAnatomy.addLink('liver', 'digestive_system', 'part_of', {
    description: 'The liver produces bile for digestion and processes nutrients'
  });
  
  humanAnatomy.addLink('kidneys', 'circulatory_system', 'interacts_with', {
    description: 'The kidneys filter blood to maintain homeostasis'
  });
  
  // Protection relationships
  humanAnatomy.addLink('skull', 'brain', 'protects', {
    description: 'The skull forms a protective case around the brain'
  });
  
  humanAnatomy.addLink('ribcage', 'heart', 'protects', {
    description: 'The ribcage forms a protective structure around the heart'
  });
  
  humanAnatomy.addLink('ribcage', 'lungs', 'protects', {
    description: 'The ribcage forms a protective structure around the lungs'
  });
  
  humanAnatomy.addLink('vertebral_column', 'spinal_cord', 'protects', {
    description: 'The vertebral column forms a protective tunnel for the spinal cord'
  });
  
  // Blood vessel relationships
  humanAnatomy.addLink('heart', 'aorta', 'connects_to', {
    description: 'The aorta emerges from the left ventricle of the heart'
  });
  
  humanAnatomy.addLink('heart', 'vena_cava', 'connects_to', {
    description: 'The vena cava returns blood to the right atrium of the heart'
  });
  
  humanAnatomy.addLink('coronary_arteries', 'heart', 'supplies', {
    description: 'The coronary arteries deliver oxygenated blood to heart muscle'
  });
  
  humanAnatomy.addLink('pulmonary_arteries', 'lungs', 'connects_to', {
    description: 'The pulmonary arteries carry deoxygenated blood from the heart to the lungs'
  });
  
  // Neural relationships
  humanAnatomy.addLink('brain', 'spinal_cord', 'connects_to', {
    description: 'The brain connects to the spinal cord at the brainstem'
  });
  
  humanAnatomy.addLink('vagus_nerve', 'heart', 'innervates', {
    description: 'The vagus nerve provides parasympathetic innervation to the heart'
  });
  
  humanAnatomy.addLink('vagus_nerve', 'stomach', 'innervates', {
    description: 'The vagus nerve provides parasympathetic innervation to the stomach'
  });
  
  humanAnatomy.addLink('hypothalamus', 'endocrine_system', 'regulates', {
    description: 'The hypothalamus produces hormones and controls the pituitary gland'
  });
  
  // Muscle relationships
  humanAnatomy.addLink('heart_muscle', 'heart', 'composes', {
    description: 'The heart is composed primarily of cardiac muscle tissue'
  });
  
  humanAnatomy.addLink('diaphragm', 'respiratory_system', 'enables', {
    description: 'The diaphragm is the primary muscle of breathing'
  });
  
  humanAnatomy.addLink('biceps_brachii', 'femur', 'moves', {
    description: 'The biceps brachii flex the forearm at the elbow'
  });
  
  // Cellular relationships
  humanAnatomy.addLink('neuron', 'nervous_system', 'composes', {
    description: 'Neurons are the primary functional cells of the nervous system'
  });
  
  humanAnatomy.addLink('red_blood_cell', 'circulatory_system', 'functions_in', {
    description: 'Red blood cells transport oxygen throughout the circulatory system'
  });
  
  humanAnatomy.addLink('cardiomyocyte', 'heart_muscle', 'composes', {
    description: 'Cardiomyocytes are the muscle cells that make up heart tissue'
  });
  
  humanAnatomy.addLink('epithelial_tissue', 'lungs', 'lines', {
    description: 'Epithelial tissue lines the airways of the lungs'
  });
  
  return humanAnatomy;
}

// Export the dataset creation function
module.exports = {
  createHumanAnatomyDataset
}; 
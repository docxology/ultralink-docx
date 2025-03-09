/**
 * Car System Test Fixtures
 * 
 * This module provides test data for a car engineering system that demonstrates
 * UltraLink's capabilities across different export formats. The example includes:
 * - Major car components (engine, transmission, chassis, etc.)
 * - Detailed subcomponents in nested hierarchies
 * - Engineering specifications and relationships
 * - Manufacturing and maintenance information
 * - Technical dependencies between components
 */

const { UltraLink } = require('../../../../src');

/**
 * Create a complete car engineering dataset
 * @returns {UltraLink} Populated UltraLink instance
 */
function createCarDataset() {
  const ultralink = new UltraLink();
  
  // Main Car
  const car = ultralink.addEntity('sedan-model', 'vehicle', {
    name: 'Sedan XR5',
    type: 'Sedan',
    description: 'Mid-size family sedan with modern features',
    year: '2023',
    dimensions: {
      length: '4.8m',
      width: '1.8m',
      height: '1.5m'
    },
    weight: '1500kg',
    fuelType: 'Hybrid',
    fuelEfficiency: '18km/l',
    engineSize: '2.0L',
    status: 'production'
  });
  
  // Main Components
  
  // Engine System
  const engine = ultralink.addEntity('engine-system', 'component', {
    name: 'Hybrid Engine System',
    componentType: 'Engine',
    description: '2.0L hybrid engine with electric motor assistance',
    partNumber: 'ENG2023-H20',
    weight: '180kg',
    dimensions: {
      length: '0.65m',
      width: '0.58m',
      height: '0.62m'
    },
    manufacturer: 'PowerTech Industries',
    status: 'active'
  });
  
  // Engine Subcomponents
  const engineBlock = ultralink.addEntity('engine-block', 'component', {
    name: 'Engine Block',
    componentType: 'Engine Part',
    description: 'Main engine block housing for cylinders',
    partNumber: 'EB2023-H20',
    material: 'Aluminum Alloy',
    cylinders: 4,
    weight: '75kg',
    manufacturer: 'PowerTech Industries',
    status: 'active'
  });
  
  const pistons = ultralink.addEntity('pistons', 'component', {
    name: 'Piston Assembly',
    componentType: 'Engine Part',
    description: 'Set of 4 pistons with connecting rods',
    partNumber: 'PA2023-4C',
    material: 'Forged Steel',
    count: 4,
    weight: '12kg',
    manufacturer: 'PowerTech Industries',
    status: 'active'
  });
  
  const fuelInjection = ultralink.addEntity('fuel-injection', 'component', {
    name: 'Fuel Injection System',
    componentType: 'Engine Part',
    description: 'Direct injection system for fuel delivery',
    partNumber: 'FI2023-DI',
    type: 'Direct Injection',
    pressure: '200bar',
    weight: '8kg',
    manufacturer: 'FuelTech Systems',
    status: 'active'
  });
  
  const electricMotor = ultralink.addEntity('electric-motor', 'component', {
    name: 'Electric Assist Motor',
    componentType: 'Hybrid System',
    description: 'Electric motor for hybrid operation',
    partNumber: 'EM2023-45',
    power: '45kW',
    voltage: '240V',
    weight: '25kg',
    manufacturer: 'ElectroDrive Inc',
    status: 'active'
  });
  
  // Transmission System
  const transmission = ultralink.addEntity('transmission-system', 'component', {
    name: 'CVT Transmission',
    componentType: 'Transmission',
    description: 'Continuously Variable Transmission system',
    partNumber: 'TR2023-CVT',
    type: 'CVT',
    gearRatios: 'Continuously Variable',
    weight: '90kg',
    manufacturer: 'TransTech Auto',
    status: 'active'
  });
  
  // Transmission Subcomponents
  const cvtBelt = ultralink.addEntity('cvt-belt', 'component', {
    name: 'CVT Belt',
    componentType: 'Transmission Part',
    description: 'Main belt for continuously variable transmission',
    partNumber: 'CB2023-H1',
    material: 'High-Strength Polymer',
    weight: '5kg',
    manufacturer: 'TransTech Auto',
    status: 'active'
  });
  
  const torqueConverter = ultralink.addEntity('torque-converter', 'component', {
    name: 'Torque Converter',
    componentType: 'Transmission Part',
    description: 'Hydraulic torque converter for CVT system',
    partNumber: 'TC2023-H1',
    diameter: '28cm',
    weight: '15kg',
    manufacturer: 'TransTech Auto',
    status: 'active'
  });
  
  // Chassis System
  const chassis = ultralink.addEntity('chassis-system', 'component', {
    name: 'Chassis and Frame',
    componentType: 'Chassis',
    description: 'Unibody chassis with reinforced safety frame',
    partNumber: 'CH2023-UB',
    material: 'High-Strength Steel with Aluminum Components',
    weight: '320kg',
    manufacturer: 'FrameTech Engineering',
    status: 'active'
  });
  
  // Interior System
  const interior = ultralink.addEntity('interior-system', 'component', {
    name: 'Interior System',
    componentType: 'Interior',
    description: 'Complete interior setup including dash, seats, and trim',
    partNumber: 'INT2023-STD',
    capacity: '5 passengers',
    weight: '180kg',
    manufacturer: 'ComfortDesign Interiors',
    status: 'active'
  });
  
  // Interior Subcomponents
  const dashboard = ultralink.addEntity('dashboard', 'component', {
    name: 'Dashboard Assembly',
    componentType: 'Interior Part',
    description: 'Main dashboard with instrument cluster and controls',
    partNumber: 'DA2023-DX',
    features: ['Digital Display', 'Touch Controls', 'Climate Interface'],
    weight: '25kg',
    manufacturer: 'ComfortDesign Interiors',
    status: 'active'
  });
  
  const seats = ultralink.addEntity('seats', 'component', {
    name: 'Seating System',
    componentType: 'Interior Part',
    description: 'Full set of 5 seats with adjustable features',
    partNumber: 'SS2023-5S',
    material: 'Synthetic Leather',
    features: ['Heating', 'Power Adjustment', 'Memory Settings'],
    weight: '85kg',
    manufacturer: 'ComfortDesign Interiors',
    status: 'active'
  });
  
  const infotainment = ultralink.addEntity('infotainment', 'component', {
    name: 'Infotainment System',
    componentType: 'Electronics',
    description: '10-inch touchscreen with navigation and media',
    partNumber: 'INF2023-10T',
    screenSize: '10 inches',
    features: ['Navigation', 'Smartphone Integration', 'Voice Control'],
    weight: '5kg',
    manufacturer: 'TechTouch Electronics',
    status: 'active'
  });
  
  // Wheels and Tires
  const wheelSystem = ultralink.addEntity('wheel-system', 'component', {
    name: 'Wheels and Tires',
    componentType: 'Wheel System',
    description: 'Complete wheel system including rims and tires',
    partNumber: 'WH2023-17A',
    count: 4,
    weight: '80kg',
    manufacturer: 'RoadGrip Tire Co',
    status: 'active'
  });
  
  // Wheel Subcomponents
  const rims = ultralink.addEntity('rims', 'component', {
    name: 'Alloy Rims',
    componentType: 'Wheel Part',
    description: '17-inch aluminum alloy rims',
    partNumber: 'RIM2023-17A',
    size: '17 inches',
    material: 'Aluminum Alloy',
    count: 4,
    weight: '32kg',
    manufacturer: 'AlloyTech Wheels',
    status: 'active'
  });
  
  const tires = ultralink.addEntity('tires', 'component', {
    name: 'All-Season Tires',
    componentType: 'Wheel Part',
    description: '215/55R17 all-season tires',
    partNumber: 'TIRE2023-17AS',
    size: '215/55R17',
    type: 'All-Season',
    count: 4,
    weight: '48kg',
    manufacturer: 'RoadGrip Tire Co',
    status: 'active'
  });
  
  // Brake System
  const brakeSystem = ultralink.addEntity('brake-system', 'component', {
    name: 'Brake System',
    componentType: 'Brakes',
    description: 'Four-wheel disc brake system with ABS',
    partNumber: 'BR2023-ABS',
    type: 'Disc',
    features: ['ABS', 'Electronic Brake Distribution', 'Brake Assist'],
    weight: '65kg',
    manufacturer: 'StopTech Braking',
    status: 'active'
  });
  
  // Electrical System
  const electricalSystem = ultralink.addEntity('electrical-system', 'component', {
    name: 'Electrical System',
    componentType: 'Electrical',
    description: 'Complete electrical system including battery and wiring',
    partNumber: 'ES2023-12V',
    voltage: '12V',
    weight: '45kg',
    manufacturer: 'PowerCircuit Electronics',
    status: 'active'
  });
  
  // Battery
  const battery = ultralink.addEntity('battery', 'component', {
    name: 'Hybrid Battery System',
    componentType: 'Electrical Part',
    description: 'Lithium-ion battery pack for hybrid operation',
    partNumber: 'BAT2023-LION',
    capacity: '2.5kWh',
    voltage: '240V',
    weight: '35kg',
    manufacturer: 'PowerCell Technologies',
    status: 'active'
  });
  
  // Suspension System
  const suspension = ultralink.addEntity('suspension-system', 'component', {
    name: 'Suspension System',
    componentType: 'Suspension',
    description: 'MacPherson strut front, multi-link rear suspension',
    partNumber: 'SUS2023-MPS',
    type: 'Independent',
    weight: '120kg',
    manufacturer: 'RideTech Suspension',
    status: 'active'
  });
  
  // Engineering Specs
  const engineSpecs = ultralink.addEntity('engine-specifications', 'specifications', {
    name: 'Engine Technical Specifications',
    documentType: 'Technical Specifications',
    version: '2.3',
    lastUpdated: '2022-11-15',
    author: 'Engineering Team',
    sections: [
      'Performance Characteristics',
      'Mechanical Specifications',
      'Electrical Integration',
      'Cooling Requirements'
    ]
  });
  
  const safetyStandards = ultralink.addEntity('safety-standards', 'specifications', {
    name: 'Vehicle Safety Standards',
    documentType: 'Regulatory Compliance',
    version: '4.1',
    lastUpdated: '2022-09-30',
    author: 'Safety Department',
    standards: [
      'NHTSA Crash Test Requirements',
      'IIHS Safety Guidelines',
      'EU Safety Regulations'
    ]
  });
  
  // Maintenance Guidelines
  const maintenanceGuide = ultralink.addEntity('maintenance-guide', 'documentation', {
    name: 'Vehicle Maintenance Guidelines',
    documentType: 'Maintenance Manual',
    version: '1.2',
    lastUpdated: '2023-01-10',
    author: 'Service Department',
    sections: [
      'Routine Maintenance Schedule',
      'Engine Service Procedures',
      'Electrical System Diagnostics',
      'Brake System Maintenance'
    ]
  });
  
  // Engineers
  const chiefEngineer = ultralink.addEntity('chief-engineer', 'person', {
    name: 'Dr. Sarah Johnson',
    title: 'Chief Engineering Officer',
    department: 'Engineering',
    expertise: ['Automotive Design', 'Systems Integration', 'Project Management'],
    email: 'sarah.johnson@carcompany.com'
  });
  
  const engineEngineer = ultralink.addEntity('engine-engineer', 'person', {
    name: 'Michael Chen',
    title: 'Senior Powertrain Engineer',
    department: 'Powertrain Engineering',
    expertise: ['Engine Design', 'Hybrid Systems', 'Thermal Management'],
    email: 'michael.chen@carcompany.com'
  });
  
  const electricalEngineer = ultralink.addEntity('electrical-engineer', 'person', {
    name: 'Elena Rodriguez',
    title: 'Electrical Systems Engineer',
    department: 'Electrical Engineering',
    expertise: ['Automotive Electronics', 'Battery Systems', 'Sensor Integration'],
    email: 'elena.rodriguez@carcompany.com'
  });
  
  const interiorDesigner = ultralink.addEntity('interior-designer', 'person', {
    name: 'James Wilson',
    title: 'Senior Interior Designer',
    department: 'Interior Design',
    expertise: ['Ergonomics', 'Materials Science', 'User Experience'],
    email: 'james.wilson@carcompany.com'
  });
  
  // Manufacturing Facility
  const factory = ultralink.addEntity('manufacturing-plant', 'facility', {
    name: 'Central Manufacturing Plant',
    location: 'Detroit, Michigan',
    size: '1.2 million sq ft',
    capacity: '200,000 vehicles annually',
    employees: 3500,
    established: '1985'
  });
  
  // Establish Relationships
  
  // Component Hierarchies
  ultralink.addLink(car.id, engine.id, 'contains');
  ultralink.addLink(car.id, transmission.id, 'contains');
  ultralink.addLink(car.id, chassis.id, 'contains');
  ultralink.addLink(car.id, interior.id, 'contains');
  ultralink.addLink(car.id, wheelSystem.id, 'contains');
  ultralink.addLink(car.id, brakeSystem.id, 'contains');
  ultralink.addLink(car.id, electricalSystem.id, 'contains');
  ultralink.addLink(car.id, suspension.id, 'contains');
  
  // Engine Subcomponents
  ultralink.addLink(engine.id, engineBlock.id, 'contains');
  ultralink.addLink(engine.id, pistons.id, 'contains');
  ultralink.addLink(engine.id, fuelInjection.id, 'contains');
  ultralink.addLink(engine.id, electricMotor.id, 'contains');
  
  // Transmission Subcomponents
  ultralink.addLink(transmission.id, cvtBelt.id, 'contains');
  ultralink.addLink(transmission.id, torqueConverter.id, 'contains');
  
  // Interior Subcomponents
  ultralink.addLink(interior.id, dashboard.id, 'contains');
  ultralink.addLink(interior.id, seats.id, 'contains');
  ultralink.addLink(interior.id, infotainment.id, 'contains');
  
  // Wheel Subcomponents
  ultralink.addLink(wheelSystem.id, rims.id, 'contains');
  ultralink.addLink(wheelSystem.id, tires.id, 'contains');
  
  // Electrical Subcomponents
  ultralink.addLink(electricalSystem.id, battery.id, 'contains');
  ultralink.addLink(electricalSystem.id, infotainment.id, 'connects_to');
  
  // Component Dependencies
  ultralink.addLink(engine.id, electricalSystem.id, 'depends_on');
  ultralink.addLink(engine.id, transmission.id, 'connects_to');
  ultralink.addLink(transmission.id, wheelSystem.id, 'transfers_power_to');
  ultralink.addLink(brakeSystem.id, wheelSystem.id, 'acts_on');
  ultralink.addLink(suspension.id, wheelSystem.id, 'supports');
  ultralink.addLink(suspension.id, chassis.id, 'attaches_to');
  
  // Documentation References
  ultralink.addLink(engine.id, engineSpecs.id, 'documented_by');
  ultralink.addLink(car.id, safetyStandards.id, 'complies_with');
  ultralink.addLink(car.id, maintenanceGuide.id, 'documented_by');
  
  // Engineer Responsibilities
  ultralink.addLink(chiefEngineer.id, car.id, 'oversees');
  ultralink.addLink(engineEngineer.id, engine.id, 'designs');
  ultralink.addLink(electricalEngineer.id, electricalSystem.id, 'designs');
  ultralink.addLink(electricalEngineer.id, battery.id, 'designs');
  ultralink.addLink(interiorDesigner.id, interior.id, 'designs');
  
  // Manufacturing
  ultralink.addLink(factory.id, car.id, 'manufactures');
  
  // Collaboration
  ultralink.addLink(engineEngineer.id, electricalEngineer.id, 'collaborates_with');
  ultralink.addLink(electricalEngineer.id, interiorDesigner.id, 'collaborates_with');
  ultralink.addLink(chiefEngineer.id, engineEngineer.id, 'supervises');
  ultralink.addLink(chiefEngineer.id, electricalEngineer.id, 'supervises');
  ultralink.addLink(chiefEngineer.id, interiorDesigner.id, 'supervises');
  
  // NEW ENGINE SUBCOMPONENTS
  const camshaft = ultralink.addEntity('camshaft', 'component', {
    name: 'Camshaft Assembly',
    componentType: 'Engine Part',
    description: 'DOHC camshaft system',
    partNumber: 'CA2023-DOHC',
    material: 'Hardened Steel',
    weight: '8kg',
    manufacturer: 'PowerTech Industries',
    status: 'active'
  });

  const valves = ultralink.addEntity('valves', 'component', {
    name: 'Valve System',
    componentType: 'Engine Part',
    description: '16-valve system with variable timing',
    partNumber: 'VS2023-16V',
    material: 'Titanium Alloy',
    count: 16,
    weight: '3kg',
    manufacturer: 'PowerTech Industries',
    status: 'active'
  });

  const crankshaft = ultralink.addEntity('crankshaft', 'component', {
    name: 'Crankshaft',
    componentType: 'Engine Part',
    description: 'Forged steel crankshaft',
    partNumber: 'CS2023-F4',
    material: 'Forged Steel',
    weight: '15kg',
    manufacturer: 'PowerTech Industries',
    status: 'active'
  });

  // COOLING SYSTEM
  const coolingSystem = ultralink.addEntity('cooling-system', 'component', {
    name: 'Engine Cooling System',
    componentType: 'Cooling',
    description: 'Liquid cooling system with electric pump',
    partNumber: 'CS2023-LC',
    weight: '25kg',
    manufacturer: 'ThermalTech Systems',
    status: 'active'
  });

  const radiator = ultralink.addEntity('radiator', 'component', {
    name: 'Radiator',
    componentType: 'Cooling Part',
    description: 'Aluminum radiator with electric fan',
    partNumber: 'RAD2023-AL',
    material: 'Aluminum',
    weight: '8kg',
    manufacturer: 'ThermalTech Systems',
    status: 'active'
  });

  const waterPump = ultralink.addEntity('water-pump', 'component', {
    name: 'Water Pump',
    componentType: 'Cooling Part',
    description: 'Electric water pump',
    partNumber: 'WP2023-E',
    type: 'Electric',
    weight: '3kg',
    manufacturer: 'ThermalTech Systems',
    status: 'active'
  });

  // HVAC SYSTEM
  const hvacSystem = ultralink.addEntity('hvac-system', 'component', {
    name: 'HVAC System',
    componentType: 'HVAC',
    description: 'Dual-zone climate control system',
    partNumber: 'HVAC2023-DZ',
    weight: '35kg',
    manufacturer: 'ClimateControl Corp',
    status: 'active'
  });

  const compressor = ultralink.addEntity('ac-compressor', 'component', {
    name: 'AC Compressor',
    componentType: 'HVAC Part',
    description: 'Electric AC compressor',
    partNumber: 'AC2023-E',
    type: 'Electric',
    weight: '8kg',
    manufacturer: 'ClimateControl Corp',
    status: 'active'
  });

  const heaterCore = ultralink.addEntity('heater-core', 'component', {
    name: 'Heater Core',
    componentType: 'HVAC Part',
    description: 'Aluminum heater core',
    partNumber: 'HC2023-AL',
    material: 'Aluminum',
    weight: '4kg',
    manufacturer: 'ClimateControl Corp',
    status: 'active'
  });

  // EXHAUST SYSTEM
  const exhaustSystem = ultralink.addEntity('exhaust-system', 'component', {
    name: 'Exhaust System',
    componentType: 'Exhaust',
    description: 'Complete exhaust system with catalytic converter',
    partNumber: 'EX2023-CAT',
    weight: '45kg',
    manufacturer: 'ExhaustTech',
    status: 'active'
  });

  const catalyticConverter = ultralink.addEntity('catalytic-converter', 'component', {
    name: 'Catalytic Converter',
    componentType: 'Exhaust Part',
    description: 'Three-way catalytic converter',
    partNumber: 'CAT2023-3W',
    type: 'Three-Way',
    weight: '12kg',
    manufacturer: 'ExhaustTech',
    status: 'active'
  });

  const muffler = ultralink.addEntity('muffler', 'component', {
    name: 'Muffler',
    componentType: 'Exhaust Part',
    description: 'Performance muffler with noise reduction',
    partNumber: 'MUF2023-PR',
    material: 'Stainless Steel',
    weight: '8kg',
    manufacturer: 'ExhaustTech',
    status: 'active'
  });

  // SAFETY SYSTEMS
  const airbagSystem = ultralink.addEntity('airbag-system', 'component', {
    name: 'Airbag System',
    componentType: 'Safety',
    description: 'Multi-airbag safety system',
    partNumber: 'AB2023-MS',
    airbagCount: 8,
    weight: '25kg',
    manufacturer: 'SafetyTech Systems',
    status: 'active'
  });

  const seatbeltSystem = ultralink.addEntity('seatbelt-system', 'component', {
    name: 'Seatbelt System',
    componentType: 'Safety',
    description: 'Advanced seatbelt system with pretensioners',
    partNumber: 'SB2023-PT',
    seatCount: 5,
    weight: '15kg',
    manufacturer: 'SafetyTech Systems',
    status: 'active'
  });

  // ADDITIONAL SPECIFICATIONS
  const hvacSpecs = ultralink.addEntity('hvac-specifications', 'specifications', {
    name: 'HVAC Technical Specifications',
    documentType: 'Technical Specifications',
    version: '1.5',
    lastUpdated: '2023-01-20',
    author: 'Climate Control Team',
    sections: [
      'Cooling Performance',
      'Heating Performance',
      'Air Distribution',
      'Control Systems'
    ]
  });

  const exhaustSpecs = ultralink.addEntity('exhaust-specifications', 'specifications', {
    name: 'Exhaust System Specifications',
    documentType: 'Technical Specifications',
    version: '2.1',
    lastUpdated: '2023-02-15',
    author: 'Emissions Team',
    sections: [
      'Emissions Standards',
      'Flow Characteristics',
      'Noise Levels',
      'Heat Management'
    ]
  });

  // ADDITIONAL PERSONNEL
  const hvacEngineer = ultralink.addEntity('hvac-engineer', 'person', {
    name: 'Lisa Thompson',
    title: 'HVAC Systems Engineer',
    department: 'Climate Control',
    expertise: ['HVAC Design', 'Thermal Management', 'Control Systems'],
    email: 'lisa.thompson@carcompany.com'
  });

  const safetyEngineer = ultralink.addEntity('safety-engineer', 'person', {
    name: 'Robert Kim',
    title: 'Safety Systems Engineer',
    department: 'Vehicle Safety',
    expertise: ['Crash Systems', 'Safety Electronics', 'Regulatory Compliance'],
    email: 'robert.kim@carcompany.com'
  });

  const qualityManager = ultralink.addEntity('quality-manager', 'person', {
    name: 'Maria Garcia',
    title: 'Quality Assurance Manager',
    department: 'Quality Control',
    expertise: ['Quality Systems', 'Process Control', 'Regulatory Compliance'],
    email: 'maria.garcia@carcompany.com'
  });

  // NEW RELATIONSHIPS
  
  // Additional Engine Subcomponents
  ultralink.addLink(engine.id, camshaft.id, 'contains');
  ultralink.addLink(engine.id, valves.id, 'contains');
  ultralink.addLink(engine.id, crankshaft.id, 'contains');
  
  // Cooling System
  ultralink.addLink(car.id, coolingSystem.id, 'contains');
  ultralink.addLink(coolingSystem.id, radiator.id, 'contains');
  ultralink.addLink(coolingSystem.id, waterPump.id, 'contains');
  ultralink.addLink(coolingSystem.id, engine.id, 'cools');
  
  // HVAC System
  ultralink.addLink(car.id, hvacSystem.id, 'contains');
  ultralink.addLink(hvacSystem.id, compressor.id, 'contains');
  ultralink.addLink(hvacSystem.id, heaterCore.id, 'contains');
  ultralink.addLink(hvacSystem.id, electricalSystem.id, 'depends_on');
  
  // Exhaust System
  ultralink.addLink(car.id, exhaustSystem.id, 'contains');
  ultralink.addLink(exhaustSystem.id, catalyticConverter.id, 'contains');
  ultralink.addLink(exhaustSystem.id, muffler.id, 'contains');
  ultralink.addLink(exhaustSystem.id, engine.id, 'connects_to');
  
  // Safety Systems
  ultralink.addLink(car.id, airbagSystem.id, 'contains');
  ultralink.addLink(car.id, seatbeltSystem.id, 'contains');
  ultralink.addLink(airbagSystem.id, electricalSystem.id, 'depends_on');
  ultralink.addLink(seatbeltSystem.id, electricalSystem.id, 'depends_on');
  
  // Documentation
  ultralink.addLink(hvacSystem.id, hvacSpecs.id, 'documented_by');
  ultralink.addLink(exhaustSystem.id, exhaustSpecs.id, 'documented_by');
  
  // Engineer Responsibilities
  ultralink.addLink(hvacEngineer.id, hvacSystem.id, 'designs');
  ultralink.addLink(safetyEngineer.id, airbagSystem.id, 'designs');
  ultralink.addLink(safetyEngineer.id, seatbeltSystem.id, 'designs');
  ultralink.addLink(qualityManager.id, car.id, 'oversees_quality');
  
  // Additional Collaborations
  ultralink.addLink(hvacEngineer.id, electricalEngineer.id, 'collaborates_with');
  ultralink.addLink(safetyEngineer.id, electricalEngineer.id, 'collaborates_with');
  ultralink.addLink(qualityManager.id, chiefEngineer.id, 'reports_to');
  ultralink.addLink(chiefEngineer.id, hvacEngineer.id, 'supervises');
  ultralink.addLink(chiefEngineer.id, safetyEngineer.id, 'supervises');

  // System Dependencies
  ultralink.addLink(hvacSystem.id, coolingSystem.id, 'interacts_with');
  ultralink.addLink(engine.id, exhaustSystem.id, 'outputs_to');
  ultralink.addLink(coolingSystem.id, electricalSystem.id, 'depends_on');

  return ultralink;
}

module.exports = {
  createCarDataset
}; 
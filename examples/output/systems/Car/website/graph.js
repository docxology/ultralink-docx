// Graph visualization data
const data = {
  "nodes": [
    {
      "id": "sedan-model",
      "type": "vehicle",
      "label": "Sedan XR5",
      "attributes": {
        "name": "Sedan XR5",
        "type": "Sedan",
        "description": "Mid-size family sedan with modern features",
        "year": "2023",
        "dimensions": {
          "length": "4.8m",
          "width": "1.8m",
          "height": "1.5m"
        },
        "weight": "1500kg",
        "fuelType": "Hybrid",
        "fuelEfficiency": "18km/l",
        "engineSize": "2.0L",
        "status": "production"
      }
    },
    {
      "id": "engine-system",
      "type": "component",
      "label": "Hybrid Engine System",
      "attributes": {
        "name": "Hybrid Engine System",
        "componentType": "Engine",
        "description": "2.0L hybrid engine with electric motor assistance",
        "partNumber": "ENG2023-H20",
        "weight": "180kg",
        "dimensions": {
          "length": "0.65m",
          "width": "0.58m",
          "height": "0.62m"
        },
        "manufacturer": "PowerTech Industries",
        "status": "active"
      }
    },
    {
      "id": "engine-block",
      "type": "component",
      "label": "Engine Block",
      "attributes": {
        "name": "Engine Block",
        "componentType": "Engine Part",
        "description": "Main engine block housing for cylinders",
        "partNumber": "EB2023-H20",
        "material": "Aluminum Alloy",
        "cylinders": 4,
        "weight": "75kg",
        "manufacturer": "PowerTech Industries",
        "status": "active"
      }
    },
    {
      "id": "pistons",
      "type": "component",
      "label": "Piston Assembly",
      "attributes": {
        "name": "Piston Assembly",
        "componentType": "Engine Part",
        "description": "Set of 4 pistons with connecting rods",
        "partNumber": "PA2023-4C",
        "material": "Forged Steel",
        "count": 4,
        "weight": "12kg",
        "manufacturer": "PowerTech Industries",
        "status": "active"
      }
    },
    {
      "id": "fuel-injection",
      "type": "component",
      "label": "Fuel Injection System",
      "attributes": {
        "name": "Fuel Injection System",
        "componentType": "Engine Part",
        "description": "Direct injection system for fuel delivery",
        "partNumber": "FI2023-DI",
        "type": "Direct Injection",
        "pressure": "200bar",
        "weight": "8kg",
        "manufacturer": "FuelTech Systems",
        "status": "active"
      }
    },
    {
      "id": "electric-motor",
      "type": "component",
      "label": "Electric Assist Motor",
      "attributes": {
        "name": "Electric Assist Motor",
        "componentType": "Hybrid System",
        "description": "Electric motor for hybrid operation",
        "partNumber": "EM2023-45",
        "power": "45kW",
        "voltage": "240V",
        "weight": "25kg",
        "manufacturer": "ElectroDrive Inc",
        "status": "active"
      }
    },
    {
      "id": "transmission-system",
      "type": "component",
      "label": "CVT Transmission",
      "attributes": {
        "name": "CVT Transmission",
        "componentType": "Transmission",
        "description": "Continuously Variable Transmission system",
        "partNumber": "TR2023-CVT",
        "type": "CVT",
        "gearRatios": "Continuously Variable",
        "weight": "90kg",
        "manufacturer": "TransTech Auto",
        "status": "active"
      }
    },
    {
      "id": "cvt-belt",
      "type": "component",
      "label": "CVT Belt",
      "attributes": {
        "name": "CVT Belt",
        "componentType": "Transmission Part",
        "description": "Main belt for continuously variable transmission",
        "partNumber": "CB2023-H1",
        "material": "High-Strength Polymer",
        "weight": "5kg",
        "manufacturer": "TransTech Auto",
        "status": "active"
      }
    },
    {
      "id": "torque-converter",
      "type": "component",
      "label": "Torque Converter",
      "attributes": {
        "name": "Torque Converter",
        "componentType": "Transmission Part",
        "description": "Hydraulic torque converter for CVT system",
        "partNumber": "TC2023-H1",
        "diameter": "28cm",
        "weight": "15kg",
        "manufacturer": "TransTech Auto",
        "status": "active"
      }
    },
    {
      "id": "chassis-system",
      "type": "component",
      "label": "Chassis and Frame",
      "attributes": {
        "name": "Chassis and Frame",
        "componentType": "Chassis",
        "description": "Unibody chassis with reinforced safety frame",
        "partNumber": "CH2023-UB",
        "material": "High-Strength Steel with Aluminum Components",
        "weight": "320kg",
        "manufacturer": "FrameTech Engineering",
        "status": "active"
      }
    },
    {
      "id": "interior-system",
      "type": "component",
      "label": "Interior System",
      "attributes": {
        "name": "Interior System",
        "componentType": "Interior",
        "description": "Complete interior setup including dash, seats, and trim",
        "partNumber": "INT2023-STD",
        "capacity": "5 passengers",
        "weight": "180kg",
        "manufacturer": "ComfortDesign Interiors",
        "status": "active"
      }
    },
    {
      "id": "dashboard",
      "type": "component",
      "label": "Dashboard Assembly",
      "attributes": {
        "name": "Dashboard Assembly",
        "componentType": "Interior Part",
        "description": "Main dashboard with instrument cluster and controls",
        "partNumber": "DA2023-DX",
        "features": [
          "Digital Display",
          "Touch Controls",
          "Climate Interface"
        ],
        "weight": "25kg",
        "manufacturer": "ComfortDesign Interiors",
        "status": "active"
      }
    },
    {
      "id": "seats",
      "type": "component",
      "label": "Seating System",
      "attributes": {
        "name": "Seating System",
        "componentType": "Interior Part",
        "description": "Full set of 5 seats with adjustable features",
        "partNumber": "SS2023-5S",
        "material": "Synthetic Leather",
        "features": [
          "Heating",
          "Power Adjustment",
          "Memory Settings"
        ],
        "weight": "85kg",
        "manufacturer": "ComfortDesign Interiors",
        "status": "active"
      }
    },
    {
      "id": "infotainment",
      "type": "component",
      "label": "Infotainment System",
      "attributes": {
        "name": "Infotainment System",
        "componentType": "Electronics",
        "description": "10-inch touchscreen with navigation and media",
        "partNumber": "INF2023-10T",
        "screenSize": "10 inches",
        "features": [
          "Navigation",
          "Smartphone Integration",
          "Voice Control"
        ],
        "weight": "5kg",
        "manufacturer": "TechTouch Electronics",
        "status": "active"
      }
    },
    {
      "id": "wheel-system",
      "type": "component",
      "label": "Wheels and Tires",
      "attributes": {
        "name": "Wheels and Tires",
        "componentType": "Wheel System",
        "description": "Complete wheel system including rims and tires",
        "partNumber": "WH2023-17A",
        "count": 4,
        "weight": "80kg",
        "manufacturer": "RoadGrip Tire Co",
        "status": "active"
      }
    },
    {
      "id": "rims",
      "type": "component",
      "label": "Alloy Rims",
      "attributes": {
        "name": "Alloy Rims",
        "componentType": "Wheel Part",
        "description": "17-inch aluminum alloy rims",
        "partNumber": "RIM2023-17A",
        "size": "17 inches",
        "material": "Aluminum Alloy",
        "count": 4,
        "weight": "32kg",
        "manufacturer": "AlloyTech Wheels",
        "status": "active"
      }
    },
    {
      "id": "tires",
      "type": "component",
      "label": "All-Season Tires",
      "attributes": {
        "name": "All-Season Tires",
        "componentType": "Wheel Part",
        "description": "215/55R17 all-season tires",
        "partNumber": "TIRE2023-17AS",
        "size": "215/55R17",
        "type": "All-Season",
        "count": 4,
        "weight": "48kg",
        "manufacturer": "RoadGrip Tire Co",
        "status": "active"
      }
    },
    {
      "id": "brake-system",
      "type": "component",
      "label": "Brake System",
      "attributes": {
        "name": "Brake System",
        "componentType": "Brakes",
        "description": "Four-wheel disc brake system with ABS",
        "partNumber": "BR2023-ABS",
        "type": "Disc",
        "features": [
          "ABS",
          "Electronic Brake Distribution",
          "Brake Assist"
        ],
        "weight": "65kg",
        "manufacturer": "StopTech Braking",
        "status": "active"
      }
    },
    {
      "id": "electrical-system",
      "type": "component",
      "label": "Electrical System",
      "attributes": {
        "name": "Electrical System",
        "componentType": "Electrical",
        "description": "Complete electrical system including battery and wiring",
        "partNumber": "ES2023-12V",
        "voltage": "12V",
        "weight": "45kg",
        "manufacturer": "PowerCircuit Electronics",
        "status": "active"
      }
    },
    {
      "id": "battery",
      "type": "component",
      "label": "Hybrid Battery System",
      "attributes": {
        "name": "Hybrid Battery System",
        "componentType": "Electrical Part",
        "description": "Lithium-ion battery pack for hybrid operation",
        "partNumber": "BAT2023-LION",
        "capacity": "2.5kWh",
        "voltage": "240V",
        "weight": "35kg",
        "manufacturer": "PowerCell Technologies",
        "status": "active"
      }
    },
    {
      "id": "suspension-system",
      "type": "component",
      "label": "Suspension System",
      "attributes": {
        "name": "Suspension System",
        "componentType": "Suspension",
        "description": "MacPherson strut front, multi-link rear suspension",
        "partNumber": "SUS2023-MPS",
        "type": "Independent",
        "weight": "120kg",
        "manufacturer": "RideTech Suspension",
        "status": "active"
      }
    },
    {
      "id": "engine-specifications",
      "type": "specifications",
      "label": "Engine Technical Specifications",
      "attributes": {
        "name": "Engine Technical Specifications",
        "documentType": "Technical Specifications",
        "version": "2.3",
        "lastUpdated": "2022-11-15",
        "author": "Engineering Team",
        "sections": [
          "Performance Characteristics",
          "Mechanical Specifications",
          "Electrical Integration",
          "Cooling Requirements"
        ]
      }
    },
    {
      "id": "safety-standards",
      "type": "specifications",
      "label": "Vehicle Safety Standards",
      "attributes": {
        "name": "Vehicle Safety Standards",
        "documentType": "Regulatory Compliance",
        "version": "4.1",
        "lastUpdated": "2022-09-30",
        "author": "Safety Department",
        "standards": [
          "NHTSA Crash Test Requirements",
          "IIHS Safety Guidelines",
          "EU Safety Regulations"
        ]
      }
    },
    {
      "id": "maintenance-guide",
      "type": "documentation",
      "label": "Vehicle Maintenance Guidelines",
      "attributes": {
        "name": "Vehicle Maintenance Guidelines",
        "documentType": "Maintenance Manual",
        "version": "1.2",
        "lastUpdated": "2023-01-10",
        "author": "Service Department",
        "sections": [
          "Routine Maintenance Schedule",
          "Engine Service Procedures",
          "Electrical System Diagnostics",
          "Brake System Maintenance"
        ]
      }
    },
    {
      "id": "chief-engineer",
      "type": "person",
      "label": "Dr. Sarah Johnson",
      "attributes": {
        "name": "Dr. Sarah Johnson",
        "title": "Chief Engineering Officer",
        "department": "Engineering",
        "expertise": [
          "Automotive Design",
          "Systems Integration",
          "Project Management"
        ],
        "email": "sarah.johnson@carcompany.com"
      }
    },
    {
      "id": "engine-engineer",
      "type": "person",
      "label": "Michael Chen",
      "attributes": {
        "name": "Michael Chen",
        "title": "Senior Powertrain Engineer",
        "department": "Powertrain Engineering",
        "expertise": [
          "Engine Design",
          "Hybrid Systems",
          "Thermal Management"
        ],
        "email": "michael.chen@carcompany.com"
      }
    },
    {
      "id": "electrical-engineer",
      "type": "person",
      "label": "Elena Rodriguez",
      "attributes": {
        "name": "Elena Rodriguez",
        "title": "Electrical Systems Engineer",
        "department": "Electrical Engineering",
        "expertise": [
          "Automotive Electronics",
          "Battery Systems",
          "Sensor Integration"
        ],
        "email": "elena.rodriguez@carcompany.com"
      }
    },
    {
      "id": "interior-designer",
      "type": "person",
      "label": "James Wilson",
      "attributes": {
        "name": "James Wilson",
        "title": "Senior Interior Designer",
        "department": "Interior Design",
        "expertise": [
          "Ergonomics",
          "Materials Science",
          "User Experience"
        ],
        "email": "james.wilson@carcompany.com"
      }
    },
    {
      "id": "manufacturing-plant",
      "type": "facility",
      "label": "Central Manufacturing Plant",
      "attributes": {
        "name": "Central Manufacturing Plant",
        "location": "Detroit, Michigan",
        "size": "1.2 million sq ft",
        "capacity": "200,000 vehicles annually",
        "employees": 3500,
        "established": "1985"
      }
    },
    {
      "id": "camshaft",
      "type": "component",
      "label": "Camshaft Assembly",
      "attributes": {
        "name": "Camshaft Assembly",
        "componentType": "Engine Part",
        "description": "DOHC camshaft system",
        "partNumber": "CA2023-DOHC",
        "material": "Hardened Steel",
        "weight": "8kg",
        "manufacturer": "PowerTech Industries",
        "status": "active"
      }
    },
    {
      "id": "valves",
      "type": "component",
      "label": "Valve System",
      "attributes": {
        "name": "Valve System",
        "componentType": "Engine Part",
        "description": "16-valve system with variable timing",
        "partNumber": "VS2023-16V",
        "material": "Titanium Alloy",
        "count": 16,
        "weight": "3kg",
        "manufacturer": "PowerTech Industries",
        "status": "active"
      }
    },
    {
      "id": "crankshaft",
      "type": "component",
      "label": "Crankshaft",
      "attributes": {
        "name": "Crankshaft",
        "componentType": "Engine Part",
        "description": "Forged steel crankshaft",
        "partNumber": "CS2023-F4",
        "material": "Forged Steel",
        "weight": "15kg",
        "manufacturer": "PowerTech Industries",
        "status": "active"
      }
    },
    {
      "id": "cooling-system",
      "type": "component",
      "label": "Engine Cooling System",
      "attributes": {
        "name": "Engine Cooling System",
        "componentType": "Cooling",
        "description": "Liquid cooling system with electric pump",
        "partNumber": "CS2023-LC",
        "weight": "25kg",
        "manufacturer": "ThermalTech Systems",
        "status": "active"
      }
    },
    {
      "id": "radiator",
      "type": "component",
      "label": "Radiator",
      "attributes": {
        "name": "Radiator",
        "componentType": "Cooling Part",
        "description": "Aluminum radiator with electric fan",
        "partNumber": "RAD2023-AL",
        "material": "Aluminum",
        "weight": "8kg",
        "manufacturer": "ThermalTech Systems",
        "status": "active"
      }
    },
    {
      "id": "water-pump",
      "type": "component",
      "label": "Water Pump",
      "attributes": {
        "name": "Water Pump",
        "componentType": "Cooling Part",
        "description": "Electric water pump",
        "partNumber": "WP2023-E",
        "type": "Electric",
        "weight": "3kg",
        "manufacturer": "ThermalTech Systems",
        "status": "active"
      }
    },
    {
      "id": "hvac-system",
      "type": "component",
      "label": "HVAC System",
      "attributes": {
        "name": "HVAC System",
        "componentType": "HVAC",
        "description": "Dual-zone climate control system",
        "partNumber": "HVAC2023-DZ",
        "weight": "35kg",
        "manufacturer": "ClimateControl Corp",
        "status": "active"
      }
    },
    {
      "id": "ac-compressor",
      "type": "component",
      "label": "AC Compressor",
      "attributes": {
        "name": "AC Compressor",
        "componentType": "HVAC Part",
        "description": "Electric AC compressor",
        "partNumber": "AC2023-E",
        "type": "Electric",
        "weight": "8kg",
        "manufacturer": "ClimateControl Corp",
        "status": "active"
      }
    },
    {
      "id": "heater-core",
      "type": "component",
      "label": "Heater Core",
      "attributes": {
        "name": "Heater Core",
        "componentType": "HVAC Part",
        "description": "Aluminum heater core",
        "partNumber": "HC2023-AL",
        "material": "Aluminum",
        "weight": "4kg",
        "manufacturer": "ClimateControl Corp",
        "status": "active"
      }
    },
    {
      "id": "exhaust-system",
      "type": "component",
      "label": "Exhaust System",
      "attributes": {
        "name": "Exhaust System",
        "componentType": "Exhaust",
        "description": "Complete exhaust system with catalytic converter",
        "partNumber": "EX2023-CAT",
        "weight": "45kg",
        "manufacturer": "ExhaustTech",
        "status": "active"
      }
    },
    {
      "id": "catalytic-converter",
      "type": "component",
      "label": "Catalytic Converter",
      "attributes": {
        "name": "Catalytic Converter",
        "componentType": "Exhaust Part",
        "description": "Three-way catalytic converter",
        "partNumber": "CAT2023-3W",
        "type": "Three-Way",
        "weight": "12kg",
        "manufacturer": "ExhaustTech",
        "status": "active"
      }
    },
    {
      "id": "muffler",
      "type": "component",
      "label": "Muffler",
      "attributes": {
        "name": "Muffler",
        "componentType": "Exhaust Part",
        "description": "Performance muffler with noise reduction",
        "partNumber": "MUF2023-PR",
        "material": "Stainless Steel",
        "weight": "8kg",
        "manufacturer": "ExhaustTech",
        "status": "active"
      }
    },
    {
      "id": "airbag-system",
      "type": "component",
      "label": "Airbag System",
      "attributes": {
        "name": "Airbag System",
        "componentType": "Safety",
        "description": "Multi-airbag safety system",
        "partNumber": "AB2023-MS",
        "airbagCount": 8,
        "weight": "25kg",
        "manufacturer": "SafetyTech Systems",
        "status": "active"
      }
    },
    {
      "id": "seatbelt-system",
      "type": "component",
      "label": "Seatbelt System",
      "attributes": {
        "name": "Seatbelt System",
        "componentType": "Safety",
        "description": "Advanced seatbelt system with pretensioners",
        "partNumber": "SB2023-PT",
        "seatCount": 5,
        "weight": "15kg",
        "manufacturer": "SafetyTech Systems",
        "status": "active"
      }
    },
    {
      "id": "hvac-specifications",
      "type": "specifications",
      "label": "HVAC Technical Specifications",
      "attributes": {
        "name": "HVAC Technical Specifications",
        "documentType": "Technical Specifications",
        "version": "1.5",
        "lastUpdated": "2023-01-20",
        "author": "Climate Control Team",
        "sections": [
          "Cooling Performance",
          "Heating Performance",
          "Air Distribution",
          "Control Systems"
        ]
      }
    },
    {
      "id": "exhaust-specifications",
      "type": "specifications",
      "label": "Exhaust System Specifications",
      "attributes": {
        "name": "Exhaust System Specifications",
        "documentType": "Technical Specifications",
        "version": "2.1",
        "lastUpdated": "2023-02-15",
        "author": "Emissions Team",
        "sections": [
          "Emissions Standards",
          "Flow Characteristics",
          "Noise Levels",
          "Heat Management"
        ]
      }
    },
    {
      "id": "hvac-engineer",
      "type": "person",
      "label": "Lisa Thompson",
      "attributes": {
        "name": "Lisa Thompson",
        "title": "HVAC Systems Engineer",
        "department": "Climate Control",
        "expertise": [
          "HVAC Design",
          "Thermal Management",
          "Control Systems"
        ],
        "email": "lisa.thompson@carcompany.com"
      }
    },
    {
      "id": "safety-engineer",
      "type": "person",
      "label": "Robert Kim",
      "attributes": {
        "name": "Robert Kim",
        "title": "Safety Systems Engineer",
        "department": "Vehicle Safety",
        "expertise": [
          "Crash Systems",
          "Safety Electronics",
          "Regulatory Compliance"
        ],
        "email": "robert.kim@carcompany.com"
      }
    },
    {
      "id": "quality-manager",
      "type": "person",
      "label": "Maria Garcia",
      "attributes": {
        "name": "Maria Garcia",
        "title": "Quality Assurance Manager",
        "department": "Quality Control",
        "expertise": [
          "Quality Systems",
          "Process Control",
          "Regulatory Compliance"
        ],
        "email": "maria.garcia@carcompany.com"
      }
    }
  ],
  "links": [
    {
      "source": "sedan-model",
      "target": "engine-system",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "sedan-model",
      "target": "transmission-system",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "sedan-model",
      "target": "chassis-system",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "sedan-model",
      "target": "interior-system",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "sedan-model",
      "target": "wheel-system",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "sedan-model",
      "target": "brake-system",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "sedan-model",
      "target": "electrical-system",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "sedan-model",
      "target": "suspension-system",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "engine-system",
      "target": "engine-block",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "engine-system",
      "target": "pistons",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "engine-system",
      "target": "fuel-injection",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "engine-system",
      "target": "electric-motor",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "transmission-system",
      "target": "cvt-belt",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "transmission-system",
      "target": "torque-converter",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "interior-system",
      "target": "dashboard",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "interior-system",
      "target": "seats",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "interior-system",
      "target": "infotainment",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "wheel-system",
      "target": "rims",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "wheel-system",
      "target": "tires",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "electrical-system",
      "target": "battery",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "electrical-system",
      "target": "infotainment",
      "type": "connects_to",
      "attributes": {}
    },
    {
      "source": "engine-system",
      "target": "electrical-system",
      "type": "depends_on",
      "attributes": {}
    },
    {
      "source": "engine-system",
      "target": "transmission-system",
      "type": "connects_to",
      "attributes": {}
    },
    {
      "source": "transmission-system",
      "target": "wheel-system",
      "type": "transfers_power_to",
      "attributes": {}
    },
    {
      "source": "brake-system",
      "target": "wheel-system",
      "type": "acts_on",
      "attributes": {}
    },
    {
      "source": "suspension-system",
      "target": "wheel-system",
      "type": "supports",
      "attributes": {}
    },
    {
      "source": "suspension-system",
      "target": "chassis-system",
      "type": "attaches_to",
      "attributes": {}
    },
    {
      "source": "engine-system",
      "target": "engine-specifications",
      "type": "documented_by",
      "attributes": {}
    },
    {
      "source": "sedan-model",
      "target": "safety-standards",
      "type": "complies_with",
      "attributes": {}
    },
    {
      "source": "sedan-model",
      "target": "maintenance-guide",
      "type": "documented_by",
      "attributes": {}
    },
    {
      "source": "chief-engineer",
      "target": "sedan-model",
      "type": "oversees",
      "attributes": {}
    },
    {
      "source": "engine-engineer",
      "target": "engine-system",
      "type": "designs",
      "attributes": {}
    },
    {
      "source": "electrical-engineer",
      "target": "electrical-system",
      "type": "designs",
      "attributes": {}
    },
    {
      "source": "electrical-engineer",
      "target": "battery",
      "type": "designs",
      "attributes": {}
    },
    {
      "source": "interior-designer",
      "target": "interior-system",
      "type": "designs",
      "attributes": {}
    },
    {
      "source": "manufacturing-plant",
      "target": "sedan-model",
      "type": "manufactures",
      "attributes": {}
    },
    {
      "source": "engine-engineer",
      "target": "electrical-engineer",
      "type": "collaborates_with",
      "attributes": {}
    },
    {
      "source": "electrical-engineer",
      "target": "interior-designer",
      "type": "collaborates_with",
      "attributes": {}
    },
    {
      "source": "chief-engineer",
      "target": "engine-engineer",
      "type": "supervises",
      "attributes": {}
    },
    {
      "source": "chief-engineer",
      "target": "electrical-engineer",
      "type": "supervises",
      "attributes": {}
    },
    {
      "source": "chief-engineer",
      "target": "interior-designer",
      "type": "supervises",
      "attributes": {}
    },
    {
      "source": "engine-system",
      "target": "camshaft",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "engine-system",
      "target": "valves",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "engine-system",
      "target": "crankshaft",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "sedan-model",
      "target": "cooling-system",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "cooling-system",
      "target": "radiator",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "cooling-system",
      "target": "water-pump",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "cooling-system",
      "target": "engine-system",
      "type": "cools",
      "attributes": {}
    },
    {
      "source": "sedan-model",
      "target": "hvac-system",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "hvac-system",
      "target": "ac-compressor",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "hvac-system",
      "target": "heater-core",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "hvac-system",
      "target": "electrical-system",
      "type": "depends_on",
      "attributes": {}
    },
    {
      "source": "sedan-model",
      "target": "exhaust-system",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "exhaust-system",
      "target": "catalytic-converter",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "exhaust-system",
      "target": "muffler",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "exhaust-system",
      "target": "engine-system",
      "type": "connects_to",
      "attributes": {}
    },
    {
      "source": "sedan-model",
      "target": "airbag-system",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "sedan-model",
      "target": "seatbelt-system",
      "type": "contains",
      "attributes": {}
    },
    {
      "source": "airbag-system",
      "target": "electrical-system",
      "type": "depends_on",
      "attributes": {}
    },
    {
      "source": "seatbelt-system",
      "target": "electrical-system",
      "type": "depends_on",
      "attributes": {}
    },
    {
      "source": "hvac-system",
      "target": "hvac-specifications",
      "type": "documented_by",
      "attributes": {}
    },
    {
      "source": "exhaust-system",
      "target": "exhaust-specifications",
      "type": "documented_by",
      "attributes": {}
    },
    {
      "source": "hvac-engineer",
      "target": "hvac-system",
      "type": "designs",
      "attributes": {}
    },
    {
      "source": "safety-engineer",
      "target": "airbag-system",
      "type": "designs",
      "attributes": {}
    },
    {
      "source": "safety-engineer",
      "target": "seatbelt-system",
      "type": "designs",
      "attributes": {}
    },
    {
      "source": "quality-manager",
      "target": "sedan-model",
      "type": "oversees_quality",
      "attributes": {}
    },
    {
      "source": "hvac-engineer",
      "target": "electrical-engineer",
      "type": "collaborates_with",
      "attributes": {}
    },
    {
      "source": "safety-engineer",
      "target": "electrical-engineer",
      "type": "collaborates_with",
      "attributes": {}
    },
    {
      "source": "quality-manager",
      "target": "chief-engineer",
      "type": "reports_to",
      "attributes": {}
    },
    {
      "source": "chief-engineer",
      "target": "hvac-engineer",
      "type": "supervises",
      "attributes": {}
    },
    {
      "source": "chief-engineer",
      "target": "safety-engineer",
      "type": "supervises",
      "attributes": {}
    },
    {
      "source": "hvac-system",
      "target": "cooling-system",
      "type": "interacts_with",
      "attributes": {}
    },
    {
      "source": "engine-system",
      "target": "exhaust-system",
      "type": "outputs_to",
      "attributes": {}
    },
    {
      "source": "cooling-system",
      "target": "electrical-system",
      "type": "depends_on",
      "attributes": {}
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
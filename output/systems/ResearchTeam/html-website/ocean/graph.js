// Graph visualization data
const data = {
  "nodes": [
    {
      "id": "alice-chen",
      "type": "person",
      "label": "Alice Chen",
      "attributes": {
        "name": "Alice Chen",
        "title": "Principal Investigator",
        "expertise": [
          "Machine Learning",
          "Computer Vision",
          "Neural Networks"
        ],
        "email": "alice.chen@research.org",
        "joinDate": "2018-01-15",
        "status": "active"
      }
    },
    {
      "id": "bob-smith",
      "type": "person",
      "label": "Bob Smith",
      "attributes": {
        "name": "Bob Smith",
        "title": "Senior Researcher",
        "expertise": [
          "Natural Language Processing",
          "Deep Learning"
        ],
        "email": "bob.smith@research.org",
        "joinDate": "2019-03-01",
        "status": "active"
      }
    },
    {
      "id": "carol-jones",
      "type": "person",
      "label": "Carol Jones",
      "attributes": {
        "name": "Carol Jones",
        "title": "PhD Student",
        "expertise": [
          "Reinforcement Learning",
          "Robotics"
        ],
        "email": "carol.jones@research.org",
        "joinDate": "2020-09-01",
        "status": "active",
        "advisor": "alice-chen"
      }
    },
    {
      "id": "david-patel",
      "type": "person",
      "label": "David Patel",
      "attributes": {
        "name": "David Patel",
        "title": "Postdoctoral Researcher",
        "expertise": [
          "Federated Learning",
          "Privacy-Preserving AI",
          "Distributed Systems"
        ],
        "email": "david.patel@research.org",
        "joinDate": "2021-02-15",
        "status": "active"
      }
    },
    {
      "id": "elena-rodriguez",
      "type": "person",
      "label": "Elena Rodriguez",
      "attributes": {
        "name": "Elena Rodriguez",
        "title": "Research Assistant",
        "expertise": [
          "Data Visualization",
          "Statistical Analysis"
        ],
        "email": "elena.rodriguez@research.org",
        "joinDate": "2022-06-01",
        "status": "active"
      }
    },
    {
      "id": "frank-zhang",
      "type": "person",
      "label": "Frank Zhang",
      "attributes": {
        "name": "Frank Zhang",
        "title": "Visiting Researcher",
        "expertise": [
          "Quantum Computing",
          "Algorithm Design"
        ],
        "email": "frank.zhang@partner-university.edu",
        "joinDate": "2023-01-10",
        "status": "active",
        "endDate": "2023-12-31"
      }
    },
    {
      "id": "grace-kim",
      "type": "person",
      "label": "Grace Kim",
      "attributes": {
        "name": "Grace Kim",
        "title": "Lab Manager",
        "expertise": [
          "Research Administration",
          "Grant Writing"
        ],
        "email": "grace.kim@research.org",
        "joinDate": "2019-07-15",
        "status": "active"
      }
    },
    {
      "id": "computer-vision-project",
      "type": "project",
      "label": "Advanced Computer Vision Systems",
      "attributes": {
        "title": "Advanced Computer Vision Systems",
        "description": "Developing next-generation computer vision systems using deep learning",
        "startDate": "2021-01-01",
        "endDate": "2023-12-31",
        "status": "active",
        "budget": 500000,
        "objectives": [
          "Improve object detection accuracy",
          "Develop real-time processing capabilities",
          "Create robust low-light performance"
        ]
      }
    },
    {
      "id": "nlp-project",
      "type": "project",
      "label": "Natural Language Understanding",
      "attributes": {
        "title": "Natural Language Understanding",
        "description": "Advanced NLP techniques for context-aware language understanding",
        "startDate": "2021-06-01",
        "endDate": "2024-05-31",
        "status": "active",
        "budget": 400000,
        "objectives": [
          "Enhance contextual understanding",
          "Improve multilingual capabilities",
          "Develop efficient training methods"
        ]
      }
    },
    {
      "id": "federated-learning-project",
      "type": "project",
      "label": "Privacy-Preserving Federated Learning",
      "attributes": {
        "title": "Privacy-Preserving Federated Learning",
        "description": "Developing techniques for training models across distributed data sources while preserving privacy",
        "startDate": "2022-03-01",
        "endDate": "2025-02-28",
        "status": "active",
        "budget": 650000,
        "objectives": [
          "Reduce communication overhead in federated systems",
          "Enhance privacy guarantees beyond differential privacy",
          "Deploy to real-world healthcare applications"
        ]
      }
    },
    {
      "id": "quantum-ml-project",
      "type": "project",
      "label": "Quantum Approaches to Machine Learning",
      "attributes": {
        "title": "Quantum Approaches to Machine Learning",
        "description": "Exploring quantum computing advantages for select machine learning problems",
        "startDate": "2023-01-15",
        "endDate": "2024-12-31",
        "status": "active",
        "budget": 800000,
        "objectives": [
          "Develop quantum algorithms for ML acceleration",
          "Benchmark against classical approaches",
          "Identify practical quantum advantage use cases"
        ]
      }
    },
    {
      "id": "adaptive-robotics-project",
      "type": "project",
      "label": "Adaptive Robotics Control",
      "attributes": {
        "title": "Adaptive Robotics Control",
        "description": "Developing reinforcement learning approaches for adaptive robot control in unstructured environments",
        "startDate": "2021-09-01",
        "endDate": "2024-08-31",
        "status": "active",
        "budget": 550000,
        "objectives": [
          "Create sample-efficient RL algorithms for robotics",
          "Implement transfer learning between simulation and real-world",
          "Demonstrate robust performance in dynamic environments"
        ]
      }
    },
    {
      "id": "vision-paper-2022",
      "type": "publication",
      "label": "Novel Approaches to Low-Light Computer Vision",
      "attributes": {
        "title": "Novel Approaches to Low-Light Computer Vision",
        "authors": [
          "alice-chen",
          "carol-jones"
        ],
        "venue": "International Conference on Computer Vision 2022",
        "year": 2022,
        "doi": "10.1234/vision2022",
        "citations": 45,
        "abstract": "This paper presents innovative techniques for computer vision in low-light conditions..."
      }
    },
    {
      "id": "nlp-paper-2023",
      "type": "publication",
      "label": "Context-Aware Language Understanding in Multi-Domain Settings",
      "attributes": {
        "title": "Context-Aware Language Understanding in Multi-Domain Settings",
        "authors": [
          "bob-smith",
          "alice-chen"
        ],
        "venue": "ACL 2023",
        "year": 2023,
        "doi": "10.1234/acl2023",
        "citations": 12,
        "abstract": "We propose a novel approach to context-aware language understanding..."
      }
    },
    {
      "id": "federated-paper-2023",
      "type": "publication",
      "label": "Communication-Efficient Federated Learning with Adaptive Compression",
      "attributes": {
        "title": "Communication-Efficient Federated Learning with Adaptive Compression",
        "authors": [
          "david-patel",
          "alice-chen",
          "frank-zhang"
        ],
        "venue": "International Conference on Machine Learning 2023",
        "year": 2023,
        "doi": "10.1234/icml2023",
        "citations": 8,
        "abstract": "This paper introduces a novel compression technique for federated learning that adaptively adjusts to network conditions and data heterogeneity..."
      }
    },
    {
      "id": "robotics-paper-2022",
      "type": "publication",
      "label": "Sim-to-Real Transfer for Robotic Manipulation via Adaptive Domain Randomization",
      "attributes": {
        "title": "Sim-to-Real Transfer for Robotic Manipulation via Adaptive Domain Randomization",
        "authors": [
          "carol-jones",
          "alice-chen"
        ],
        "venue": "Robotics: Science and Systems 2022",
        "year": 2022,
        "doi": "10.1234/rss2022",
        "citations": 31,
        "abstract": "We present a new approach to sim-to-real transfer learning for robotic manipulation tasks that leverages adaptive domain randomization..."
      }
    },
    {
      "id": "quantum-paper-2023",
      "type": "publication",
      "label": "Quantum Circuit Learning for Computer Vision Tasks",
      "attributes": {
        "title": "Quantum Circuit Learning for Computer Vision Tasks",
        "authors": [
          "frank-zhang",
          "david-patel"
        ],
        "venue": "Quantum Machine Intelligence Journal",
        "year": 2023,
        "doi": "10.1234/qmi2023",
        "citations": 5,
        "abstract": "This study explores the application of parameterized quantum circuits for image classification tasks, demonstrating advantages in specific constrained scenarios..."
      }
    },
    {
      "id": "survey-paper-2023",
      "type": "publication",
      "label": "A Comprehensive Survey of Privacy-Preserving Machine Learning Techniques",
      "attributes": {
        "title": "A Comprehensive Survey of Privacy-Preserving Machine Learning Techniques",
        "authors": [
          "david-patel",
          "bob-smith",
          "alice-chen"
        ],
        "venue": "ACM Computing Surveys",
        "year": 2023,
        "doi": "10.1234/surveys2023",
        "citations": 78,
        "abstract": "This survey provides a comprehensive overview of privacy-preserving machine learning techniques, including differential privacy, federated learning, secure multi-party computation, and homomorphic encryption..."
      }
    },
    {
      "id": "gpu-cluster",
      "type": "equipment",
      "label": "High-Performance GPU Cluster",
      "attributes": {
        "name": "High-Performance GPU Cluster",
        "description": "NVIDIA DGX A100 cluster for deep learning research",
        "location": "Server Room A",
        "specifications": {
          "gpus": 8,
          "memory": "320GB",
          "storage": "10TB"
        },
        "status": "operational",
        "purchaseDate": "2021-01-15",
        "maintenanceSchedule": "quarterly"
      }
    },
    {
      "id": "robotics-lab",
      "type": "facility",
      "label": "Robotics Laboratory",
      "attributes": {
        "name": "Robotics Laboratory",
        "description": "Advanced robotics testing and development facility",
        "location": "Building B, Room 305",
        "equipment": [
          "robot-arm-1",
          "motion-capture-system"
        ],
        "capacity": 10,
        "status": "active"
      }
    },
    {
      "id": "quantum-computer",
      "type": "equipment",
      "label": "Quantum Computing Access",
      "attributes": {
        "name": "Quantum Computing Access",
        "description": "Cloud access to IBM Quantum systems",
        "location": "Remote/Cloud",
        "specifications": {
          "qubits": 127,
          "access": "Priority research queue",
          "quota": "20 hours/month"
        },
        "status": "operational",
        "acquisitionDate": "2022-11-01",
        "contractRenewal": "2024-10-31"
      }
    },
    {
      "id": "hpc-cluster",
      "type": "equipment",
      "label": "University High-Performance Computing Cluster",
      "attributes": {
        "name": "University High-Performance Computing Cluster",
        "description": "Shared computing facility for computation-intensive research",
        "location": "Data Center Building C",
        "specifications": {
          "cores": 4096,
          "memory": "16TB",
          "storage": "1PB",
          "interconnect": "InfiniBand"
        },
        "status": "operational",
        "accessLevel": "shared"
      }
    },
    {
      "id": "data-collection-system",
      "type": "equipment",
      "label": "Field Data Collection System",
      "attributes": {
        "name": "Field Data Collection System",
        "description": "Mobile sensors and data collection equipment for field research",
        "location": "Equipment Room 105",
        "specifications": {
          "sensors": [
            "environmental",
            "biometric",
            "geospatial"
          ],
          "storage": "2TB",
          "battery": "72 hours"
        },
        "status": "operational",
        "purchaseDate": "2022-05-15"
      }
    },
    {
      "id": "conference-room",
      "type": "facility",
      "label": "Research Team Conference Room",
      "attributes": {
        "name": "Research Team Conference Room",
        "description": "Meeting and presentation space with advanced AV equipment",
        "location": "Building A, Room 210",
        "equipment": [
          "projector",
          "video-conferencing",
          "interactive-whiteboard"
        ],
        "capacity": 20,
        "status": "active"
      }
    },
    {
      "id": "visualization-lab",
      "type": "facility",
      "label": "Data Visualization Laboratory",
      "attributes": {
        "name": "Data Visualization Laboratory",
        "description": "Specialized facility for immersive data visualization",
        "location": "Building B, Room 410",
        "equipment": [
          "vr-headsets",
          "large-format-displays",
          "3d-projection"
        ],
        "capacity": 8,
        "status": "active"
      }
    },
    {
      "id": "machine-learning-theory",
      "type": "knowledge-area",
      "label": "Machine Learning Theory",
      "attributes": {
        "name": "Machine Learning Theory",
        "description": "Fundamental theoretical concepts in machine learning",
        "topics": [
          "Statistical Learning",
          "Optimization",
          "Information Theory"
        ]
      }
    },
    {
      "id": "computer-vision",
      "type": "knowledge-area",
      "label": "Computer Vision",
      "attributes": {
        "name": "Computer Vision",
        "description": "Visual information processing and understanding",
        "topics": [
          "Object Detection",
          "Image Segmentation",
          "Visual Recognition"
        ]
      }
    },
    {
      "id": "nlp",
      "type": "knowledge-area",
      "label": "Natural Language Processing",
      "attributes": {
        "name": "Natural Language Processing",
        "description": "Processing and understanding of human language",
        "topics": [
          "Text Understanding",
          "Machine Translation",
          "Language Generation"
        ]
      }
    },
    {
      "id": "privacy-ml",
      "type": "knowledge-area",
      "label": "Privacy-Preserving Machine Learning",
      "attributes": {
        "name": "Privacy-Preserving Machine Learning",
        "description": "Techniques for ensuring privacy in machine learning systems",
        "topics": [
          "Differential Privacy",
          "Federated Learning",
          "Secure Multi-Party Computation",
          "Homomorphic Encryption"
        ]
      }
    },
    {
      "id": "quantum-ml",
      "type": "knowledge-area",
      "label": "Quantum Machine Learning",
      "attributes": {
        "name": "Quantum Machine Learning",
        "description": "Intersection of quantum computing and machine learning",
        "topics": [
          "Quantum Neural Networks",
          "Quantum Kernels",
          "Quantum Circuit Learning",
          "Quantum Advantage in ML"
        ]
      }
    },
    {
      "id": "robotics",
      "type": "knowledge-area",
      "label": "Robotics",
      "attributes": {
        "name": "Robotics",
        "description": "Design, construction, and operation of robots",
        "topics": [
          "Robot Control",
          "Perception",
          "Path Planning",
          "Human-Robot Interaction"
        ]
      }
    },
    {
      "id": "reinforcement-learning",
      "type": "knowledge-area",
      "label": "Reinforcement Learning",
      "attributes": {
        "name": "Reinforcement Learning",
        "description": "Learning through interaction with an environment",
        "topics": [
          "Value-Based Methods",
          "Policy Gradient Methods",
          "Model-Based RL",
          "Multi-Agent RL"
        ]
      }
    },
    {
      "id": "nsf-grant",
      "type": "funding",
      "label": "NSF Research Grant",
      "attributes": {
        "name": "NSF Research Grant",
        "description": "National Science Foundation grant for foundational research",
        "amount": 1200000,
        "startDate": "2021-01-01",
        "endDate": "2024-12-31",
        "grantNumber": "NSF-2021-1234",
        "type": "federal"
      }
    },
    {
      "id": "tech-partner",
      "type": "funding",
      "label": "Tech Industry Partnership",
      "attributes": {
        "name": "Tech Industry Partnership",
        "description": "Research partnership with major technology company",
        "amount": 500000,
        "startDate": "2022-07-01",
        "endDate": "2024-06-30",
        "contractNumber": "IND-2022-789",
        "type": "industry"
      }
    },
    {
      "id": "university-fund",
      "type": "funding",
      "label": "University Research Excellence Fund",
      "attributes": {
        "name": "University Research Excellence Fund",
        "description": "Internal university funding for promising research directions",
        "amount": 250000,
        "startDate": "2023-01-01",
        "endDate": "2024-12-31",
        "grantNumber": "UNI-2023-456",
        "type": "internal"
      }
    }
  ],
  "links": [
    {
      "source": "alice-chen",
      "target": "computer-vision-project",
      "type": "leads",
      "attributes": {}
    },
    {
      "source": "alice-chen",
      "target": "nlp-project",
      "type": "contributes_to",
      "attributes": {}
    },
    {
      "source": "bob-smith",
      "target": "nlp-project",
      "type": "leads",
      "attributes": {}
    },
    {
      "source": "carol-jones",
      "target": "computer-vision-project",
      "type": "contributes_to",
      "attributes": {}
    },
    {
      "source": "david-patel",
      "target": "federated-learning-project",
      "type": "leads",
      "attributes": {}
    },
    {
      "source": "alice-chen",
      "target": "federated-learning-project",
      "type": "contributes_to",
      "attributes": {}
    },
    {
      "source": "frank-zhang",
      "target": "quantum-ml-project",
      "type": "leads",
      "attributes": {}
    },
    {
      "source": "david-patel",
      "target": "quantum-ml-project",
      "type": "contributes_to",
      "attributes": {}
    },
    {
      "source": "carol-jones",
      "target": "adaptive-robotics-project",
      "type": "leads",
      "attributes": {}
    },
    {
      "source": "elena-rodriguez",
      "target": "adaptive-robotics-project",
      "type": "contributes_to",
      "attributes": {}
    },
    {
      "source": "elena-rodriguez",
      "target": "computer-vision-project",
      "type": "contributes_to",
      "attributes": {}
    },
    {
      "source": "david-patel",
      "target": "nlp-project",
      "type": "contributes_to",
      "attributes": {}
    },
    {
      "source": "bob-smith",
      "target": "federated-learning-project",
      "type": "contributes_to",
      "attributes": {}
    },
    {
      "source": "alice-chen",
      "target": "carol-jones",
      "type": "mentors",
      "attributes": {}
    },
    {
      "source": "alice-chen",
      "target": "david-patel",
      "type": "mentors",
      "attributes": {}
    },
    {
      "source": "bob-smith",
      "target": "elena-rodriguez",
      "type": "mentors",
      "attributes": {}
    },
    {
      "source": "david-patel",
      "target": "elena-rodriguez",
      "type": "mentors",
      "attributes": {}
    },
    {
      "source": "carol-jones",
      "target": "elena-rodriguez",
      "type": "mentors",
      "attributes": {}
    },
    {
      "source": "alice-chen",
      "target": "vision-paper-2022",
      "type": "authored",
      "attributes": {}
    },
    {
      "source": "carol-jones",
      "target": "vision-paper-2022",
      "type": "authored",
      "attributes": {}
    },
    {
      "source": "bob-smith",
      "target": "nlp-paper-2023",
      "type": "authored",
      "attributes": {}
    },
    {
      "source": "alice-chen",
      "target": "nlp-paper-2023",
      "type": "authored",
      "attributes": {}
    },
    {
      "source": "david-patel",
      "target": "federated-paper-2023",
      "type": "authored",
      "attributes": {}
    },
    {
      "source": "alice-chen",
      "target": "federated-paper-2023",
      "type": "authored",
      "attributes": {}
    },
    {
      "source": "frank-zhang",
      "target": "federated-paper-2023",
      "type": "authored",
      "attributes": {}
    },
    {
      "source": "carol-jones",
      "target": "robotics-paper-2022",
      "type": "authored",
      "attributes": {}
    },
    {
      "source": "alice-chen",
      "target": "robotics-paper-2022",
      "type": "authored",
      "attributes": {}
    },
    {
      "source": "frank-zhang",
      "target": "quantum-paper-2023",
      "type": "authored",
      "attributes": {}
    },
    {
      "source": "david-patel",
      "target": "quantum-paper-2023",
      "type": "authored",
      "attributes": {}
    },
    {
      "source": "david-patel",
      "target": "survey-paper-2023",
      "type": "authored",
      "attributes": {}
    },
    {
      "source": "bob-smith",
      "target": "survey-paper-2023",
      "type": "authored",
      "attributes": {}
    },
    {
      "source": "alice-chen",
      "target": "survey-paper-2023",
      "type": "authored",
      "attributes": {}
    },
    {
      "source": "computer-vision-project",
      "target": "vision-paper-2022",
      "type": "produced",
      "attributes": {}
    },
    {
      "source": "nlp-project",
      "target": "nlp-paper-2023",
      "type": "produced",
      "attributes": {}
    },
    {
      "source": "federated-learning-project",
      "target": "federated-paper-2023",
      "type": "produced",
      "attributes": {}
    },
    {
      "source": "federated-learning-project",
      "target": "survey-paper-2023",
      "type": "produced",
      "attributes": {}
    },
    {
      "source": "adaptive-robotics-project",
      "target": "robotics-paper-2022",
      "type": "produced",
      "attributes": {}
    },
    {
      "source": "quantum-ml-project",
      "target": "quantum-paper-2023",
      "type": "produced",
      "attributes": {}
    },
    {
      "source": "computer-vision-project",
      "target": "gpu-cluster",
      "type": "uses",
      "attributes": {}
    },
    {
      "source": "nlp-project",
      "target": "gpu-cluster",
      "type": "uses",
      "attributes": {}
    },
    {
      "source": "carol-jones",
      "target": "robotics-lab",
      "type": "uses",
      "attributes": {}
    },
    {
      "source": "federated-learning-project",
      "target": "gpu-cluster",
      "type": "uses",
      "attributes": {}
    },
    {
      "source": "federated-learning-project",
      "target": "hpc-cluster",
      "type": "uses",
      "attributes": {}
    },
    {
      "source": "quantum-ml-project",
      "target": "quantum-computer",
      "type": "uses",
      "attributes": {}
    },
    {
      "source": "quantum-ml-project",
      "target": "hpc-cluster",
      "type": "uses",
      "attributes": {}
    },
    {
      "source": "adaptive-robotics-project",
      "target": "robotics-lab",
      "type": "uses",
      "attributes": {}
    },
    {
      "source": "adaptive-robotics-project",
      "target": "data-collection-system",
      "type": "uses",
      "attributes": {}
    },
    {
      "source": "elena-rodriguez",
      "target": "visualization-lab",
      "type": "uses",
      "attributes": {}
    },
    {
      "source": "david-patel",
      "target": "hpc-cluster",
      "type": "uses",
      "attributes": {}
    },
    {
      "source": "frank-zhang",
      "target": "quantum-computer",
      "type": "uses",
      "attributes": {}
    },
    {
      "source": "machine-learning-theory",
      "target": "computer-vision",
      "type": "foundational_for",
      "attributes": {}
    },
    {
      "source": "machine-learning-theory",
      "target": "nlp",
      "type": "foundational_for",
      "attributes": {}
    },
    {
      "source": "alice-chen",
      "target": "computer-vision",
      "type": "expertise_in",
      "attributes": {}
    },
    {
      "source": "bob-smith",
      "target": "nlp",
      "type": "expertise_in",
      "attributes": {}
    },
    {
      "source": "carol-jones",
      "target": "machine-learning-theory",
      "type": "expertise_in",
      "attributes": {}
    },
    {
      "source": "machine-learning-theory",
      "target": "privacy-ml",
      "type": "foundational_for",
      "attributes": {}
    },
    {
      "source": "machine-learning-theory",
      "target": "quantum-ml",
      "type": "foundational_for",
      "attributes": {}
    },
    {
      "source": "machine-learning-theory",
      "target": "reinforcement-learning",
      "type": "foundational_for",
      "attributes": {}
    },
    {
      "source": "reinforcement-learning",
      "target": "robotics",
      "type": "foundational_for",
      "attributes": {}
    },
    {
      "source": "david-patel",
      "target": "privacy-ml",
      "type": "expertise_in",
      "attributes": {}
    },
    {
      "source": "david-patel",
      "target": "machine-learning-theory",
      "type": "expertise_in",
      "attributes": {}
    },
    {
      "source": "frank-zhang",
      "target": "quantum-ml",
      "type": "expertise_in",
      "attributes": {}
    },
    {
      "source": "carol-jones",
      "target": "reinforcement-learning",
      "type": "expertise_in",
      "attributes": {}
    },
    {
      "source": "carol-jones",
      "target": "robotics",
      "type": "expertise_in",
      "attributes": {}
    },
    {
      "source": "alice-chen",
      "target": "privacy-ml",
      "type": "expertise_in",
      "attributes": {}
    },
    {
      "source": "bob-smith",
      "target": "privacy-ml",
      "type": "expertise_in",
      "attributes": {}
    },
    {
      "source": "elena-rodriguez",
      "target": "computer-vision",
      "type": "expertise_in",
      "attributes": {}
    },
    {
      "source": "computer-vision-project",
      "target": "computer-vision",
      "type": "applies",
      "attributes": {}
    },
    {
      "source": "computer-vision-project",
      "target": "machine-learning-theory",
      "type": "applies",
      "attributes": {}
    },
    {
      "source": "nlp-project",
      "target": "nlp",
      "type": "applies",
      "attributes": {}
    },
    {
      "source": "nlp-project",
      "target": "machine-learning-theory",
      "type": "applies",
      "attributes": {}
    },
    {
      "source": "federated-learning-project",
      "target": "privacy-ml",
      "type": "applies",
      "attributes": {}
    },
    {
      "source": "federated-learning-project",
      "target": "machine-learning-theory",
      "type": "applies",
      "attributes": {}
    },
    {
      "source": "quantum-ml-project",
      "target": "quantum-ml",
      "type": "applies",
      "attributes": {}
    },
    {
      "source": "quantum-ml-project",
      "target": "machine-learning-theory",
      "type": "applies",
      "attributes": {}
    },
    {
      "source": "adaptive-robotics-project",
      "target": "robotics",
      "type": "applies",
      "attributes": {}
    },
    {
      "source": "adaptive-robotics-project",
      "target": "reinforcement-learning",
      "type": "applies",
      "attributes": {}
    },
    {
      "source": "nsf-grant",
      "target": "computer-vision-project",
      "type": "funds",
      "attributes": {}
    },
    {
      "source": "nsf-grant",
      "target": "adaptive-robotics-project",
      "type": "funds",
      "attributes": {}
    },
    {
      "source": "tech-partner",
      "target": "federated-learning-project",
      "type": "funds",
      "attributes": {}
    },
    {
      "source": "tech-partner",
      "target": "nlp-project",
      "type": "funds",
      "attributes": {}
    },
    {
      "source": "university-fund",
      "target": "quantum-ml-project",
      "type": "funds",
      "attributes": {}
    },
    {
      "source": "grace-kim",
      "target": "computer-vision-project",
      "type": "administers",
      "attributes": {}
    },
    {
      "source": "grace-kim",
      "target": "nlp-project",
      "type": "administers",
      "attributes": {}
    },
    {
      "source": "grace-kim",
      "target": "federated-learning-project",
      "type": "administers",
      "attributes": {}
    },
    {
      "source": "grace-kim",
      "target": "quantum-ml-project",
      "type": "administers",
      "attributes": {}
    },
    {
      "source": "grace-kim",
      "target": "adaptive-robotics-project",
      "type": "administers",
      "attributes": {}
    },
    {
      "source": "survey-paper-2023",
      "target": "federated-paper-2023",
      "type": "cites",
      "attributes": {}
    },
    {
      "source": "survey-paper-2023",
      "target": "vision-paper-2022",
      "type": "cites",
      "attributes": {}
    },
    {
      "source": "survey-paper-2023",
      "target": "nlp-paper-2023",
      "type": "cites",
      "attributes": {}
    },
    {
      "source": "robotics-paper-2022",
      "target": "vision-paper-2022",
      "type": "cites",
      "attributes": {}
    },
    {
      "source": "quantum-paper-2023",
      "target": "survey-paper-2023",
      "type": "cites",
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
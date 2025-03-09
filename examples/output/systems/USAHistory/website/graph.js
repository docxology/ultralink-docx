// Graph visualization data
const data = {
  "nodes": [
    {
      "id": "colonial-period",
      "type": "time_period",
      "label": "Colonial Period",
      "attributes": {
        "name": "Colonial Period",
        "startYear": 1607,
        "endYear": 1776,
        "description": "Period of American colonization by European powers, primarily Great Britain"
      }
    },
    {
      "id": "revolutionary-war",
      "type": "time_period",
      "label": "American Revolution",
      "attributes": {
        "name": "American Revolution",
        "startYear": 1775,
        "endYear": 1783,
        "description": "War for independence from Great Britain"
      }
    },
    {
      "id": "early-republic",
      "type": "time_period",
      "label": "Early Republic",
      "attributes": {
        "name": "Early Republic",
        "startYear": 1783,
        "endYear": 1815,
        "description": "Formation and early development of the United States government"
      }
    },
    {
      "id": "antebellum",
      "type": "time_period",
      "label": "Antebellum Era",
      "attributes": {
        "name": "Antebellum Era",
        "startYear": 1815,
        "endYear": 1861,
        "description": "Period of growth and division leading to the Civil War"
      }
    },
    {
      "id": "civil-war",
      "type": "time_period",
      "label": "Civil War",
      "attributes": {
        "name": "Civil War",
        "startYear": 1861,
        "endYear": 1865,
        "description": "War between the Union and Confederate states"
      }
    },
    {
      "id": "reconstruction",
      "type": "time_period",
      "label": "Reconstruction",
      "attributes": {
        "name": "Reconstruction",
        "startYear": 1865,
        "endYear": 1877,
        "description": "Post-Civil War rebuilding and integration of Southern states"
      }
    },
    {
      "id": "gilded-age",
      "type": "time_period",
      "label": "Gilded Age",
      "attributes": {
        "name": "Gilded Age",
        "startYear": 1877,
        "endYear": 1900,
        "description": "Era of rapid economic growth, industrialization, and wealth inequality"
      }
    },
    {
      "id": "progressive-era",
      "type": "time_period",
      "label": "Progressive Era",
      "attributes": {
        "name": "Progressive Era",
        "startYear": 1900,
        "endYear": 1920,
        "description": "Period of social activism and political reform"
      }
    },
    {
      "id": "roaring-twenties",
      "type": "time_period",
      "label": "Roaring Twenties",
      "attributes": {
        "name": "Roaring Twenties",
        "startYear": 1920,
        "endYear": 1929,
        "description": "Period of economic prosperity and cultural dynamism"
      }
    },
    {
      "id": "great-depression",
      "type": "time_period",
      "label": "Great Depression",
      "attributes": {
        "name": "Great Depression",
        "startYear": 1929,
        "endYear": 1941,
        "description": "Severe economic downturn causing high unemployment and economic hardship"
      }
    },
    {
      "id": "world-war-2",
      "type": "time_period",
      "label": "World War II",
      "attributes": {
        "name": "World War II",
        "startYear": 1941,
        "endYear": 1945,
        "description": "American involvement in the global conflict"
      }
    },
    {
      "id": "cold-war",
      "type": "time_period",
      "label": "Cold War",
      "attributes": {
        "name": "Cold War",
        "startYear": 1945,
        "endYear": 1991,
        "description": "Geopolitical tension between the United States and Soviet Union"
      }
    },
    {
      "id": "civil-rights",
      "type": "time_period",
      "label": "Civil Rights Movement",
      "attributes": {
        "name": "Civil Rights Movement",
        "startYear": 1954,
        "endYear": 1968,
        "description": "Movement for racial equality and ending discrimination"
      }
    },
    {
      "id": "modern-era",
      "type": "time_period",
      "label": "Modern Era",
      "attributes": {
        "name": "Modern Era",
        "startYear": 1991,
        "endYear": 2023,
        "description": "Post-Cold War period to present day"
      }
    },
    {
      "id": "jamestown-founding",
      "type": "event",
      "label": "Founding of Jamestown",
      "attributes": {
        "name": "Founding of Jamestown",
        "date": "1607-05-14",
        "location": "Virginia",
        "description": "First permanent English settlement in North America",
        "significance": "Established English presence in North America",
        "vector": [
          -0.12,
          0.35,
          0.02,
          0.41,
          -0.18,
          0.22
        ]
      }
    },
    {
      "id": "plymouth-colony",
      "type": "event",
      "label": "Plymouth Colony Established",
      "attributes": {
        "name": "Plymouth Colony Established",
        "date": "1620-12-21",
        "location": "Massachusetts",
        "description": "Pilgrims establish Plymouth Colony after arriving on the Mayflower",
        "significance": "Early religious settlement that shaped New England culture",
        "vector": [
          -0.1,
          0.32,
          0.05,
          0.4,
          -0.15,
          0.25
        ]
      }
    },
    {
      "id": "declaration-independence",
      "type": "event",
      "label": "Declaration of Independence",
      "attributes": {
        "name": "Declaration of Independence",
        "date": "1776-07-04",
        "location": "Philadelphia, Pennsylvania",
        "description": "Formal declaration of independence from Great Britain",
        "significance": "Foundational document establishing American independence",
        "keywords": [
          "independence",
          "liberty",
          "revolution",
          "rights"
        ],
        "vector": [
          0.45,
          0.28,
          0.34,
          0.12,
          0.22,
          -0.15
        ]
      }
    },
    {
      "id": "constitutional-convention",
      "type": "event",
      "label": "Constitutional Convention",
      "attributes": {
        "name": "Constitutional Convention",
        "date": "1787-05-25",
        "endDate": "1787-09-17",
        "location": "Philadelphia, Pennsylvania",
        "description": "Convention to create a new constitution for the United States",
        "significance": "Created the United States Constitution",
        "keywords": [
          "constitution",
          "government",
          "federalism",
          "compromise"
        ],
        "vector": [
          0.42,
          0.25,
          0.38,
          0.1,
          0.24,
          -0.12
        ]
      }
    },
    {
      "id": "louisiana-purchase",
      "type": "event",
      "label": "Louisiana Purchase",
      "attributes": {
        "name": "Louisiana Purchase",
        "date": "1803-04-30",
        "location": "Paris, France",
        "description": "Purchase of the Louisiana Territory from France",
        "significance": "Doubled the size of the United States",
        "keywords": [
          "expansion",
          "territory",
          "Jefferson",
          "Napoleon"
        ],
        "vector": [
          0.05,
          0.42,
          -0.15,
          0.28,
          0.33,
          0.22
        ]
      }
    },
    {
      "id": "civil-war-start",
      "type": "event",
      "label": "Civil War Begins",
      "attributes": {
        "name": "Civil War Begins",
        "date": "1861-04-12",
        "location": "Fort Sumter, South Carolina",
        "description": "Confederate forces attack Fort Sumter, beginning the Civil War",
        "significance": "Started the bloodiest conflict in American history",
        "keywords": [
          "war",
          "slavery",
          "secession",
          "conflict"
        ],
        "vector": [
          -0.35,
          -0.22,
          -0.42,
          -0.18,
          -0.3,
          -0.25
        ]
      }
    },
    {
      "id": "emancipation-proclamation",
      "type": "event",
      "label": "Emancipation Proclamation",
      "attributes": {
        "name": "Emancipation Proclamation",
        "date": "1863-01-01",
        "location": "Washington, D.C.",
        "description": "Lincoln declares slaves in Confederate states to be free",
        "significance": "Changed the character of the Civil War and began the process of ending slavery",
        "keywords": [
          "slavery",
          "freedom",
          "Lincoln",
          "abolition"
        ],
        "vector": [
          0.48,
          0.3,
          0.38,
          0.15,
          0.25,
          -0.1
        ]
      }
    },
    {
      "id": "civil-war-end",
      "type": "event",
      "label": "Civil War Ends",
      "attributes": {
        "name": "Civil War Ends",
        "date": "1865-04-09",
        "location": "Appomattox Court House, Virginia",
        "description": "General Lee surrenders to General Grant, effectively ending the Civil War",
        "significance": "Ended the Civil War and preserved the Union",
        "keywords": [
          "surrender",
          "war end",
          "Lee",
          "Grant",
          "reconciliation"
        ],
        "vector": [
          0.1,
          0.15,
          0.2,
          0.3,
          0.25,
          0.22
        ]
      }
    },
    {
      "id": "womens-suffrage",
      "type": "event",
      "label": "19th Amendment",
      "attributes": {
        "name": "19th Amendment",
        "date": "1920-08-18",
        "location": "United States",
        "description": "Constitutional amendment giving women the right to vote",
        "significance": "Major achievement for women's rights and democracy",
        "keywords": [
          "women",
          "voting",
          "rights",
          "suffrage",
          "equality"
        ],
        "vector": [
          0.46,
          0.32,
          0.33,
          0.14,
          0.26,
          -0.12
        ]
      }
    },
    {
      "id": "stock-market-crash",
      "type": "event",
      "label": "Stock Market Crash",
      "attributes": {
        "name": "Stock Market Crash",
        "date": "1929-10-29",
        "location": "New York, New York",
        "description": "Stock market crashes, triggering the Great Depression",
        "significance": "Led to the worst economic crisis in American history",
        "keywords": [
          "depression",
          "economy",
          "crash",
          "financial",
          "poverty"
        ],
        "vector": [
          -0.32,
          -0.18,
          -0.38,
          -0.25,
          -0.28,
          -0.2
        ]
      }
    },
    {
      "id": "pearl-harbor",
      "type": "event",
      "label": "Attack on Pearl Harbor",
      "attributes": {
        "name": "Attack on Pearl Harbor",
        "date": "1941-12-07",
        "location": "Pearl Harbor, Hawaii",
        "description": "Japanese forces attack the US Naval base at Pearl Harbor",
        "significance": "Brought the United States into World War II",
        "keywords": [
          "war",
          "Japan",
          "attack",
          "World War II",
          "Roosevelt"
        ],
        "vector": [
          -0.38,
          -0.28,
          -0.42,
          -0.2,
          -0.32,
          -0.3
        ]
      }
    },
    {
      "id": "mlk-speech",
      "type": "event",
      "label": "I Have a Dream Speech",
      "attributes": {
        "name": "I Have a Dream Speech",
        "date": "1963-08-28",
        "location": "Washington, D.C.",
        "description": "Martin Luther King Jr. delivers his famous speech during the March on Washington",
        "significance": "Defining moment in the Civil Rights Movement",
        "keywords": [
          "civil rights",
          "equality",
          "King",
          "dream",
          "racial justice"
        ],
        "vector": [
          0.5,
          0.35,
          0.4,
          0.18,
          0.28,
          -0.08
        ]
      }
    },
    {
      "id": "moon-landing",
      "type": "event",
      "label": "Moon Landing",
      "attributes": {
        "name": "Moon Landing",
        "date": "1969-07-20",
        "location": "Moon",
        "description": "NASA's Apollo 11 mission lands humans on the Moon",
        "significance": "Major achievement in space exploration and technology",
        "keywords": [
          "space",
          "NASA",
          "Apollo",
          "Armstrong",
          "technology"
        ],
        "vector": [
          0.25,
          0.45,
          0.05,
          0.38,
          0.15,
          0.42
        ]
      }
    },
    {
      "id": "september-11",
      "type": "event",
      "label": "September 11 Attacks",
      "attributes": {
        "name": "September 11 Attacks",
        "date": "2001-09-11",
        "location": "New York, Washington D.C., Pennsylvania",
        "description": "Terrorist attacks using hijacked airplanes",
        "significance": "Deadliest terrorist attack in history, led to major changes in US foreign policy",
        "keywords": [
          "terrorism",
          "attack",
          "security",
          "war on terror",
          "tragedy"
        ],
        "vector": [
          -0.42,
          -0.35,
          -0.48,
          -0.25,
          -0.38,
          -0.32
        ]
      }
    },
    {
      "id": "obama-election",
      "type": "event",
      "label": "Barack Obama Elected President",
      "attributes": {
        "name": "Barack Obama Elected President",
        "date": "2008-11-04",
        "location": "United States",
        "description": "Barack Obama elected as first African American president of the United States",
        "significance": "Historic milestone in American race relations and politics",
        "keywords": [
          "election",
          "Obama",
          "presidency",
          "African American",
          "milestone"
        ],
        "vector": [
          0.42,
          0.3,
          0.35,
          0.2,
          0.28,
          0.15
        ]
      }
    },
    {
      "id": "washington",
      "type": "person",
      "label": "George Washington",
      "attributes": {
        "name": "George Washington",
        "birth": "1732-02-22",
        "death": "1799-12-14",
        "role": "Military leader, 1st President",
        "significance": "Led Continental Army, first US President, established presidential precedents",
        "keywords": [
          "president",
          "revolutionary war",
          "founding father",
          "Mount Vernon"
        ],
        "vector": [
          0.4,
          0.32,
          0.28,
          0.25,
          0.38,
          0.22
        ]
      }
    },
    {
      "id": "jefferson",
      "type": "person",
      "label": "Thomas Jefferson",
      "attributes": {
        "name": "Thomas Jefferson",
        "birth": "1743-04-13",
        "death": "1826-07-04",
        "role": "Statesman, 3rd President",
        "significance": "Authored Declaration of Independence, expanded US territory, founded University of Virginia",
        "keywords": [
          "declaration",
          "president",
          "founding father",
          "Monticello",
          "Louisiana Purchase"
        ],
        "vector": [
          0.38,
          0.35,
          0.32,
          0.3,
          0.25,
          0.18
        ]
      }
    },
    {
      "id": "lincoln",
      "type": "person",
      "label": "Abraham Lincoln",
      "attributes": {
        "name": "Abraham Lincoln",
        "birth": "1809-02-12",
        "death": "1865-04-15",
        "role": "16th President",
        "significance": "Preserved the Union during Civil War, emancipated slaves, modernized economy",
        "keywords": [
          "civil war",
          "emancipation",
          "Gettysburg",
          "assassination",
          "union"
        ],
        "vector": [
          0.42,
          0.36,
          0.3,
          0.28,
          0.32,
          0.15
        ]
      }
    },
    {
      "id": "douglass",
      "type": "person",
      "label": "Frederick Douglass",
      "attributes": {
        "name": "Frederick Douglass",
        "birth": "1818-02-01",
        "death": "1895-02-20",
        "role": "Abolitionist, Writer",
        "significance": "Escaped slave who became leading abolitionist and advocate for equality",
        "keywords": [
          "abolition",
          "slavery",
          "civil rights",
          "orator",
          "writer"
        ],
        "vector": [
          0.44,
          0.36,
          0.34,
          0.25,
          0.3,
          0.12
        ]
      }
    },
    {
      "id": "roosevelt-fdr",
      "type": "person",
      "label": "Franklin D. Roosevelt",
      "attributes": {
        "name": "Franklin D. Roosevelt",
        "birth": "1882-01-30",
        "death": "1945-04-12",
        "role": "32nd President",
        "significance": "Led US through Great Depression and most of World War II, established New Deal programs",
        "keywords": [
          "New Deal",
          "depression",
          "World War II",
          "polio",
          "four terms"
        ],
        "vector": [
          0.4,
          0.34,
          0.3,
          0.25,
          0.35,
          0.2
        ]
      }
    },
    {
      "id": "mlk",
      "type": "person",
      "label": "Martin Luther King Jr.",
      "attributes": {
        "name": "Martin Luther King Jr.",
        "birth": "1929-01-15",
        "death": "1968-04-04",
        "role": "Civil Rights Leader",
        "significance": "Led nonviolent civil rights movement, advocated for racial equality",
        "keywords": [
          "civil rights",
          "nonviolence",
          "dream speech",
          "equality",
          "Nobel Peace Prize"
        ],
        "vector": [
          0.48,
          0.38,
          0.42,
          0.3,
          0.35,
          0.15
        ]
      }
    },
    {
      "id": "democracy",
      "type": "concept",
      "label": "Democracy",
      "attributes": {
        "name": "Democracy",
        "description": "System of government by the people, typically through elected representatives",
        "keywords": [
          "voting",
          "representation",
          "elections",
          "governance",
          "people"
        ],
        "vector": [
          0.35,
          0.3,
          0.4,
          0.25,
          0.32,
          0.22
        ]
      }
    },
    {
      "id": "slavery",
      "type": "concept",
      "label": "Slavery",
      "attributes": {
        "name": "Slavery",
        "description": "System of forced labor where people are owned as property",
        "keywords": [
          "bondage",
          "plantation",
          "abolition",
          "slaves",
          "human property"
        ],
        "vector": [
          -0.4,
          -0.32,
          -0.45,
          -0.38,
          -0.42,
          -0.3
        ]
      }
    },
    {
      "id": "manifest-destiny",
      "type": "concept",
      "label": "Manifest Destiny",
      "attributes": {
        "name": "Manifest Destiny",
        "description": "Belief that American settlers were destined to expand across North America",
        "keywords": [
          "expansion",
          "westward",
          "territory",
          "settlement",
          "imperialism"
        ],
        "vector": [
          0.1,
          0.38,
          -0.05,
          0.42,
          0.25,
          0.3
        ]
      }
    },
    {
      "id": "civil-rights-concept",
      "type": "concept",
      "label": "Civil Rights",
      "attributes": {
        "name": "Civil Rights",
        "description": "Rights to personal liberty and equality under the law",
        "keywords": [
          "equality",
          "rights",
          "discrimination",
          "freedom",
          "justice"
        ],
        "vector": [
          0.46,
          0.35,
          0.42,
          0.28,
          0.32,
          0.15
        ]
      }
    },
    {
      "id": "american-dream",
      "type": "concept",
      "label": "American Dream",
      "attributes": {
        "name": "American Dream",
        "description": "Belief that anyone can achieve success and prosperity through hard work",
        "keywords": [
          "opportunity",
          "success",
          "prosperity",
          "upward mobility",
          "work ethic"
        ],
        "vector": [
          0.35,
          0.42,
          0.3,
          0.25,
          0.28,
          0.38
        ]
      }
    },
    {
      "id": "declaration-doc",
      "type": "document",
      "label": "Declaration of Independence",
      "attributes": {
        "name": "Declaration of Independence",
        "date": "1776-07-04",
        "authors": [
          "Thomas Jefferson",
          "Continental Congress"
        ],
        "description": "Document declaring the thirteen American colonies as independent sovereign states",
        "significance": "Foundational document of the United States",
        "keywords": [
          "independence",
          "liberty",
          "rights",
          "revolution",
          "Jefferson"
        ],
        "vector": [
          0.45,
          0.3,
          0.35,
          0.15,
          0.25,
          -0.1
        ]
      }
    },
    {
      "id": "constitution-doc",
      "type": "document",
      "label": "United States Constitution",
      "attributes": {
        "name": "United States Constitution",
        "date": "1787-09-17",
        "authors": [
          "Constitutional Convention Delegates"
        ],
        "description": "Supreme law of the United States establishing the structure of the federal government",
        "significance": "Foundational legal document of the United States",
        "keywords": [
          "government",
          "law",
          "rights",
          "federalism",
          "branches"
        ],
        "vector": [
          0.42,
          0.28,
          0.38,
          0.12,
          0.22,
          -0.08
        ]
      }
    },
    {
      "id": "gettysburg-address",
      "type": "document",
      "label": "Gettysburg Address",
      "attributes": {
        "name": "Gettysburg Address",
        "date": "1863-11-19",
        "authors": [
          "Abraham Lincoln"
        ],
        "description": "Speech given by President Lincoln during the Civil War",
        "significance": "Redefined the purpose of the Civil War and American democracy",
        "keywords": [
          "civil war",
          "liberty",
          "democracy",
          "equality",
          "Lincoln"
        ],
        "vector": [
          0.44,
          0.32,
          0.36,
          0.18,
          0.28,
          -0.05
        ]
      }
    },
    {
      "id": "democracy-1776",
      "type": "temporal_snapshot",
      "label": "democracy-1776",
      "attributes": {
        "entityId": "democracy",
        "timestamp": "1776",
        "popularity": 0.4,
        "global_influence": 0.2,
        "description": "Democracy at founding of United States"
      }
    },
    {
      "id": "democracy-1800",
      "type": "temporal_snapshot",
      "label": "democracy-1800",
      "attributes": {
        "entityId": "democracy",
        "timestamp": "1800",
        "popularity": 0.5,
        "global_influence": 0.3,
        "description": "Democracy in early republic era"
      }
    },
    {
      "id": "democracy-1850",
      "type": "temporal_snapshot",
      "label": "democracy-1850",
      "attributes": {
        "entityId": "democracy",
        "timestamp": "1850",
        "popularity": 0.6,
        "global_influence": 0.4,
        "description": "Democracy in pre-Civil War America"
      }
    },
    {
      "id": "democracy-1900",
      "type": "temporal_snapshot",
      "label": "democracy-1900",
      "attributes": {
        "entityId": "democracy",
        "timestamp": "1900",
        "popularity": 0.7,
        "global_influence": 0.5,
        "description": "Democracy during Progressive Era"
      }
    },
    {
      "id": "democracy-1950",
      "type": "temporal_snapshot",
      "label": "democracy-1950",
      "attributes": {
        "entityId": "democracy",
        "timestamp": "1950",
        "popularity": 0.8,
        "global_influence": 0.7,
        "description": "Democracy during Cold War"
      }
    },
    {
      "id": "democracy-2000",
      "type": "temporal_snapshot",
      "label": "democracy-2000",
      "attributes": {
        "entityId": "democracy",
        "timestamp": "2000",
        "popularity": 0.9,
        "global_influence": 0.8,
        "description": "Democracy in modern era"
      }
    },
    {
      "id": "democracy-2020",
      "type": "temporal_snapshot",
      "label": "democracy-2020",
      "attributes": {
        "entityId": "democracy",
        "timestamp": "2020",
        "popularity": 0.85,
        "global_influence": 0.75,
        "description": "Democracy in contemporary America"
      }
    },
    {
      "id": "slavery-1700",
      "type": "temporal_snapshot",
      "label": "slavery-1700",
      "attributes": {
        "entityId": "slavery",
        "timestamp": "1700",
        "acceptance": 0.8,
        "economic_importance": 0.7,
        "description": "Slavery in colonial America"
      }
    },
    {
      "id": "slavery-1776",
      "type": "temporal_snapshot",
      "label": "slavery-1776",
      "attributes": {
        "entityId": "slavery",
        "timestamp": "1776",
        "acceptance": 0.7,
        "economic_importance": 0.8,
        "description": "Slavery at founding of United States"
      }
    },
    {
      "id": "slavery-1800",
      "type": "temporal_snapshot",
      "label": "slavery-1800",
      "attributes": {
        "entityId": "slavery",
        "timestamp": "1800",
        "acceptance": 0.65,
        "economic_importance": 0.85,
        "description": "Slavery during early republic"
      }
    },
    {
      "id": "slavery-1850",
      "type": "temporal_snapshot",
      "label": "slavery-1850",
      "attributes": {
        "entityId": "slavery",
        "timestamp": "1850",
        "acceptance": 0.5,
        "economic_importance": 0.8,
        "description": "Slavery during antebellum period"
      }
    },
    {
      "id": "slavery-1863",
      "type": "temporal_snapshot",
      "label": "slavery-1863",
      "attributes": {
        "entityId": "slavery",
        "timestamp": "1863",
        "acceptance": 0.3,
        "economic_importance": 0.6,
        "description": "Slavery during Civil War"
      }
    },
    {
      "id": "slavery-1870",
      "type": "temporal_snapshot",
      "label": "slavery-1870",
      "attributes": {
        "entityId": "slavery",
        "timestamp": "1870",
        "acceptance": 0.1,
        "economic_importance": 0.1,
        "description": "Slavery after emancipation"
      }
    },
    {
      "id": "founding-era",
      "type": "historical_snapshot",
      "label": "founding-era",
      "attributes": {
        "date": "1789-04-30",
        "description": "Beginning of George Washington's presidency",
        "significance": "Start of the Constitutional government of the United States"
      }
    },
    {
      "id": "pre-civil-war",
      "type": "historical_snapshot",
      "label": "pre-civil-war",
      "attributes": {
        "date": "1860-11-06",
        "description": "Election of Abraham Lincoln",
        "significance": "Event that triggered secession of Southern states"
      }
    },
    {
      "id": "civil-rights-era",
      "type": "historical_snapshot",
      "label": "civil-rights-era",
      "attributes": {
        "date": "1964-07-02",
        "description": "Civil Rights Act of 1964",
        "significance": "Landmark civil rights legislation"
      }
    },
    {
      "id": "post-cold-war",
      "type": "historical_snapshot",
      "label": "post-cold-war",
      "attributes": {
        "date": "1991-12-26",
        "description": "Dissolution of the Soviet Union",
        "significance": "End of the Cold War and beginning of a new geopolitical era"
      }
    },
    {
      "id": "ideological-space",
      "type": "vector_space",
      "label": "Ideological Positions",
      "attributes": {
        "name": "Ideological Positions",
        "description": "Ideological positions and political philosophies",
        "dimensions": [
          "individual_liberty",
          "equality",
          "government_role",
          "tradition",
          "progress",
          "isolationism"
        ]
      }
    },
    {
      "id": "social-values-space",
      "type": "vector_space",
      "label": "Social Values",
      "attributes": {
        "name": "Social Values",
        "description": "Social and cultural values across time",
        "dimensions": [
          "individualism",
          "community",
          "diversity",
          "spirituality",
          "materialism",
          "civic_duty"
        ]
      }
    },
    {
      "id": "founding-principles-cluster",
      "type": "semantic_cluster",
      "label": "Founding Principles",
      "attributes": {
        "name": "Founding Principles",
        "centerVector": [
          0.4,
          0.35,
          0.25,
          0.3,
          0.25,
          0.1
        ],
        "vectorSpace": "ideological-space",
        "description": "Cluster representing founding principles of American democracy"
      }
    },
    {
      "id": "civil-rights-cluster",
      "type": "semantic_cluster",
      "label": "Civil Rights Movement",
      "attributes": {
        "name": "Civil Rights Movement",
        "centerVector": [
          0.45,
          0.4,
          0.3,
          0.2,
          0.35,
          0.15
        ],
        "vectorSpace": "ideological-space",
        "description": "Cluster representing civil rights movement principles"
      }
    },
    {
      "id": "economic-development-cluster",
      "type": "semantic_cluster",
      "label": "Economic Development",
      "attributes": {
        "name": "Economic Development",
        "centerVector": [
          0.3,
          0.25,
          0.35,
          0.25,
          0.3,
          0.25
        ],
        "vectorSpace": "ideological-space",
        "description": "Cluster representing economic development principles"
      }
    },
    {
      "id": "democracy-rights-similarity",
      "type": "similarity_analysis",
      "label": "Democracy and Civil Rights Relationship",
      "attributes": {
        "name": "Democracy and Civil Rights Relationship",
        "entities": [
          "democracy",
          "civil-rights-concept"
        ],
        "similarity": 0.85,
        "interpretation": "Strong conceptual link between democratic governance and civil rights"
      }
    },
    {
      "id": "liberty-dream-similarity",
      "type": "similarity_analysis",
      "label": "Liberty and American Dream Relationship",
      "attributes": {
        "name": "Liberty and American Dream Relationship",
        "entities": [
          "declaration-independence",
          "american-dream"
        ],
        "similarity": 0.78,
        "interpretation": "American founding principles closely aligned with aspirational values"
      }
    },
    {
      "id": "democracy-evolution",
      "type": "concept_drift",
      "label": "Evolution of Democracy",
      "attributes": {
        "name": "Evolution of Democracy",
        "concept": "democracy",
        "startPoint": "1776",
        "endPoint": "2020",
        "drift": 0.35,
        "interpretation": "Significant expansion of democratic concepts to include broader participation"
      }
    },
    {
      "id": "equality-evolution",
      "type": "concept_drift",
      "label": "Evolution of Equality",
      "attributes": {
        "name": "Evolution of Equality",
        "concept": "civil-rights-concept",
        "startPoint": "1776",
        "endPoint": "2020",
        "drift": 0.62,
        "interpretation": "Major transformation in understanding of equality across demographic groups"
      }
    }
  ],
  "links": [
    {
      "source": "jamestown-founding",
      "target": "colonial-period",
      "type": "occurred_during",
      "attributes": {}
    },
    {
      "source": "plymouth-colony",
      "target": "colonial-period",
      "type": "occurred_during",
      "attributes": {}
    },
    {
      "source": "declaration-independence",
      "target": "revolutionary-war",
      "type": "occurred_during",
      "attributes": {}
    },
    {
      "source": "constitutional-convention",
      "target": "early-republic",
      "type": "occurred_during",
      "attributes": {}
    },
    {
      "source": "louisiana-purchase",
      "target": "early-republic",
      "type": "occurred_during",
      "attributes": {}
    },
    {
      "source": "civil-war-start",
      "target": "civil-war",
      "type": "occurred_during",
      "attributes": {}
    },
    {
      "source": "emancipation-proclamation",
      "target": "civil-war",
      "type": "occurred_during",
      "attributes": {}
    },
    {
      "source": "civil-war-end",
      "target": "civil-war",
      "type": "occurred_during",
      "attributes": {}
    },
    {
      "source": "womens-suffrage",
      "target": "progressive-era",
      "type": "occurred_during",
      "attributes": {}
    },
    {
      "source": "stock-market-crash",
      "target": "great-depression",
      "type": "occurred_during",
      "attributes": {}
    },
    {
      "source": "pearl-harbor",
      "target": "world-war-2",
      "type": "occurred_during",
      "attributes": {}
    },
    {
      "source": "mlk-speech",
      "target": "civil-rights",
      "type": "occurred_during",
      "attributes": {}
    },
    {
      "source": "mlk-speech",
      "target": "cold-war",
      "type": "occurred_during",
      "attributes": {}
    },
    {
      "source": "moon-landing",
      "target": "cold-war",
      "type": "occurred_during",
      "attributes": {}
    },
    {
      "source": "september-11",
      "target": "modern-era",
      "type": "occurred_during",
      "attributes": {}
    },
    {
      "source": "obama-election",
      "target": "modern-era",
      "type": "occurred_during",
      "attributes": {}
    },
    {
      "source": "washington",
      "target": "declaration-independence",
      "type": "participated_in",
      "attributes": {}
    },
    {
      "source": "jefferson",
      "target": "declaration-independence",
      "type": "created",
      "attributes": {}
    },
    {
      "source": "jefferson",
      "target": "louisiana-purchase",
      "type": "initiated",
      "attributes": {}
    },
    {
      "source": "lincoln",
      "target": "civil-war-start",
      "type": "led_during",
      "attributes": {}
    },
    {
      "source": "lincoln",
      "target": "emancipation-proclamation",
      "type": "issued",
      "attributes": {}
    },
    {
      "source": "lincoln",
      "target": "civil-war-end",
      "type": "led_during",
      "attributes": {}
    },
    {
      "source": "roosevelt-fdr",
      "target": "pearl-harbor",
      "type": "led_during",
      "attributes": {}
    },
    {
      "source": "mlk",
      "target": "mlk-speech",
      "type": "delivered",
      "attributes": {}
    },
    {
      "source": "washington",
      "target": "democracy",
      "type": "championed",
      "attributes": {}
    },
    {
      "source": "jefferson",
      "target": "democracy",
      "type": "championed",
      "attributes": {}
    },
    {
      "source": "douglass",
      "target": "slavery",
      "type": "opposed",
      "attributes": {}
    },
    {
      "source": "douglass",
      "target": "civil-rights-concept",
      "type": "championed",
      "attributes": {}
    },
    {
      "source": "lincoln",
      "target": "slavery",
      "type": "opposed",
      "attributes": {}
    },
    {
      "source": "mlk",
      "target": "civil-rights-concept",
      "type": "championed",
      "attributes": {}
    },
    {
      "source": "declaration-independence",
      "target": "democracy",
      "type": "exemplifies",
      "attributes": {}
    },
    {
      "source": "emancipation-proclamation",
      "target": "slavery",
      "type": "opposed",
      "attributes": {}
    },
    {
      "source": "louisiana-purchase",
      "target": "manifest-destiny",
      "type": "exemplifies",
      "attributes": {}
    },
    {
      "source": "mlk-speech",
      "target": "civil-rights-concept",
      "type": "exemplifies",
      "attributes": {}
    },
    {
      "source": "obama-election",
      "target": "american-dream",
      "type": "exemplifies",
      "attributes": {}
    },
    {
      "source": "declaration-doc",
      "target": "jefferson",
      "type": "authored_by",
      "attributes": {}
    },
    {
      "source": "constitution-doc",
      "target": "washington",
      "type": "supported_by",
      "attributes": {}
    },
    {
      "source": "gettysburg-address",
      "target": "lincoln",
      "type": "authored_by",
      "attributes": {}
    },
    {
      "source": "declaration-doc",
      "target": "declaration-independence",
      "type": "produced_during",
      "attributes": {}
    },
    {
      "source": "constitution-doc",
      "target": "constitutional-convention",
      "type": "produced_during",
      "attributes": {}
    },
    {
      "source": "gettysburg-address",
      "target": "civil-war",
      "type": "produced_during",
      "attributes": {}
    },
    {
      "source": "democracy",
      "target": "democracy-1776",
      "type": "has_state_at",
      "attributes": {}
    },
    {
      "source": "democracy",
      "target": "democracy-1800",
      "type": "has_state_at",
      "attributes": {}
    },
    {
      "source": "democracy",
      "target": "democracy-1850",
      "type": "has_state_at",
      "attributes": {}
    },
    {
      "source": "democracy",
      "target": "democracy-1900",
      "type": "has_state_at",
      "attributes": {}
    },
    {
      "source": "democracy",
      "target": "democracy-1950",
      "type": "has_state_at",
      "attributes": {}
    },
    {
      "source": "democracy",
      "target": "democracy-2000",
      "type": "has_state_at",
      "attributes": {}
    },
    {
      "source": "democracy",
      "target": "democracy-2020",
      "type": "has_state_at",
      "attributes": {}
    },
    {
      "source": "slavery",
      "target": "slavery-1700",
      "type": "has_state_at",
      "attributes": {}
    },
    {
      "source": "slavery",
      "target": "slavery-1776",
      "type": "has_state_at",
      "attributes": {}
    },
    {
      "source": "slavery",
      "target": "slavery-1800",
      "type": "has_state_at",
      "attributes": {}
    },
    {
      "source": "slavery",
      "target": "slavery-1850",
      "type": "has_state_at",
      "attributes": {}
    },
    {
      "source": "slavery",
      "target": "slavery-1863",
      "type": "has_state_at",
      "attributes": {}
    },
    {
      "source": "slavery",
      "target": "slavery-1870",
      "type": "has_state_at",
      "attributes": {}
    },
    {
      "source": "democracy",
      "target": "founding-principles-cluster",
      "type": "belongs_to_cluster",
      "attributes": {}
    },
    {
      "source": "declaration-doc",
      "target": "founding-principles-cluster",
      "type": "belongs_to_cluster",
      "attributes": {}
    },
    {
      "source": "constitution-doc",
      "target": "founding-principles-cluster",
      "type": "belongs_to_cluster",
      "attributes": {}
    },
    {
      "source": "washington",
      "target": "founding-principles-cluster",
      "type": "belongs_to_cluster",
      "attributes": {}
    },
    {
      "source": "jefferson",
      "target": "founding-principles-cluster",
      "type": "belongs_to_cluster",
      "attributes": {}
    },
    {
      "source": "civil-rights-concept",
      "target": "civil-rights-cluster",
      "type": "belongs_to_cluster",
      "attributes": {}
    },
    {
      "source": "mlk",
      "target": "civil-rights-cluster",
      "type": "belongs_to_cluster",
      "attributes": {}
    },
    {
      "source": "mlk-speech",
      "target": "civil-rights-cluster",
      "type": "belongs_to_cluster",
      "attributes": {}
    },
    {
      "source": "douglass",
      "target": "civil-rights-cluster",
      "type": "belongs_to_cluster",
      "attributes": {}
    },
    {
      "source": "american-dream",
      "target": "economic-development-cluster",
      "type": "belongs_to_cluster",
      "attributes": {}
    },
    {
      "source": "roosevelt-fdr",
      "target": "economic-development-cluster",
      "type": "belongs_to_cluster",
      "attributes": {}
    },
    {
      "source": "stock-market-crash",
      "target": "economic-development-cluster",
      "type": "belongs_to_cluster",
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
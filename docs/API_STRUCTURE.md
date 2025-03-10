# UltraLink API Structure

This document provides a comprehensive visualization of the UltraLink API structure, showing the relationships between key components and methods.

## Core Architecture

```mermaid
classDiagram
    class UltraLink {
        +Map entities
        +Map relationships
        +Map relationshipsBySource
        +Map relationshipsByTarget
        +Map links
        +Object config
        +addEntity(id, type, attributes)
        +getEntity(id)
        +updateEntity(id, updates)
        +deleteEntity(id)
        +findEntities(criteria)
        +addLink(sourceId, targetId, type, attributes)
        +addRelationship(sourceId, targetId, type, attributes)
        +getRelationship(id)
        +updateRelationship(id, updates)
        +deleteRelationship(id)
        +deleteLink(sourceId, targetId, type)
        +findRelationships(criteria)
        +parse(content, id)
        +checkIntegrity(options)
        +repairIntegrityIssues(issues)
    }

    class EntityManager {
        +addEntity(id, type, attributes)
        +getEntity(id)
        +updateEntity(id, updates)
        +deleteEntity(id)
        +findEntities(criteria)
    }

    class RelationshipManager {
        +addRelationship(sourceId, targetId, type, attributes)
        +getRelationship(id)
        +updateRelationship(id, updates)
        +deleteRelationship(id)
        +findRelationships(criteria)
    }

    class Exporters {
        +toJSON(options)
        +toCSV(options)
        +toGraphML(options)
        +toObsidian(options)
        +toHTMLWebsite(options)
        +toKIF(options)
        +toVisualization(options)
        +toBayesianNetwork(options)
        +toRxInfer(options)
        +toFullBlob(options)
    }

    UltraLink --> EntityManager : uses
    UltraLink --> RelationshipManager : uses
    UltraLink --> Exporters : uses
```

## Entity-Relationship Model

```mermaid
erDiagram
    ENTITY ||--o{ RELATIONSHIP : participates
    ENTITY {
        string id
        string type
        object attributes
        object metadata
    }
    RELATIONSHIP {
        string id
        string source
        string target
        string type
        object attributes
        object metadata
    }
    
    ULTRALINK ||--o{ ENTITY : manages
    ULTRALINK ||--o{ RELATIONSHIP : manages
    ULTRALINK {
        object config
        object store
    }
```

## Method Call Flow

```mermaid
flowchart TD
    subgraph Client["Client Code"]
        Create["Create UltraLink Instance"]
        AddEntities["Add Entities"]
        AddLinks["Add Links/Relationships"]
        Export["Export Data"]
    end

    subgraph API["UltraLink API"]
        UL["new UltraLink()"]
        AddE["addEntity(id, type, attributes)"]
        AddR["addLink(source, target, type, attributes)"]
        ExportM["toJSON(), toCSV(), etc."]
    end

    subgraph Internal["Internal Processing"]
        EntityM["EntityManager methods"]
        RelationshipM["RelationshipManager methods"]
        ExporterM["Exporter methods"]
    end

    Create --> UL
    AddEntities --> AddE
    AddLinks --> AddR
    Export --> ExportM

    AddE --> EntityM
    AddR --> RelationshipM
    ExportM --> ExporterM

    classDef client fill:#4a6fa5,stroke:#2b5086,color:white
    classDef api fill:#57a773,stroke:#2e8049,color:white
    classDef internal fill:#ef8354,stroke:#e85f17,color:white

    class Client client
    class API api
    class Internal internal
```

## Export Workflow

```mermaid
flowchart LR
    UltraLink["UltraLink Instance"] --> JSONExp["toJSON()"]
    UltraLink --> CSVExp["toCSV()"]
    UltraLink --> GraphMLExp["toGraphML()"]
    UltraLink --> ObsidianExp["toObsidian()"]
    UltraLink --> HTMLExp["toHTMLWebsite()"]
    UltraLink --> VisExp["toVisualization()"]
    UltraLink --> KIFExp["toKIF()"]
    UltraLink --> BayesExp["toBayesianNetwork()"]
    UltraLink --> RxInferExp["toRxInfer()"]
    UltraLink --> BlobExp["toFullBlob()"]

    JSONExp --> JSONOut["JSON data/file"]
    CSVExp --> CSVOut["CSV files"]
    GraphMLExp --> GraphMLOut["GraphML file"]
    ObsidianExp --> ObsidianOut["Markdown files"]
    HTMLExp --> HTMLOut["HTML website"]
    VisExp --> VisOut["SVG/PNG/Interactive"]
    KIFExp --> KIFOut["KIF format"]
    BayesExp --> BayesOut["Bayesian Network"]
    RxInferExp --> RxInferOut["Julia code"]
    BlobExp --> BlobOut["Full data dump"]

    classDef instance fill:#4a6fa5,stroke:#2b5086,color:white
    classDef method fill:#57a773,stroke:#2e8049,color:white
    classDef output fill:#ef8354,stroke:#e85f17,color:white

    class UltraLink instance
    class JSONExp,CSVExp,GraphMLExp,ObsidianExp,HTMLExp,VisExp,KIFExp,BayesExp,RxInferExp,BlobExp method
    class JSONOut,CSVOut,GraphMLOut,ObsidianOut,HTMLOut,VisOut,KIFOut,BayesOut,RxInferOut,BlobOut output
```

## Visualization Options

```mermaid
flowchart TD
    subgraph Visualization["toVisualization() Options"]
        Format["format: 'svg'|'png'|'d3'|'cytoscape'"]
        Layout["layout: 'force'|'radial'|'grid'|'cluster'"]
        Style["style: 'default'|'colorful'|'grayscale'|'minimal'"]
        Size["width: number, height: number"]
        Controls["includeControls: boolean"]
        Labels["includeLabels: boolean"]
        Title["title: string"]
        Description["description: string"]
    end
    
    Visualization --> SVG["SVG output"]
    Visualization --> PNG["PNG output"]
    Visualization --> D3["D3.js visualization"]
    Visualization --> Cytoscape["Cytoscape.js visualization"]
    
    classDef options fill:#4a6fa5,stroke:#2b5086,color:white
    classDef output fill:#57a773,stroke:#2e8049,color:white
    
    class Visualization options
    class SVG,PNG,D3,Cytoscape output
```

## Common API Patterns

```mermaid
sequenceDiagram
    participant Client
    participant UltraLink
    participant EntityManager
    participant RelationshipManager
    participant Exporters
    
    Client->>UltraLink: new UltraLink(config)
    activate UltraLink
    UltraLink-->>Client: UltraLink instance
    deactivate UltraLink
    
    Client->>UltraLink: addEntity(id, type, attributes)
    activate UltraLink
    UltraLink->>EntityManager: addEntity.call(this, id, type, attributes)
    activate EntityManager
    EntityManager-->>UltraLink: entity object
    deactivate EntityManager
    UltraLink-->>Client: entity object
    deactivate UltraLink
    
    Client->>UltraLink: addLink(source, target, type, attributes)
    activate UltraLink
    UltraLink->>RelationshipManager: addRelationship.call(this, source, target, type, attributes)
    activate RelationshipManager
    RelationshipManager-->>UltraLink: relationship object
    deactivate RelationshipManager
    UltraLink-->>Client: relationship object
    deactivate UltraLink
    
    Client->>UltraLink: toJSON() / toCSV() / etc.
    activate UltraLink
    UltraLink->>Exporters: exporter(this, options)
    activate Exporters
    Exporters-->>UltraLink: exported data
    deactivate Exporters
    UltraLink-->>Client: exported data
    deactivate UltraLink
```

This documentation provides a comprehensive visual overview of the UltraLink API structure and usage patterns. For detailed method descriptions, options, and code examples, refer to the [API Usage Guide](API_USAGE.md). 
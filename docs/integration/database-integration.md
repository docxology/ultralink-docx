# Database Integration

This document provides comprehensive guidance on integrating UltraLink with various database systems for production deployments. UltraLink supports multiple database backends through its adapter architecture.

## Database Adapter Architecture

UltraLink's database integration is built on a flexible adapter architecture that provides consistent interfaces across different storage backends:

```mermaid
classDiagram
    class StorageInterface {
        +initialize()
        +createEntity(entity)
        +getEntity(id)
        +updateEntity(id, changes)
        +deleteEntity(id)
        +createRelationship(relationship)
        +getRelationship(id)
        +deleteRelationship(id)
        +findEntities(query)
        +findRelationships(query)
    }
    
    class BaseAdapter {
        #config: AdapterConfig
        +initialize()
        +validateConfig()
        #handleError(error)
    }
    
    class MemoryAdapter {
        -entities: Map~string, Entity~
        -relationships: Map~string, Relationship~
        -indices: Object
        +initialize()
        +createEntity(entity)
        +getEntity(id)
        // Other implementation methods
    }
    
    class PostgresAdapter {
        -pool: ConnectionPool
        -queryBuilder: QueryBuilder
        +initialize()
        +createEntity(entity)
        +getEntity(id)
        // Other implementation methods
        -buildQuery(params)
    }
    
    class MongoAdapter {
        -client: MongoClient
        -db: Database
        -collections: Object
        +initialize()
        +createEntity(entity)
        +getEntity(id)
        // Other implementation methods
        -transformQuery(query)
    }
    
    class Neo4jAdapter {
        -driver: Neo4jDriver
        -session: Session
        +initialize()
        +createEntity(entity)
        +getEntity(id)
        // Other implementation methods
        -runCypher(query, params)
    }
    
    StorageInterface <|.. BaseAdapter
    BaseAdapter <|-- MemoryAdapter
    BaseAdapter <|-- PostgresAdapter
    BaseAdapter <|-- MongoAdapter
    BaseAdapter <|-- Neo4jAdapter
```

## Database Integration Flow

The following diagram shows how UltraLink interacts with different database systems:

```mermaid
flowchart TD
    subgraph UltraLink["UltraLink Core"]
        API[API Layer]
        EntityMgr[Entity Manager]
        RelationMgr[Relationship Manager]
        AdapterMgr[Adapter Manager]
    end
    
    subgraph Adapters["Database Adapters"]
        Memory[Memory Adapter]
        Postgres[PostgreSQL Adapter]
        MongoDB[MongoDB Adapter]
        Neo4j[Neo4j Adapter]
        SQLite[SQLite Adapter]
        Custom[Custom Adapters]
    end
    
    subgraph Databases["Database Systems"]
        PostgresDB[PostgreSQL]
        MongoDBServer[MongoDB]
        Neo4jServer[Neo4j]
        SQLiteDB[SQLite]
        CustomDB[Custom Databases]
    end
    
    API --> EntityMgr
    API --> RelationMgr
    EntityMgr --> AdapterMgr
    RelationMgr --> AdapterMgr
    
    AdapterMgr --> Memory
    AdapterMgr --> Postgres
    AdapterMgr --> MongoDB
    AdapterMgr --> Neo4j
    AdapterMgr --> SQLite
    AdapterMgr --> Custom
    
    Postgres --> PostgresDB
    MongoDB --> MongoDBServer
    Neo4j --> Neo4jServer
    SQLite --> SQLiteDB
    Custom --> CustomDB
    
    classDef ultralink fill:#f5f5f5,stroke:#333,stroke-width:2px
    classDef adapter fill:#d4f1f9,stroke:#333,stroke-width:1px
    classDef database fill:#d5e8d4,stroke:#333,stroke-width:1px
    
    class UltraLink ultralink
    class Memory,Postgres,MongoDB,Neo4j,SQLite,Custom adapter
    class PostgresDB,MongoDBServer,Neo4jServer,SQLiteDB,CustomDB database
```

## Database Schema Models

Each database adapter implements the UltraLink data model differently based on database capabilities:

```mermaid
graph TD
    subgraph Relational["Relational Database (PostgreSQL)"]
        direction TB
        
        entity_table[Entities Table]
        entity_attrs[Entity Attributes Table]
        rel_table[Relationships Table]
        rel_attrs[Relationship Attributes Table]
        
        entity_table -->|1:N| entity_attrs
        rel_table -->|1:N| rel_attrs
        entity_table -->|1:N| rel_table
        entity_table -->|1:N| rel_table
    end
    
    subgraph Document["Document Database (MongoDB)"]
        direction TB
        
        entities_coll[Entities Collection]
        rels_coll[Relationships Collection]
        
        entities_coll -.->|referenced by| rels_coll
    end
    
    subgraph Graph["Graph Database (Neo4j)"]
        direction TB
        
        nodes[Nodes with Properties]
        edges[Relationships with Properties]
        
        nodes -->|connected by| edges
    end
    
    classDef relational fill:#f9d9d0,stroke:#333,stroke-width:1px
    classDef document fill:#d0f9d5,stroke:#333,stroke-width:1px
    classDef graph fill:#d0d9f9,stroke:#333,stroke-width:1px
    
    class Relational relational
    class Document document
    class Graph graph
    class entity_table,entity_attrs,rel_table,rel_attrs relational
    class entities_coll,rels_coll document
    class nodes,edges graph
```

## PostgreSQL Integration

### Schema Design

```mermaid
erDiagram
    ENTITIES {
        string id PK
        string type
        jsonb metadata
        timestamp created_at
        timestamp updated_at
        vector embedding
    }
    
    ENTITY_ATTRIBUTES {
        string entity_id FK
        string key
        jsonb value
    }
    
    RELATIONSHIPS {
        string id PK
        string source_id FK
        string target_id FK
        string type
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }
    
    RELATIONSHIP_ATTRIBUTES {
        string relationship_id FK
        string key
        jsonb value
    }
    
    ENTITIES ||--o{ ENTITY_ATTRIBUTES : has
    ENTITIES ||--o{ RELATIONSHIPS : "is source of"
    ENTITIES ||--o{ RELATIONSHIPS : "is target of"
    RELATIONSHIPS ||--o{ RELATIONSHIP_ATTRIBUTES : has
```

### Configuration

```typescript
import { UltraLink } from '@ultralink/core';
import { PostgresAdapter } from '@ultralink/storage-postgres';

const ultralink = new UltraLink({
  storage: {
    adapter: new PostgresAdapter({
      host: 'localhost',
      port: 5432,
      database: 'ultralink',
      user: 'postgres',
      password: 'password',
      ssl: process.env.NODE_ENV === 'production',
      
      // Schema options
      schema: 'ultralink',
      entityTable: 'entities',
      relationshipTable: 'relationships',
      
      // Connection pool config
      pool: {
        min: 2,
        max: 10,
        idleTimeoutMillis: 30000
      },
      
      // Additional options
      vectorExtension: 'pgvector',
      enableMigrations: true,
      migrationsTable: 'ultralink_migrations'
    })
  }
});

await ultralink.initialize();
```

## MongoDB Integration

### Collection Design

```mermaid
graph TB
    subgraph Entities["Entities Collection"]
        direction LR
        entity["{<br/>_id: '123',<br/>type: 'document',<br/>attributes: {<br/>  title: 'Example',<br/>  content: 'Text'<br/>},<br/>metadata: {},<br/>createdAt: ISODate,<br/>updatedAt: ISODate,<br/>vector: [0.1, 0.2, ...]<br/>}"]
    end
    
    subgraph Relationships["Relationships Collection"]
        direction LR
        relationship["{<br/>_id: '456',<br/>source: '123',<br/>target: '789',<br/>type: 'references',<br/>attributes: {<br/>  strength: 0.8<br/>},<br/>metadata: {},<br/>createdAt: ISODate,<br/>updatedAt: ISODate<br/>}"]
    end
    
    classDef mongodb fill:#589636,stroke:#fff,color:#fff
    class Entities,Relationships mongodb
```

### Configuration

```typescript
import { UltraLink } from '@ultralink/core';
import { MongoAdapter } from '@ultralink/storage-mongodb';

const ultralink = new UltraLink({
  storage: {
    adapter: new MongoAdapter({
      uri: 'mongodb://localhost:27017',
      database: 'ultralink',
      
      // Collection names
      entitiesCollection: 'entities',
      relationshipsCollection: 'relationships',
      
      // Connection options
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      // Index options
      createIndexes: true,
      vectorIndexConfig: {
        dimensions: 1536,
        type: 'hnsw',
        similarity: 'cosine'
      }
    })
  }
});

await ultralink.initialize();
```

## Neo4j Integration

### Graph Model

```mermaid
graph TD
    subgraph Graph["Neo4j Graph Model"]
        direction LR
        
        doc1((Document<br/>id: doc1<br/>title: Getting Started))
        doc2((Document<br/>id: doc2<br/>title: Advanced Guide))
        person1((Person<br/>id: person1<br/>name: Jane Smith))
        
        person1 -->|AUTHORED<br/>date: 2023-05-15| doc1
        doc1 -->|REFERENCES<br/>strength: 0.9| doc2
    end
    
    classDef neo4j fill:#4581b9,stroke:#fff,color:#fff
    class Graph neo4j
```

### Configuration

```typescript
import { UltraLink } from '@ultralink/core';
import { Neo4jAdapter } from '@ultralink/storage-neo4j';

const ultralink = new UltraLink({
  storage: {
    adapter: new Neo4jAdapter({
      uri: 'neo4j://localhost:7687',
      username: 'neo4j',
      password: 'password',
      database: 'ultralink',
      
      // Connection options
      maxConnectionPoolSize: 50,
      connectionTimeout: 30000,
      
      // Graph model options
      entityLabel: 'Entity',
      relationshipPrefix: 'REL_',
      useNativeTypes: true,
      
      // Vector configuration
      vectorProperty: 'embedding'
    })
  }
});

await ultralink.initialize();
```

## Database Migration Workflow

UltraLink provides tools to help migrate data between different database backends:

```mermaid
sequenceDiagram
    participant User
    participant CLI as UltraLink CLI
    participant Source as Source Adapter
    participant Target as Target Adapter
    
    User->>CLI: ultralink migrate --source=postgres --target=neo4j
    activate CLI
    
    CLI->>CLI: Validate configuration
    CLI->>Source: Initialize source connection
    activate Source
    
    CLI->>Target: Initialize target connection
    activate Target
    
    CLI->>Source: Get entity count & schema
    Source-->>CLI: Entity count & schema
    
    CLI->>CLI: Create migration plan
    
    loop For each batch of entities
        CLI->>Source: Get entities batch
        Source-->>CLI: Entities batch
        CLI->>CLI: Transform entities
        CLI->>Target: Store entities
        Target-->>CLI: Storage confirmation
    end
    
    loop For each batch of relationships
        CLI->>Source: Get relationships batch
        Source-->>CLI: Relationships batch
        CLI->>CLI: Transform relationships
        CLI->>Target: Store relationships
        Target-->>CLI: Storage confirmation
    end
    
    CLI->>CLI: Verify migration
    CLI->>User: Display migration results
    
    deactivate Source
    deactivate Target
    deactivate CLI
```

## Performance Considerations

Each database backend has different performance characteristics:

```mermaid
graph TD
    subgraph performance[Performance Characteristics]
        direction TB
        
        read[Read Performance]
        write[Write Performance]
        query[Query Complexity]
        scale[Scalability]
        vector[Vector Operations]
        
        read --> read_db{Database Type}
        write --> write_db{Database Type}
        query --> query_db{Database Type}
        scale --> scale_db{Database Type}
        vector --> vector_db{Database Type}
        
        read_db -->|High| memory[Memory]
        read_db -->|Medium-High| postgres[PostgreSQL]
        read_db -->|Medium| mongo[MongoDB]
        read_db -->|Medium-High| neo4j[Neo4j]
        
        write_db -->|High| memory
        write_db -->|Medium| postgres
        write_db -->|High| mongo
        write_db -->|Medium| neo4j
        
        query_db -->|Simple| memory
        query_db -->|Complex| postgres
        query_db -->|Medium| mongo
        query_db -->|Complex Traversal| neo4j
        
        scale_db -->|Low| memory
        scale_db -->|High| postgres
        scale_db -->|Very High| mongo
        scale_db -->|Medium-High| neo4j
        
        vector_db -->|Medium| memory
        vector_db -->|High with pgvector| postgres
        vector_db -->|High with Atlas| mongo
        vector_db -->|Limited| neo4j
    end
    
    classDef perf fill:#d4f1f9,stroke:#333,stroke-width:1px
    classDef db fill:#d5e8d4,stroke:#333,stroke-width:1px
    classDef metric fill:#ffe6cc,stroke:#333,stroke-width:1px
    
    class performance perf
    class memory,postgres,mongo,neo4j db
    class read,write,query,scale,vector metric
```

## Best Practices

### Database Selection Guidelines

When choosing a database backend for UltraLink, consider the following factors:

1. **Data Volume**: 
   - Small-scale: Memory or SQLite
   - Medium-scale: PostgreSQL
   - Large-scale: MongoDB or PostgreSQL with sharding

2. **Query Patterns**:
   - Simple entity lookups: Any adapter
   - Complex relationship traversals: Neo4j
   - Advanced filtering with good performance: PostgreSQL
   - Flexible schema evolution: MongoDB

3. **Vector Search Requirements**:
   - Advanced vector search: PostgreSQL with pgvector
   - Integrated vector and text search: MongoDB Atlas
   - Simple vector operations: Memory adapter

4. **Deployment Environment**:
   - Serverless: MongoDB Atlas or Aurora PostgreSQL
   - On-premises: Any supported database
   - Edge computing: SQLite

## Links to Related Documentation

- [Storage Configuration Guide](../guides/storage-configuration.md)
- [Vector Index Optimization](../technical/vector-index-optimization.md)
- [Database Performance Benchmarks](../performance/database-benchmarks.md)
- [Migration Between Databases](../advanced/database-migration.md) 
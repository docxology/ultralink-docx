# Event System Architecture

UltraLink's event system provides a powerful mechanism for building reactive applications and enabling communication between different components of your application. This document outlines the architecture and usage patterns of the event system.

## Event System Overview

UltraLink implements a comprehensive event system that enables both internal components and external subscribers to respond to changes in the knowledge graph.

```mermaid
flowchart TD
    subgraph EventSystem["Event System Architecture"]
        direction TB
        EventBus[Event Bus]
        EventEmitter[Event Emitter]
        EventHandler[Event Handler]
        EventQueue[Event Queue]
        EventFilter[Event Filter]
    end
    
    subgraph Internal["Internal Components"]
        EntityMgr[Entity Manager]
        RelationshipMgr[Relationship Manager]
        VectorMgr[Vector Manager]
        Storage[Storage Adapter]
    end
    
    subgraph External["External Subscribers"]
        App[Application]
        Plugins[Plugins]
        UI[User Interface]
        Integrations[External Integrations]
    end
    
    Internal -->|emit events| EventEmitter
    EventEmitter -->|publish| EventBus
    EventBus -->|route| EventHandler
    EventBus -->|queue| EventQueue
    EventHandler -->|filter| EventFilter
    EventFilter -->|deliver| External
    
    classDef system fill:#f5f5f5,stroke:#333,stroke-width:2px
    classDef component fill:#d4f1f9,stroke:#333,stroke-width:1px
    classDef internal fill:#d5e8d4,stroke:#333,stroke-width:1px
    classDef external fill:#ffe6cc,stroke:#333,stroke-width:1px
    
    class EventSystem system
    class EventBus,EventEmitter,EventHandler,EventQueue,EventFilter component
    class EntityMgr,RelationshipMgr,VectorMgr,Storage internal
    class App,Plugins,UI,Integrations external
```

## Event Flow

The following sequence diagram illustrates the flow of events through the UltraLink system:

```mermaid
sequenceDiagram
    participant App as Application
    participant UL as UltraLink Core
    participant EM as Entity Manager
    participant EB as Event Bus
    participant S as Subscribers
    
    App->>UL: createEntity(entityData)
    activate UL
    
    UL->>EM: handleCreateEntity(entityData)
    activate EM
    
    EM->>EM: validateEntity(entityData)
    EM->>EM: generateId()
    EM->>EM: prepareEntity(entityData)
    
    EM->>EB: emit('entity.creating', entity)
    activate EB
    EB->>S: notify subscribers
    S-->>EB: Continue or cancel
    deactivate EB
    
    alt Event cancelled
        EM-->>UL: Throw cancellation error
        UL-->>App: Return error
    else Event continues
        EM->>EM: persistEntity(entity)
        EM->>EB: emit('entity.created', entity)
        activate EB
        EB->>S: notify subscribers
        deactivate EB
        
        EM-->>UL: Return created entity
        deactivate EM
        UL-->>App: Return created entity
    end
    
    deactivate UL
```

## Event Types

UltraLink emits a variety of events throughout its operation:

```mermaid
classDiagram
    class EventType {
        +String name
        +Object data
        +Object metadata
        +Function prevent()
        +Function resume()
    }
    
    EventType <|-- SystemEvent
    EventType <|-- EntityEvent
    EventType <|-- RelationshipEvent
    EventType <|-- VectorEvent
    EventType <|-- ExportEvent
    EventType <|-- QueryEvent
    
    class SystemEvent {
        +initialize
        +ready
        +shutdown
        +error
    }
    
    class EntityEvent {
        +entity.creating
        +entity.created
        +entity.updating
        +entity.updated
        +entity.deleting
        +entity.deleted
    }
    
    class RelationshipEvent {
        +relationship.creating
        +relationship.created
        +relationship.updating
        +relationship.updated
        +relationship.deleting
        +relationship.deleted
    }
    
    class VectorEvent {
        +vector.generating
        +vector.generated
        +vector.indexing
        +vector.indexed
        +vector.searching
        +vector.searched
    }
    
    class ExportEvent {
        +export.starting
        +export.progress
        +export.completed
        +export.failed
    }
    
    class QueryEvent {
        +query.executing
        +query.executed
        +query.failed
    }
```

## Event Bus Implementation

```mermaid
classDiagram
    class EventBus {
        -Map~string, Set~Handler~~ handlers
        -Queue eventQueue
        -Boolean eventsEnabled
        +on(event, handler, priority)
        +once(event, handler, priority)
        +off(event, handler)
        +emit(event, data)
        +emitAsync(event, data)
        -executeHandler(handler, event)
        -executeHandlersForEvent(event)
    }
    
    class EventQueue {
        -Array~Event~ queue
        -Boolean processing
        +enqueue(event)
        +process()
        -processNext()
    }
    
    class Handler {
        +Function callback
        +Number priority
        +Boolean once
        +execute(event)
    }
    
    class Event {
        +String name
        +Object data
        +Metadata metadata
        +Boolean prevented
        +Boolean async
        +prevent()
        +resume()
        +addMetadata(key, value)
    }
    
    EventBus --> EventQueue : uses
    EventBus --> Handler : manages
    EventQueue --> Event : processes
```

## Lifecycle Events

The following diagram illustrates the lifecycle events emitted during entity operations:

```mermaid
stateDiagram-v2
    [*] --> Creating: entity.creating
    Creating --> Created: entity.created
    Creating --> [*]: cancelled
    
    Created --> Updating: entity.updating
    Updating --> Updated: entity.updated
    Updating --> Created: cancelled
    
    Updated --> Deleting: entity.deleting
    Deleting --> Deleted: entity.deleted
    Deleting --> Updated: cancelled
    
    Deleted --> [*]
```

## Working with Events

### Event Subscription

```typescript
import { UltraLink } from '@ultralink/core';

const ultralink = new UltraLink();
await ultralink.initialize();

// Subscribe to entity created events
ultralink.events.on('entity.created', (event) => {
  const entity = event.data;
  console.log(`Entity created: ${entity.id} of type ${entity.type}`);
});

// Subscribe to events with wildcards
ultralink.events.on('entity.*', (event) => {
  console.log(`Entity event: ${event.name}`);
  console.log(`Entity: ${event.data.id}`);
});

// One-time subscription
ultralink.events.once('relationship.created', (event) => {
  console.log(`Relationship created: ${event.data.id}`);
});

// Priority handlers (higher numbers execute first)
ultralink.events.on('entity.creating', validateEntityHandler, 100);
ultralink.events.on('entity.creating', logEntityCreation, 10);
```

### Event Cancellation

```typescript
// Prevent an operation by cancelling the event
ultralink.events.on('entity.creating', (event) => {
  const entity = event.data;
  
  // Check if entity meets criteria
  if (!entity.attributes.title) {
    console.error('Entity must have a title');
    event.prevent(); // Cancels the operation
    return;
  }
  
  // Modify the entity before creation
  entity.attributes.createdBy = 'system';
});

// Handle cancellation errors
try {
  await ultralink.createEntity({ 
    type: 'document', 
    attributes: {} // Missing title
  });
} catch (error) {
  if (error.code === 'EVENT_PREVENTED') {
    console.log('Entity creation was prevented');
  }
}
```

### Asynchronous Event Handling

```typescript
// Asynchronous event handlers
ultralink.events.on('entity.created', async (event) => {
  const entity = event.data;
  
  // Perform asynchronous operations
  await updateExternalSystem(entity);
  await sendNotification(entity);
});

// Emit asynchronous events
await ultralink.events.emitAsync('custom.event', { 
  data: 'value'
});
```

## Event Monitoring

```mermaid
graph LR
    subgraph Monitoring["Event Monitoring"]
        direction TB
        Counter[Event Counters]
        Timing[Event Timing]
        Logging[Event Logging]
    end
    
    subgraph Events["Event Types"]
        direction TB
        System[System Events]
        Entity[Entity Events]
        Relationship[Relationship Events]
        Vector[Vector Events]
        Export[Export Events]
        Query[Query Events]
    end
    
    Events --> Monitoring
    
    classDef monitoring fill:#f5f5f5,stroke:#333,stroke-width:1px
    classDef events fill:#d4f1f9,stroke:#333,stroke-width:1px
    
    class Monitoring monitoring
    class Events,System,Entity,Relationship,Vector,Export,Query events
```

### Event Debugging

```typescript
// Enable detailed event logging
ultralink.events.enableDebug();

// Monitor specific events
ultralink.events.monitor('entity.*', {
  counter: true,    // Count events
  timing: true,     // Time event processing
  logging: 'debug', // Log level
});

// Get event statistics
const stats = ultralink.events.getStats();
console.log(`Entity created events: ${stats.counts['entity.created']}`);
console.log(`Avg. processing time: ${stats.timing['entity.created'].avg}ms`);
```

## Custom Event Plugins

Developers can extend UltraLink's event system with custom plugins:

```typescript
// Create a custom event plugin
class NotificationPlugin {
  constructor(options = {}) {
    this.options = options;
  }
  
  install(ultralink) {
    // Register event handlers
    ultralink.events.on('entity.created', this.handleEntityCreated.bind(this));
    ultralink.events.on('entity.updated', this.handleEntityUpdated.bind(this));
    
    // Add custom events
    ultralink.events.registerCustomEvent('notification.sent');
  }
  
  async handleEntityCreated(event) {
    const entity = event.data;
    
    // Process the event
    if (this.shouldNotify(entity)) {
      await this.sendNotification(entity, 'created');
      
      // Emit custom event
      await event.emitter.emit('notification.sent', {
        entity,
        type: 'created',
        timestamp: new Date()
      });
    }
  }
  
  // Additional methods...
}

// Use the plugin
ultralink.use(new NotificationPlugin({
  channels: ['email', 'slack']
}));
```

## Best Practices

1. **Performance Considerations**:
   - Use event filters to limit processing unnecessary events
   - Consider asynchronous event handling for expensive operations
   - Monitor event processing times to identify bottlenecks

2. **Error Handling**:
   - Always implement error handling in event subscribers
   - Use try/catch blocks in async handlers
   - Consider how to handle partial failures

3. **Design Patterns**:
   - Use event-driven architecture for loosely coupled components
   - Implement the observer pattern with event subscriptions
   - Consider the Command Query Responsibility Segregation (CQRS) pattern

## Related Documentation

- [Events API Reference](../api/events-api.md)
- [Plugin Development Guide](../advanced/plugin-development.md)
- [Performance Monitoring](../performance/monitoring.md)
- [Reactive Applications with UltraLink](../guides/reactive-applications.md) 
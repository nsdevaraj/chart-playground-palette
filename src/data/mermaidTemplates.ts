import type { MermaidTemplate } from "@/lib/mermaid/types";

export interface MermaidTemplateGalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  template: MermaidTemplate;
}

const flowchartTemplate: MermaidTemplate = {
  name: "Flowchart",
  description: "Basic process flowchart with decision points",
  version: "1.0.0",
  metadata: {
    name: "Basic Flowchart",
    author: "ChartStudio",
    tags: ["mermaid", "flowchart", "process", "diagram"],
    license: "MIT",
  },
  diagramType: "flowchart",
  diagram: `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`,
  config: {
    theme: "default",
    securityLevel: "loose",
  },
};

const sequenceDiagramTemplate: MermaidTemplate = {
  name: "Sequence Diagram",
  description: "Communication sequence between entities",
  version: "1.0.0",
  metadata: {
    name: "Sequence Diagram",
    author: "ChartStudio",
    tags: ["mermaid", "sequence", "interaction", "diagram"],
    license: "MIT",
  },
  diagramType: "sequence",
  diagram: `sequenceDiagram
    participant User
    participant Client
    participant Server
    User->>Client: Click button
    Client->>Server: Send request
    Server->>Server: Process data
    Server-->>Client: Return response
    Client-->>User: Update UI`,
  config: {
    theme: "default",
  },
};

const classDiagramTemplate: MermaidTemplate = {
  name: "Class Diagram",
  description: "Object-oriented class structure",
  version: "1.0.0",
  metadata: {
    name: "Class Diagram",
    author: "ChartStudio",
    tags: ["mermaid", "class", "oop", "architecture"],
    license: "MIT",
  },
  diagramType: "class",
  diagram: `classDiagram
    class Animal {
        +String name
        +int age
        +void eat()
        +void sleep()
    }
    class Dog {
        +String breed
        +void bark()
    }
    class Cat {
        +String color
        +void meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
  config: {
    theme: "default",
  },
};

const stateDiagramTemplate: MermaidTemplate = {
  name: "State Diagram",
  description: "State machine and transitions",
  version: "1.0.0",
  metadata: {
    name: "State Machine",
    author: "ChartStudio",
    tags: ["mermaid", "state", "fsm", "diagram"],
    license: "MIT",
  },
  diagramType: "state",
  diagram: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Success: Complete
    Processing --> Error: Fail
    Success --> [*]
    Error --> Idle: Retry`,
  config: {
    theme: "default",
  },
};

const entityRelationshipTemplate: MermaidTemplate = {
  name: "Entity Relationship Diagram",
  description: "Database schema and relationships",
  version: "1.0.0",
  metadata: {
    name: "ER Diagram",
    author: "ChartStudio",
    tags: ["mermaid", "er", "database", "schema"],
    license: "MIT",
  },
  diagramType: "er",
  diagram: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER {
        int id PK
        string name
        string email
    }
    ORDER ||--|{ LINE-ITEM : contains
    ORDER {
        int id PK
        int customer_id FK
        date order_date
    }
    LINE-ITEM {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
    }
    PRODUCT }o--|| LINE-ITEM : "ordered in"
    PRODUCT {
        int id PK
        string name
        decimal price
    }`,
  config: {
    theme: "default",
  },
};

const ganttChartTemplate: MermaidTemplate = {
  name: "Gantt Chart",
  description: "Project timeline and milestones",
  version: "1.0.0",
  metadata: {
    name: "Project Gantt",
    author: "ChartStudio",
    tags: ["mermaid", "gantt", "timeline", "project"],
    license: "MIT",
  },
  diagramType: "gantt",
  diagram: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Planning
    Requirements :req, 2024-01-01, 30d
    Design :des, after req, 30d
    section Development
    Frontend :frontend, 2024-02-15, 45d
    Backend :backend, 2024-02-15, 50d
    section Testing
    QA Testing :qa, after frontend, 20d
    UAT :uat, after qa, 15d
    section Deployment
    Production Release :deploy, after uat, 5d`,
  config: {
    theme: "default",
  },
};

const pieChartTemplate: MermaidTemplate = {
  name: "Pie Chart",
  description: "Distribution visualization",
  version: "1.0.0",
  metadata: {
    name: "Pie Chart",
    author: "ChartStudio",
    tags: ["mermaid", "pie", "chart", "distribution"],
    license: "MIT",
  },
  diagramType: "pie",
  diagram: `pie title Market Share Distribution
    "Product A" : 35
    "Product B" : 25
    "Product C" : 20
    "Product D" : 15
    "Others" : 5`,
  config: {
    theme: "default",
  },
};

const mindmapTemplate: MermaidTemplate = {
  name: "Mindmap",
  description: "Hierarchical mind mapping",
  version: "1.0.0",
  metadata: {
    name: "Mindmap",
    author: "ChartStudio",
    tags: ["mermaid", "mindmap", "hierarchy", "brainstorm"],
    license: "MIT",
  },
  diagramType: "mindmap",
  diagram: `mindmap
  root((Project Planning))
    Resources
      Team Members
      Budget
      Equipment
    Timeline
      Phase 1
      Phase 2
      Phase 3
    Deliverables
      Documentation
      Code
      Testing
    Risks
      Technical
      Resource
      Schedule`,
  config: {
    theme: "default",
  },
};

const timelineTemplate: MermaidTemplate = {
  name: "Timeline",
  description: "Historical timeline events",
  version: "1.0.0",
  metadata: {
    name: "Timeline",
    author: "ChartStudio",
    tags: ["mermaid", "timeline", "history", "events"],
    license: "MIT",
  },
  diagramType: "timeline",
  diagram: `timeline
    title Historical Events
    2019 : First Event : Second Event
    2020 : Third Event
    2021 : Fourth Event : Fifth Event
    2022 : Sixth Event : Seventh Event : Eighth Event
    2023 : Ninth Event
    2024 : Tenth Event`,
  config: {
    theme: "default",
  },
};

const gitGraphTemplate: MermaidTemplate = {
  name: "Git Graph",
  description: "Git branching strategy",
  version: "1.0.0",
  metadata: {
    name: "Git Workflow",
    author: "ChartStudio",
    tags: ["mermaid", "git", "branching", "workflow"],
    license: "MIT",
  },
  diagramType: "gitGraph",
  diagram: `gitGraph
  commit id: "Initial commit"
  commit id: "Add feature"
  branch develop
  checkout develop
  commit id: "Feature branch"
  commit id: "Work in progress"
  checkout main
  commit id: "Hotfix"
  checkout develop
  merge main
  commit id: "Ready for release"
  checkout main
  merge develop
  commit id: "v1.0.0"`,
  config: {
    theme: "default",
  },
};

const requirementDiagramTemplate: MermaidTemplate = {
  name: "Requirement Diagram",
  description: "System requirements specification",
  version: "1.0.0",
  metadata: {
    name: "Requirements",
    author: "ChartStudio",
    tags: ["mermaid", "requirement", "specification", "system"],
    license: "MIT",
  },
  diagramType: "requirement",
  diagram: `requirementDiagram

    requirement test_req {
    id: 1
    text: the test text.
    risk: high
    verifymethod: test
    }

    element test_entity {
    type: simulation
    }

    test_entity - satisfies -> test_req`,
  config: {
    theme: "default",
  },
};

export const mermaidTemplates: MermaidTemplateGalleryItem[] = [
  {
    id: "mermaid-flowchart",
    title: "Basic Flowchart",
    description: "Process flowchart with decision points and logic flow",
    category: "Flowcharts",
    tags: ["process", "flowchart", "decision"],
    template: flowchartTemplate,
  },
  {
    id: "mermaid-sequence",
    title: "Sequence Diagram",
    description: "Communication sequence between system actors",
    category: "Diagrams",
    tags: ["sequence", "interaction", "communication"],
    template: sequenceDiagramTemplate,
  },
  {
    id: "mermaid-class",
    title: "Class Diagram",
    description: "Object-oriented class structure and relationships",
    category: "Architecture",
    tags: ["class", "oop", "design"],
    template: classDiagramTemplate,
  },
  {
    id: "mermaid-state",
    title: "State Diagram",
    description: "State machine with transitions",
    category: "Diagrams",
    tags: ["state", "fsm", "transitions"],
    template: stateDiagramTemplate,
  },
  {
    id: "mermaid-er",
    title: "Entity Relationship Diagram",
    description: "Database schema and entity relationships",
    category: "Database",
    tags: ["er", "database", "schema"],
    template: entityRelationshipTemplate,
  },
  {
    id: "mermaid-gantt",
    title: "Gantt Chart",
    description: "Project timeline and task scheduling",
    category: "Project Management",
    tags: ["gantt", "timeline", "project"],
    template: ganttChartTemplate,
  },
  {
    id: "mermaid-pie",
    title: "Pie Chart",
    description: "Data distribution visualization",
    category: "Charts",
    tags: ["pie", "chart", "data"],
    template: pieChartTemplate,
  },
  {
    id: "mermaid-mindmap",
    title: "Mindmap",
    description: "Hierarchical mind mapping for brainstorming",
    category: "Planning",
    tags: ["mindmap", "brainstorm", "hierarchy"],
    template: mindmapTemplate,
  },
  {
    id: "mermaid-timeline",
    title: "Timeline",
    description: "Historical timeline with key events",
    category: "Timeline",
    tags: ["timeline", "history", "events"],
    template: timelineTemplate,
  },
  {
    id: "mermaid-git",
    title: "Git Graph",
    description: "Git branching and workflow strategy",
    category: "Development",
    tags: ["git", "branching", "workflow"],
    template: gitGraphTemplate,
  },
  {
    id: "mermaid-requirement",
    title: "Requirement Diagram",
    description: "System requirements and implementation mapping",
    category: "Architecture",
    tags: ["requirement", "specification", "system"],
    template: requirementDiagramTemplate,
  },
];

export const mermaidTemplateMap = mermaidTemplates.reduce<
  Record<string, MermaidTemplateGalleryItem>
>((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

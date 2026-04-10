graph TD
    %% Users and Agents
    User((User)) 
    Agent([AI Agent])

    %% Interfaces
    subgraph "Interfaces (Frontend)"
        TG[Telegram Bot]
        DB[React Dashboard]
    end

    %% Core System
    subgraph "Core Ecosystem"
        API[MCP API Server]
        SQL[(Database)]
    end

    %% Connections
    User -->|Sends Message| TG
    TG -->|Webhook / REST| API
    
    Agent -->|MCP Protocol| API
    
    API <-->|Query/Write| SQL
    
    DB -->|Polls every 5s| API
    User -.->|Views Kiosk| DB

    %% Styling
    style API fill:#f9f,stroke:#333,stroke-width:2px
    style Agent fill:#bbf,stroke:#333,stroke-width:2px
    style SQL fill:#dfd,stroke:#333
# PKI Visualization Page Plan

## 1. Project Setup & Dependencies

*   Initialize a new Next.js project using the App Router if one doesn't exist.
*   Install necessary dependencies: `reactflow` for the graph visualization and `tailwindcss` for styling.

## 2. Component Structure

*   **`app/pki-visualizer/page.tsx`**: The main server component for the page route.
*   **`components/PKIGraphClient.tsx`**: A client component responsible for:
    *   Managing the state (selected PKI structure, selected node/edge).
    *   Rendering the `ReactFlow` canvas.
    *   Handling interactions (node clicks, zoom/pan, fit-to-screen).
    *   Applying styles to nodes and edges based on type.
*   **`components/StructureSelector.tsx`**: A component (likely client-side for interaction) to render the dropdown or segmented buttons for selecting the PKI structure.
*   **`components/Sidebar.tsx`**: A component to display metadata for the selected CA node.

## 3. Data Handling

*   **`types/pki.ts`**: Define the TypeScript interfaces (`CANode`, `CAEdge`, `CAType`, `EdgeType`) as specified in `prompt.md`.
*   **`data/mockPkiData.ts`**: Store the mock node and edge data for the four different PKI structures (Single Root, Cross-Signed, Bridged, Disconnected).

## 4. Implementation Details

*   **Graph Visualization (`PKIGraphClient.tsx`)**:
    *   Use `useState` to manage the currently displayed nodes/edges and the selected structure.
    *   Pass the appropriate mock data (formatted for React Flow) to the `ReactFlow` component based on the selected structure.
    *   Define custom node types or use node `style`/`className` props to apply Tailwind colors. Define edge types or use `style`/`markerEnd` for different line styles (solid, dashed, dotted).
    *   Implement `onNodeClick` handler (or similar React Flow event) to update the selected node state for the sidebar.
    *   React Flow includes built-in controls for zoom/pan; add a fit-to-view button using its API.
*   **Sidebar (`Sidebar.tsx`)**:
    *   Receive the selected `CANode` object as a prop.
    *   Display the required metadata (Name, Type, etc.). *Note: Validity, Issuer, SHA-1 Fingerprint will need placeholder data.*
    *   Implement the "Export Trust Chain" button (placeholder functionality initially).
    *   Style using Tailwind utility classes.
    *   Implement responsive logic to hide/collapse on mobile.
*   **Structure Selector (`StructureSelector.tsx`)**:
    *   Render the selection UI (dropdown or buttons).
    *   Use `useState` to track the selection.
    *   Call a function passed via props to notify `PKIGraphClient.tsx` when the selection changes.
*   **Layout & Styling (`page.tsx`, `globals.css`, `tailwind.config.js`)**:
    *   Set up the main page layout using Tailwind CSS (Flexbox/Grid) for the two-column desktop view and single-column mobile view.
    *   Configure Tailwind CSS correctly within the Next.js project.

## 5. Responsiveness

*   Ensure the layout adapts correctly to different screen sizes, particularly the graph canvas and sidebar behavior on mobile.

## Visual Plan (Mermaid Diagram)

```mermaid
graph TD
    subgraph "User Interface"
        direction LR
        A[Select Structure] --> B(PKI Graph Client Component);
        B -- Renders --> C(React Flow Canvas);
        B -- Renders --> D(Sidebar);
        C -- Node Click Event --> B;
        B -- Updates Selected Node --> D;
    end

    subgraph "Data Flow"
        direction TB
        E[Mock PKI Data] --> B;
        F[TypeScript Types] --> E;
        F --> B;
    end

    A -- Triggers Data Load --> B;

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style E fill:#ccf,stroke:#333,stroke-width:2px
    style F fill:#ddf,stroke:#333,stroke-width:1px
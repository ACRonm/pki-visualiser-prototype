# PKI Visualization Integration Task

## Context

We have developed a Next.js prototype for visualizing PKI (Public Key Infrastructure) hierarchies. The prototype allows users to view different certificate authority structures, see their relationships, and explore details of each node. The prototype is in the `/app` directory of this workspace.

## Current Features

The prototype currently includes:

1. **PKI Structure Visualization**
   - Interactive graph display using React Flow (previously `@xyflow/react`)
   - Support for 4 different mock PKI structures (Single Root, Hierarchical, Cross-Signed, Bridge)
   - Custom node styling based on CA type (Root, Intermediate, Bridge, Leaf)
   - Node selection and details panel
   
2. **User Interface**
   - Structure selector for switching between different PKI hierarchies
   - Sidebar displaying detailed information about selected nodes
   - Export functionality to download the current view as JSON
   - Responsive layout for different screen sizes

3. **Mock Data**
   - Currently using static mock data in `/app/src/data/mockPkiData.ts`

## Integration Task

We need to integrate the VIEW mode of this prototype into an existing React application built with:
- React + Vite
- React-Bootstrap for UI components (instead of Tailwind CSS)
- Connection to a real database for PKI data (instead of mock data)

## Primary Requirements

1. **React-Bootstrap Migration**
   - Convert the existing Tailwind CSS styles to React-Bootstrap components
   - Replace custom components with equivalent React-Bootstrap components
   - Maintain the visual appearance and functionality of the original

2. **View-Only Mode**
   - Remove the configure mode entirely from the integration
   - Focus only on the view functionality (displaying predefined PKI structures)

3. **Real Data Integration**
   - Develop a plan to replace the mock data with real PKI data from a database
   - Create appropriate data fetching mechanisms
   - Ensure the data structure matches what the visualization expects

## Components to Adapt

Key components to adapt from the prototype include:

- `PKIGraphClient.tsx` - Main visualization component
- `Sidebar.tsx` - Details panel for selected nodes
- `StructureSelector.tsx` - Buttons for switching between structures
- `CustomNodes/BaseCANode.tsx` - Custom node rendering
- `data/mockPkiData.ts` - Current mock data (to be replaced)
- `types/pki.ts` - TypeScript definitions

## Integration Guide Notes

1. The core visualization library `@xyflow/react` should be installed in the target project
2. React-Bootstrap components should replace Tailwind utility classes
3. Structure and functionality should remain consistent while adapting to the new styling approach
4. The final integration should support API-based data fetching instead of static mock data

## Deliverables

1. Adapted React components using React-Bootstrap
2. Plan for integrating real data sources 
3. Documentation of any changes made to the original component structure
4. Any required TypeScript type definitions
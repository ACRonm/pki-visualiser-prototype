'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { // Use named import for ReactFlow
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
  useReactFlow,
  MarkerType,
  ReactFlowProvider,
  NodeTypes, // Import NodeTypes
} from '@xyflow/react';

import { pkiDataSets, structureOptions, PkiStructureType } from '@/data/mockPkiData';
import { PKINode, PKIEdge, CAType, EdgeType } from '@/types/pki';
import StructureSelector from './StructureSelector';
import Sidebar from './Sidebar';
import BaseCANode from './CustomNodes/BaseCANode'; // Import the custom node

// Import React Flow CSS
import '@xyflow/react/dist/style.css';

// Helper function to get node background color based on type
const getNodeColor = (nodeType: CAType) => { // Use CAType directly
  switch (nodeType) {
    case 'Root': return 'bg-blue-500';
    case 'Intermediate': return 'bg-purple-500';
    case 'Bridge': return 'bg-yellow-500'; // Darker yellow for better contrast
    case 'Leaf': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

// Helper function to get edge style based on type
const getEdgeStyle = (edgeType: EdgeType | undefined): Partial<Edge> => {
    const baseStyle = { strokeWidth: 2 };
    switch (edgeType) {
        case 'Signed':
            return { ...baseStyle, markerEnd: { type: MarkerType.ArrowClosed } };
        case 'Cross-Signed':
            return { ...baseStyle, style: { strokeDasharray: '5 5' }, markerEnd: { type: MarkerType.ArrowClosed } };
        case 'Bridge':
            return { ...baseStyle, style: { strokeDasharray: '2 3' }, markerEnd: { type: MarkerType.Arrow } }; // Example: different arrow
        default:
            return { ...baseStyle, markerEnd: { type: MarkerType.ArrowClosed } };
    }
};

// Define the custom node types for React Flow, explicitly typed
const nodeTypes: NodeTypes = {
  caNode: BaseCANode,
};


// Wrap the component that uses useReactFlow hook
export default function PKIGraphClientWrapper() {
  return (
    <ReactFlowProvider>
      <PKIGraphClient />
    </ReactFlowProvider>
  );
}

function PKIGraphClient() {
  // Provide explicit types to the state hooks
  const [nodes, setNodes, onNodesChange] = useNodesState<PKINode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<PKIEdge>([]);
  const [selectedStructure, setSelectedStructure] = useState<PkiStructureType>('singleRoot');
  // Type for selectedNode should use PKINode which includes the data structure React Flow expects
  const [selectedNode, setSelectedNode] = useState<PKINode | null>(null);
  // Removed duplicate state declaration for selectedNode
  const { fitView } = useReactFlow(); // Hook for fitView function

  // Load initial data
  useEffect(() => {
    const initialData = pkiDataSets[selectedStructure];
    // Apply styles to initial nodes and edges
    // Map initial data to nodes, assigning our custom type 'caNode'
    const initialNodes = initialData.nodes.map((node): PKINode => ({
        ...node,
        type: 'caNode', // Assign the custom node type
        // Remove className from data, styling is handled within BaseCANode
        data: {
            ...node.data,
            // className: undefined, // Ensure className is not passed if it existed before
        }
    }));

    // Ensure edge data conforms to CAEdgeData
    const initialEdges = initialData.edges.map((edge): PKIEdge => ({
        ...edge,
        ...getEdgeStyle(edge.data?.type),
        data: { // Explicitly ensure data structure matches CAEdgeData
            type: edge.data!.type, // Assuming data and type always exist for initial data
        },
    }));

    setNodes(initialNodes);
    setEdges(initialEdges);
    // setNodes(styledNodes); // Removed this line in previous step, ensure it's gone
    // setEdges(styledEdges); // Remove this leftover line

    // setNodes(styledNodes); // Replaced by setNodes(initialNodes) above
    // Ensure this leftover line is removed
    // Removed setNodes, setEdges from dependencies as they are stable setters
  }, [selectedStructure]);

  const onConnect = useCallback(
    // Ensure the added edge conforms to PKIEdge type
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds) as PKIEdge[]),
    [setEdges],
  );

  const handleStructureChange = useCallback((newStructure: PkiStructureType) => {
    setSelectedStructure(newStructure);
    setSelectedNode(null); // Clear selection when structure changes
    // Data update happens in useEffect
    // Reset viewport after data changes
    setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 50);
    // Removed handleStructureChange from its own dependency array
  }, [fitView, setSelectedStructure, setSelectedNode]);

  // Use the PKINode type here as well
  const handleNodeClick = useCallback((event: React.MouseEvent, node: PKINode) => {
    setSelectedNode(node);
    console.log('Clicked node:', node);
  }, []);

   // Fit view on initial load and when structure changes (handled in handleStructureChange)
   useEffect(() => {
    setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 100); // Delay fitView slightly
  }, [fitView]);


  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
        className="flex-grow bg-[var(--background)] text-[var(--foreground)]"
      >
        <Controls className="border border-[var(--accent-light)] shadow-md" />
        <MiniMap 
          nodeStrokeWidth={3} 
          zoomable 
          pannable 
          className="border border-[var(--accent-light)] shadow-md" 
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={12} 
          size={1} 
          className="bg-[var(--background)]" 
          color="var(--accent-light)" 
        />
        <Panel position="top-left" className="flex items-center space-x-2">
          <StructureSelector
            options={structureOptions}
            selected={selectedStructure}
            onChange={handleStructureChange}
          />
          <button
            onClick={() => fitView({ padding: 0.2 })}
            className="p-1.5 bg-[var(--cream)] dark:bg-[var(--brg-dark)] border border-[var(--brg-light)] dark:border-[var(--gold)] rounded shadow text-[var(--brg-dark)] dark:text-[var(--cream)] hover:bg-[var(--brg-light)] dark:hover:bg-[var(--brg-main)] hover:text-[var(--cream)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
            title="Fit View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
            </svg>
          </button>
        </Panel>
      </ReactFlow>
      {/* Pass current nodes and edges to Sidebar for export */}
      <Sidebar selectedNode={selectedNode} nodes={nodes} edges={edges} />
    </div>
  );
}
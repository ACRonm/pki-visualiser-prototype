'use client';

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
  useReactFlow,
  MarkerType,
  ReactFlowProvider,
  NodeTypes,
  OnNodesChange,
  OnEdgesChange,
} from '@xyflow/react';

import { pkiDataSets, structureOptions, PkiStructureType } from '@/data/mockPkiData';
import { PKINode, PKIEdge, CAType, EdgeType } from '@/types/pki';
import StructureSelector from './StructureSelector';
import Sidebar from './Sidebar';
import BaseCANode from './CustomNodes/BaseCANode';

// Import React Flow CSS
import '@xyflow/react/dist/style.css';

// Helper function to get edge style based on type
const getEdgeStyle = (edgeType: EdgeType | undefined): Partial<Edge> => {
    const baseStyle = { strokeWidth: 2 };
    switch (edgeType) {
        case 'Signed':
            return { ...baseStyle, markerEnd: { type: MarkerType.ArrowClosed } };
        case 'Cross-Signed':
            return { ...baseStyle, style: { strokeDasharray: '5 5' }, markerEnd: { type: MarkerType.ArrowClosed } };
        case 'Bridge':
            return { ...baseStyle, style: { strokeDasharray: '2 3' }, markerEnd: { type: MarkerType.Arrow } };
        default:
            return { ...baseStyle, markerEnd: { type: MarkerType.ArrowClosed } };
    }
};

// Define the custom node types for React Flow
const nodeTypes: NodeTypes = {
  caNode: BaseCANode,
};

// Helper function moved outside the component scope
const getInitialState = (structure: PkiStructureType) => {
  const initialData = pkiDataSets[structure];
  const initialNodes = initialData.nodes.map((node): PKINode => ({
      ...node,
      type: 'caNode',
      data: { ...node.data }
  }));
  const initialEdges = initialData.edges.map((edge): PKIEdge => ({
      ...edge,
      ...getEdgeStyle(edge.data?.type),
      data: { type: edge.data!.type },
  }));
  // Return consistent keys matching the useMemo destructuring
  return { displayNodes: initialNodes, displayEdges: initialEdges };
};


// Main Component Logic
function PKIGraphClient() {
  // --- State ---
  const [mode, setMode] = useState<'view' | 'configure'>('view');
  const [selectedStructure, setSelectedStructure] = useState<PkiStructureType>('singleRoot');
  const [selectedNode, setSelectedNode] = useState<PKINode | null>(null);
  // State for nodes/edges in configure mode - initialized empty
  const [configuredNodes, setConfiguredNodes] = useState<PKINode[]>([]);
  const [configuredEdges, setConfiguredEdges] = useState<PKIEdge[]>([]);
  // React Flow instance hook
  const { fitView } = useReactFlow();
  const nodeIdCounter = useRef(0); // Counter for unique node IDs

  // --- Derived State for Display ---
  const { displayNodes, displayEdges } = useMemo(() => {
    if (mode === 'view') {
      // In view mode, derive directly from mock data based on selectedStructure
      return getInitialState(selectedStructure);
    } else {
      // In configure mode, use the configured state
      return { displayNodes: configuredNodes, displayEdges: configuredEdges };
    }
  }, [mode, selectedStructure, configuredNodes, configuredEdges]);

  // Handlers for node/edge changes from React Flow (only apply in configure mode)
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      if (mode === 'configure') {
        // Apply changes and cast result to ensure type compatibility
        setConfiguredNodes((nds) => applyNodeChanges(changes, nds) as PKINode[]);
      }
    },
    [mode, setConfiguredNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      if (mode === 'configure') {
        // Apply changes and cast result to ensure type compatibility
        setConfiguredEdges((eds) => applyEdgeChanges(changes, eds) as PKIEdge[]);
      }
    },
    [mode, setConfiguredEdges]
  );

  // Effect to clear selection when mode changes
  useEffect(() => {
    setSelectedNode(null);
  }, [mode]);

  // --- Add Node Logic (Configure Mode) ---
  const addNode = useCallback((type: CAType) => {
    if (mode !== 'configure') return;

    // Use counter for unique ID
    const newNodeId = `${type.toLowerCase()}-${nodeIdCounter.current++}`;
    const newNode: PKINode = {
      id: newNodeId,
      type: 'caNode',
      position: { x: Math.random() * 400 + 50, y: Math.random() * 200 + 50 },
      data: {
        label: `New ${type} CA`,
        type: type,
        validTo: '2099-12-31',
        // Set initial issuer based on type
        issuer: type === 'Root' ? `New ${type} CA` : 'Pending Issuance',
        sha1Fingerprint: 'New CA - No Fingerprint Yet'
      },
    };
    setConfiguredNodes((nds) => nds.concat(newNode));
  }, [mode, setConfiguredNodes]);

  // --- Delete Node Logic (Configure Mode) ---
  const deleteNode = useCallback((nodeId: string) => {
    if (mode !== 'configure') return;

    // Remove the node
    setConfiguredNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    
    // Remove all edges connected to this node
    setConfiguredEdges((edges) => edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ));

    // Clear selection if the deleted node was selected
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
  }, [mode, selectedNode, setConfiguredNodes, setConfiguredEdges, setSelectedNode]);

  // --- Connect Logic (Configure Mode) ---
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      if (mode === 'configure') {
        // Add the edge
        const newEdge = { ...params, data: { type: 'Signed' } } as PKIEdge; // Default to 'Signed'
        setConfiguredEdges((eds) => addEdge(newEdge, eds));

        // Update the target node's issuer data
        setConfiguredNodes((nds) => {
          const sourceNode = nds.find((node) => node.id === params.source);
          const sourceLabel = sourceNode?.data?.label ?? 'Unknown Issuer';

          return nds.map((node) => {
            if (node.id === params.target) {
              // Create a new node object with updated data
              return {
                ...node,
                data: {
                  ...node.data,
                  issuer: sourceLabel, // Set issuer to source node's label
                },
              };
            }
            return node;
          });
        });
      }
    },
    [mode, setConfiguredNodes, setConfiguredEdges] // Add setConfiguredNodes dependency
  );

  // --- Structure Change Logic (View Mode) ---
  const handleStructureChange = useCallback((newStructure: PkiStructureType) => {
    if (mode === 'view') {
        setSelectedStructure(newStructure);
        // fitView will be triggered by the effect below
    }
  }, [mode, setSelectedStructure]);

  // --- Node Click Logic ---
  const handleNodeClick = useCallback((event: React.MouseEvent, node: PKINode) => {
    setSelectedNode(node);
    console.log('Clicked node:', node);
  }, []); // No dependencies needed as setSelectedNode is stable

   // Temporarily comment out the fitView effect to isolate the re-render issue
   // useEffect(() => {
   //  const timer = setTimeout(() => {
   //      fitView({ padding: 0.2, duration: 400 });
   //  }, 50);
   //  return () => clearTimeout(timer);
   // }, [displayNodes, fitView]);


  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={displayNodes}
        edges={displayEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
        className="flex-grow bg-gray-50 dark:bg-gray-800"
      >
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Panel position="top-left" className="flex items-center space-x-2 p-2 bg-white/80 dark:bg-gray-800/80 rounded shadow">
           {/* Mode Toggle Buttons */}
           <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg shadow mr-4">
             <button onClick={() => setMode('view')} className={`px-3 py-1 text-sm rounded-md transition-colors ${mode === 'view' ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-300 shadow font-medium' : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>View</button>
             <button onClick={() => setMode('configure')} className={`px-3 py-1 text-sm rounded-md transition-colors ${mode === 'configure' ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-300 shadow font-medium' : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>Configure</button>
           </div>

           {/* Structure Selector (Only visible in View mode) */}
           {mode === 'view' && (
             <StructureSelector
               options={structureOptions}
               selected={selectedStructure}
               onChange={handleStructureChange}
             />
           )}
           {/* Fit View Button */}
           <button
             onClick={() => fitView({ padding: 0.2 })}
             className="p-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
             title="Fit View"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
               <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
             </svg>
           </button>
        </Panel>
      </ReactFlow>
      <Sidebar 
        selectedNode={selectedNode} 
        nodes={displayNodes} 
        edges={displayEdges} 
        mode={mode} 
        addNode={addNode}
        deleteNode={deleteNode} 
      />
    </div>
  );
}

// Wrap the component that uses useReactFlow hook
export default function PKIGraphClientWrapper() {
  return (
    <ReactFlowProvider>
      <PKIGraphClient />
    </ReactFlowProvider>
  );
}
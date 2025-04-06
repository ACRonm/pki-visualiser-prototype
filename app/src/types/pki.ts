export type CAType = 'Root' | 'Intermediate' | 'Leaf' | 'Bridge';
export type EdgeType = 'Signed' | 'Cross-Signed' | 'Bridge';

// Reinstate Record constraint for compatibility with React Flow Node type
export interface CANodeData extends Record<string, unknown> {
  label: string;
  type: CAType;
  validTo?: string; // Placeholder for now
  issuer?: string; // Placeholder for now
  sha1Fingerprint?: string; // Placeholder for now
  revoked?: boolean;
  // className is no longer needed here, styling is in the custom node
}

// Use React Flow's Node type directly, specifying our data structure
import type { Node, Edge } from '@xyflow/react';

export type PKINode = Node<CANodeData>;

// Define data structure for edges
export interface CAEdgeData extends Record<string, unknown> {
    type: EdgeType;
}

// Use React Flow's Edge type directly, specifying our data structure
export type PKIEdge = Edge<CAEdgeData>;

// Structure to hold a complete PKI dataset for React Flow
// Uses the correctly typed PKINode and PKIEdge now
export interface PKIDataSet {
  nodes: PKINode[];
  edges: PKIEdge[];
}
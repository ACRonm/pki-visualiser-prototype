'use client';

import React, { useCallback, useMemo } from 'react'; // Import useMemo
import { PKINode, PKIEdge } from '@/types/pki'; // Import PKIEdge

interface SidebarProps {
  selectedNode: PKINode | null;
  nodes: PKINode[]; // Add nodes prop
  edges: PKIEdge[]; // Add edges prop
}

// --- Pricing Constants (Simplified for Mockup) ---
const ROOT_CA_COST_MONTHLY = 199.00;
const ISSUING_CA_COST_MONTHLY = 500.00;
// ---

export default function Sidebar({ selectedNode, nodes, edges }: SidebarProps) {
  // Export function
  const handleExport = useCallback(() => {
    if (!nodes || !edges) return;

    // Prepare data for export using domain-specific keys
    // We can also simplify the exported data, removing React Flow specific fields if not needed
    const exportData = {
      certificateAuthorities: nodes.map(n => ({
        id: n.id,
        // position: n.position, // Optional: remove if backend doesn't need position
        data: n.data,
        // type: n.type // Optional: remove if backend doesn't need React Flow type
      })),
      relationships: edges.map(e => ({
        id: e.id, // Optional: remove if backend generates its own relationship IDs
        source: e.source,
        target: e.target,
        data: e.data,
        // type: e.type // Optional: remove if backend doesn't need React Flow type
      })),
    };

    const jsonString = JSON.stringify(exportData, null, 2); // Pretty print JSON
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pki-hierarchy.json'; // Filename for download
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
    URL.revokeObjectURL(url); // Free up memory
  }, [nodes, edges]);

  // Calculate estimated cost using useMemo
  const estimatedCost = useMemo(() => {
    let totalCost = 0;
    if (nodes) {
      nodes.forEach(node => {
        if (node.data.type === 'Root') {
          totalCost += ROOT_CA_COST_MONTHLY;
        } else if (node.data.type === 'Intermediate' || node.data.type === 'Bridge') {
          totalCost += ISSUING_CA_COST_MONTHLY;
        }
        // Leaf nodes don't add to the per-CA cost in this model
      });
    }
    // Format to 2 decimal places
    return totalCost.toFixed(2);
  }, [nodes]);

  // Basic responsive handling: hide on small screens, show as sidebar on medium+
  // More sophisticated drawer/bottom sheet would require more state management/libraries
  return (
    // Add dark mode styles for background, border, text
    <aside className="w-full md:w-1/3 lg:w-1/4 h-full border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md p-4 overflow-y-auto hidden md:block flex flex-col"> {/* Added flex flex-col */}
      <h2 className="text-lg font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-600 dark:text-white">CA Details</h2>

      {/* Move Export button here to be always visible */}
      <div className="mb-4">
        <button
          onClick={handleExport}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!nodes || nodes.length === 0} // Disable if no nodes
        >
          Export Current View (JSON)
        </button>
      </div>

      {/* Estimated Cost Section */}
      <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <h3 className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Estimated Monthly Cost (Mockup)</h3>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          AUD ${estimatedCost}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Based on {nodes.filter(n => n.data.type === 'Root').length} Root CA(s) and {nodes.filter(n => n.data.type === 'Intermediate' || n.data.type === 'Bridge').length} Issuing CA(s). Other add-ons not included.
        </p> {/* Correct closing tag for cost breakdown */}
      </div> {/* Correct closing tag for cost section div */}
      {/* Removed stray </button> tag */}

      {/* Conditional rendering for selected node details */}
      <div className="flex-grow overflow-y-auto"> {/* Allow details to scroll if needed */}
        {selectedNode ? (
          <div className="space-y-3 text-sm dark:text-gray-300">
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">Name:</span>
              <span className="ml-2 text-gray-800 dark:text-gray-100">{selectedNode.data.label}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">Type:</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium text-white ${getNodeColor(selectedNode.data.type)}`}>
                {selectedNode.data.type}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">ID:</span>
              <span className="ml-2 text-gray-800 dark:text-gray-100 break-all">{selectedNode.id}</span>
            </div>
            {/* Placeholder metadata */}
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">Valid To:</span>
              <span className="ml-2 text-gray-800 dark:text-gray-100">{selectedNode.data.validTo ?? 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">Issuer:</span>
              <span className="ml-2 text-gray-800 dark:text-gray-100">{selectedNode.data.issuer ?? 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">SHA-1 Fingerprint:</span>
              <span className="ml-2 text-gray-800 dark:text-gray-100 break-all">{selectedNode.data.sha1Fingerprint ?? 'N/A'}</span>
            </div>
            {selectedNode.data.revoked !== undefined && (
               <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Revoked:</span>
                  <span className={`ml-2 font-semibold ${selectedNode.data.revoked ? 'text-red-600' : 'text-green-600'}`}>
                  {selectedNode.data.revoked ? 'Yes' : 'No'}
                  </span>
              </div>
            )}
            {/* Export button moved outside this block */}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            Select a node to view its details.
          </div>
        )}
      </div>
    </aside>
  );
}

// Helper function (duplicate from PKIGraphClient for simplicity, could be moved to utils)
const getNodeColor = (nodeType: PKINode['data']['type']) => {
    switch (nodeType) {
      case 'Root': return 'bg-blue-500';
      case 'Intermediate': return 'bg-purple-500';
      case 'Bridge': return 'bg-yellow-400';
      case 'Leaf': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
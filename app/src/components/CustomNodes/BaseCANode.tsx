import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CANodeData, CAType } from '@/types/pki';

// Helper to get Tailwind classes based on CA type with the British Racing Green theme
const getNodeBgColor = (type: CAType, isRevoked?: boolean): string => {
  if (isRevoked) {
    return 'bg-gray-400 dark:bg-gray-600 opacity-70';
  }
  
  switch (type) {
    case 'Root':
      return 'bg-[var(--brg-dark)] dark:bg-[var(--gold)]';
    case 'Intermediate':
      return 'bg-[var(--brg-main)] dark:bg-[var(--brg-light)]';
    case 'Bridge':
      return 'bg-[var(--gold)] dark:bg-[var(--tan)]';
    case 'Leaf':
      return 'bg-[var(--brg-light)] dark:bg-[var(--brg-main)]';
    default:
      return 'bg-gray-500 dark:bg-gray-600';
  }
};

const getNodeTextColor = (type: CAType): string => {
  switch (type) {
    case 'Bridge':
      return 'text-[var(--brg-black)] dark:text-[var(--brg-black)]';
    case 'Root':
      return 'text-[var(--cream)] dark:text-[var(--brg-black)]';
    default:
      return 'text-[var(--cream)] dark:text-[var(--cream)]';
  }
};

const getNodeBorderColor = (type: CAType, isRevoked?: boolean): string => {
  if (isRevoked) {
    return 'border-red-500 dark:border-red-400 border-2';
  }
  
  switch (type) {
    case 'Root':
      return 'border-[var(--gold)] dark:border-[var(--brg-dark)] border-2';
    case 'Bridge':
      return 'border-[var(--brg-dark)] dark:border-[var(--gold)] border-2';
    default:
      return 'border-[var(--cream)] dark:border-[var(--gold)] border';
  }
};

// Define the component function separately
const BaseCANodeComponent = (props: NodeProps) => {
    const data = props.data as CANodeData;
    const { type, label, revoked } = data;
    const bgColor = getNodeBgColor(type, revoked);
    const textColor = getNodeTextColor(type);
    const borderColor = getNodeBorderColor(type, revoked);
    
    // Calculate validity status and date diff
    const validTo = data.validTo ? new Date(data.validTo) : null;
    const now = new Date();
    const isExpired = validTo ? validTo < now : false;
    
    // Format date for display
    const formattedDate = validTo ? validTo.toLocaleDateString() : 'Unknown';
    
    // Status indicator
    let statusIndicator = null;
    if (revoked) {
      statusIndicator = (
        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 border border-white flex items-center justify-center" title="Revoked">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    } else if (isExpired) {
      statusIndicator = (
        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-500 border border-white flex items-center justify-center" title="Expired">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    }

    return (
        <div
            className={`relative p-3 rounded-lg shadow-lg ${bgColor} ${textColor} ${borderColor} transition-all duration-200 hover:shadow-xl`}
            style={{ width: 170 }}
        >
            {statusIndicator}
            
            {/* Handles for connecting edges */}
            <Handle 
              type="target" 
              position={Position.Top} 
              className="!bg-[var(--accent-light)] !border-[var(--accent-dark)] !w-3 !h-3" 
            />
            
            <div className="font-medium">{label}</div>
            
            {/* Certificate details */}
            <div className="text-xs opacity-80 mt-2 pb-1 border-t border-opacity-30 border-current pt-1">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-medium">{type}</span>
              </div>
              <div className="flex justify-between">
                <span>Valid to:</span>
                <span className={`font-medium ${isExpired ? 'text-red-300' : ''}`}>{formattedDate}</span>
              </div>
            </div>
            
            <Handle 
              type="source" 
              position={Position.Bottom} 
              className="!bg-[var(--accent-light)] !border-[var(--accent-dark)] !w-3 !h-3" 
            />
        </div>
    );
};

// Memoize the component
const BaseCANode = memo(BaseCANodeComponent);

BaseCANode.displayName = 'BaseCANode';

export default BaseCANode;
'use client';

import React from 'react';
import { PkiStructureType } from '@/data/mockPkiData';

interface StructureSelectorProps {
  options: { value: PkiStructureType; label: string }[];
  selected: PkiStructureType;
  onChange: (value: PkiStructureType) => void;
}

const StructureSelector: React.FC<StructureSelectorProps> = ({
  options,
  selected,
  onChange,
}) => {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            px-2 py-1 text-xs rounded border transition-colors
            ${selected === option.value 
              ? 'bg-[var(--accent)] text-[var(--cream)] border-[var(--accent-dark)] font-medium' 
              : 'bg-[var(--background)] text-[var(--accent-dark)] border-[var(--accent-light)] hover:bg-[var(--accent-light)] hover:text-[var(--cream)]'
            }
            dark:${selected === option.value 
              ? 'bg-[var(--gold)] text-[var(--brg-black)] border-[var(--gold)] font-medium' 
              : 'bg-[var(--brg-dark)] text-[var(--cream)] border-[var(--brg-light)] hover:bg-[var(--brg-light)] hover:text-[var(--cream)]'
            }
            focus:outline-none focus:ring-2 focus:ring-[var(--gold)]
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default StructureSelector;
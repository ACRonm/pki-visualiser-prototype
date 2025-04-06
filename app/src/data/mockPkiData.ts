import { PKINode, PKIEdge, PKIDataSet, CAType, EdgeType } from '@/types/pki';

// Helper to create edges with consistent IDs
const createEdge = (source: string, target: string, type: EdgeType, idSuffix: string = ''): PKIEdge => ({
  id: `e-${source}-${target}${idSuffix}`,
  source,
  target,
  data: { type },
  // Add styling markers later based on type
});

// 1. Single Root CA Tree
const singleRoot: PKIDataSet = {
  nodes: [
    { id: 'root', position: { x: 250, y: 50 }, data: { label: 'Root CA', type: 'Root', validTo: '2035-01-01', issuer: 'Root CA', sha1Fingerprint: 'A1:B2:C3:D4:E5:F6:A7:B8:C9:D0:E1:F2:A3:B4:C5:D6:E7:F8:A9:B0' } },
    { id: 'inter1', position: { x: 250, y: 200 }, data: { label: 'Intermediate A', type: 'Intermediate', validTo: '2030-06-15', issuer: 'Root CA', sha1Fingerprint: '1A:2B:3C:4D:5E:6F:7A:8B:9C:0D:1E:2F:3A:4B:5C:6D:7E:8F:9A:0B' } },
    { id: 'leaf', position: { x: 250, y: 350 }, data: { label: 'Leaf Cert', type: 'Leaf', validTo: '2026-12-31', issuer: 'Intermediate A', sha1Fingerprint: 'F0:E1:D2:C3:B4:A5:F6:E7:D8:C9:B0:A1:F2:E3:D4:C5:B6:A7:F8:E9', revoked: false } },
  ],
  edges: [
    createEdge('root', 'inter1', 'Signed'),
    createEdge('inter1', 'leaf', 'Signed'),
  ],
};

// 2. Cross-Signed Intermediate
const crossSigned: PKIDataSet = {
  nodes: [
    { id: 'rootA', position: { x: 100, y: 50 }, data: { label: 'Root A', type: 'Root', validTo: '2038-03-01', issuer: 'Root A', sha1Fingerprint: 'AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD' } },
    { id: 'rootB', position: { x: 400, y: 50 }, data: { label: 'Root B', type: 'Root', validTo: '2037-07-01', issuer: 'Root B', sha1Fingerprint: '11:22:33:44:55:66:77:88:99:00:AA:BB:CC:DD:EE:FF:00:11:22:33' } },
    { id: 'cross', position: { x: 250, y: 200 }, data: { label: 'Intermediate X (Cross-Signed)', type: 'Intermediate', validTo: '2032-10-10', issuer: 'Root A / Root B', sha1Fingerprint: 'AB:BA:AB:BA:AB:BA:AB:BA:AB:BA:AB:BA:AB:BA:AB:BA:AB:BA:AB:BA' } },
  ],
  edges: [
    createEdge('rootA', 'cross', 'Signed'),
    createEdge('rootB', 'cross', 'Cross-Signed'),
  ],
};

// 3. Bridged CAs
const bridgedCAs: PKIDataSet = {
  nodes: [
    { id: 'rootA', position: { x: 100, y: 50 }, data: { label: 'Root A', type: 'Root', validTo: '2040-01-01', issuer: 'Root A', sha1Fingerprint: 'CA:FE:BA:BE:CA:FE:BA:BE:CA:FE:BA:BE:CA:FE:BA:BE:CA:FE:BA:BE' } },
    { id: 'rootB', position: { x: 400, y: 50 }, data: { label: 'Root B', type: 'Root', validTo: '2040-02-01', issuer: 'Root B', sha1Fingerprint: 'DE:AD:BE:EF:DE:AD:BE:EF:DE:AD:BE:EF:DE:AD:BE:EF:DE:AD:BE:EF' } },
    { id: 'bridge', position: { x: 250, y: 200 }, data: { label: 'Bridge CA', type: 'Bridge', validTo: '2035-05-05', issuer: 'Root A / Root B', sha1Fingerprint: 'BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC:BC' } },
  ],
  edges: [
    // Note: Prompt says 'Signed' for bridge edges, but visually 'Bridge' type might be better. Using 'Bridge' type for data.
    createEdge('rootA', 'bridge', 'Bridge', '-A'), // Suffix needed if source/target same as below
    createEdge('rootB', 'bridge', 'Bridge', '-B'),
  ],
};

// 4. Disconnected Islands
const disconnectedIslands: PKIDataSet = {
  nodes: [
    { id: 'rootA', position: { x: 100, y: 50 }, data: { label: 'Root A', type: 'Root', validTo: '2033-01-01', issuer: 'Root A', sha1Fingerprint: 'DA:DA:DA:DA:DA:DA:DA:DA:DA:DA:DA:DA:DA:DA:DA:DA:DA:DA:DA:DA' } },
    { id: 'leafA', position: { x: 100, y: 200 }, data: { label: 'Leaf A', type: 'Leaf', validTo: '2027-04-11', issuer: 'Root A', sha1Fingerprint: 'FA:FA:FA:FA:FA:FA:FA:FA:FA:FA:FA:FA:FA:FA:FA:FA:FA:FA:FA:FA', revoked: true } },
    { id: 'rootB', position: { x: 400, y: 50 }, data: { label: 'Root B', type: 'Root', validTo: '2034-02-02', issuer: 'Root B', sha1Fingerprint: 'DB:DB:DB:DB:DB:DB:DB:DB:DB:DB:DB:DB:DB:DB:DB:DB:DB:DB:DB:DB' } },
    { id: 'leafB', position: { x: 400, y: 200 }, data: { label: 'Leaf B', type: 'Leaf', validTo: '2028-05-12', issuer: 'Root B', sha1Fingerprint: 'FB:FB:FB:FB:FB:FB:FB:FB:FB:FB:FB:FB:FB:FB:FB:FB:FB:FB:FB:FB' } },
  ],
  edges: [
    createEdge('rootA', 'leafA', 'Signed'),
    createEdge('rootB', 'leafB', 'Signed'),
  ],
};

// 5. Hierarchical CA with Multiple Intermediates
const hierarchicalCA: PKIDataSet = {
  nodes: [
    { id: 'root', position: { x: 250, y: 50 }, data: { label: 'Root CA', type: 'Root', validTo: '2040-01-01', issuer: 'Root CA', sha1Fingerprint: 'XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX' } },
    { id: 'inter1', position: { x: 150, y: 200 }, data: { label: 'Intermediate A', type: 'Intermediate', validTo: '2035-01-01', issuer: 'Root CA', sha1Fingerprint: 'YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY' } },
    { id: 'inter2', position: { x: 350, y: 200 }, data: { label: 'Intermediate B', type: 'Intermediate', validTo: '2035-01-01', issuer: 'Root CA', sha1Fingerprint: 'ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ' } },
    { id: 'leaf1', position: { x: 150, y: 350 }, data: { label: 'Leaf Cert A', type: 'Leaf', validTo: '2030-01-01', issuer: 'Intermediate A', sha1Fingerprint: 'AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA' } },
    { id: 'leaf2', position: { x: 350, y: 350 }, data: { label: 'Leaf Cert B', type: 'Leaf', validTo: '2030-01-01', issuer: 'Intermediate B', sha1Fingerprint: 'BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB' } },
  ],
  edges: [
    createEdge('root', 'inter1', 'Signed'),
    createEdge('root', 'inter2', 'Signed'),
    createEdge('inter1', 'leaf1', 'Signed'),
    createEdge('inter2', 'leaf2', 'Signed'),
  ],
};

// 6. Mesh or Fully Connected CA Network
const meshCA: PKIDataSet = {
  nodes: [
    { id: 'rootA', position: { x: 100, y: 50 }, data: { label: 'Root A', type: 'Root', validTo: '2040-01-01', issuer: 'Root A', sha1Fingerprint: 'XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX' } },
    { id: 'rootB', position: { x: 400, y: 50 }, data: { label: 'Root B', type: 'Root', validTo: '2040-01-01', issuer: 'Root B', sha1Fingerprint: 'YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY:YY' } },
    { id: 'inter1', position: { x: 250, y: 200 }, data: { label: 'Intermediate A', type: 'Intermediate', validTo: '2035-01-01', issuer: 'Root A / Root B', sha1Fingerprint: 'ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ:ZZ' } },
    { id: 'leaf', position: { x: 250, y: 350 }, data: { label: 'Leaf Cert', type: 'Leaf', validTo: '2030-01-01', issuer: 'Intermediate A', sha1Fingerprint: 'AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA' } },
  ],
  edges: [
    createEdge('rootA', 'inter1', 'Signed'),
    createEdge('rootB', 'inter1', 'Cross-Signed'),
    createEdge('inter1', 'leaf', 'Signed'),
  ],
};

// 7. Complex Cross-Signed Architecture
const complexCrossSigned: PKIDataSet = {
  nodes: [
    { id: 'rootA', position: { x: 50, y: 50 }, data: { label: 'Root A', type: 'Root', validTo: '2040-01-01', issuer: 'Root A', sha1Fingerprint: 'AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA:AA' } },
    { id: 'rootB', position: { x: 500, y: 50 }, data: { label: 'Root B', type: 'Root', validTo: '2040-01-01', issuer: 'Root B', sha1Fingerprint: 'BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB:BB' } },
    { id: 'inter1', position: { x: 175, y: 200 }, data: { label: 'Intermediate A', type: 'Intermediate', validTo: '2035-01-01', issuer: 'Root A / Root B', sha1Fingerprint: 'CC:CC:CC:CC:CC:CC:CC:CC:CC:CC:CC:CC:CC:CC:CC:CC:CC:CC:CC:CC' } },
    { id: 'inter2', position: { x: 375, y: 200 }, data: { label: 'Intermediate B', type: 'Intermediate', validTo: '2035-01-01', issuer: 'Root A / Root B', sha1Fingerprint: 'DD:DD:DD:DD:DD:DD:DD:DD:DD:DD:DD:DD:DD:DD:DD:DD:DD:DD:DD:DD' } },
    { id: 'leaf1', position: { x: 175, y: 350 }, data: { label: 'Leaf Cert A', type: 'Leaf', validTo: '2030-01-01', issuer: 'Intermediate A', sha1Fingerprint: 'EE:EE:EE:EE:EE:EE:EE:EE:EE:EE:EE:EE:EE:EE:EE:EE:EE:EE:EE:EE' } },
    { id: 'leaf2', position: { x: 375, y: 350 }, data: { label: 'Leaf Cert B', type: 'Leaf', validTo: '2030-01-01', issuer: 'Intermediate B', sha1Fingerprint: 'FF:FF:FF:FF:FF:FF:FF:FF:FF:FF:FF:FF:FF:FF:FF:FF:FF:FF:FF:FF' } },
  ],
  edges: [
    createEdge('rootA', 'inter1', 'Signed'),
    createEdge('rootB', 'inter1', 'Cross-Signed'),
    createEdge('rootA', 'inter2', 'Signed'),
    createEdge('rootB', 'inter2', 'Cross-Signed'),
    createEdge('inter1', 'leaf1', 'Signed'),
    createEdge('inter2', 'leaf2', 'Signed'),
  ],
};

export type PkiStructureType = 'singleRoot' | 'crossSigned' | 'bridgedCAs' | 'disconnectedIslands' | 'hierarchicalCA' | 'meshCA' | 'complexCrossSigned';

export const pkiDataSets: Record<PkiStructureType, PKIDataSet> = {
  singleRoot,
  crossSigned,
  bridgedCAs,
  disconnectedIslands,
  hierarchicalCA,
  meshCA,
  complexCrossSigned,
};

export const structureOptions: { value: PkiStructureType; label: string }[] = [
    { value: 'singleRoot', label: 'Single Root' },
    { value: 'crossSigned', label: 'Cross-Signed' },
    { value: 'bridgedCAs', label: 'Bridge CA' },
    { value: 'disconnectedIslands', label: 'Disconnected' },
    { value: 'hierarchicalCA', label: 'Hierarchical CA' },
    { value: 'meshCA', label: 'Mesh CA' },
    { value: 'complexCrossSigned', label: 'Complex Cross-Signed' },
];
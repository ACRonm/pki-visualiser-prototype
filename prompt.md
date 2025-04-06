prompt.md

Generate a **Next.js (App Router)** page that visualizes multiple public key infrastructure (PKI) hierarchies using mock data. Use **Reagraph** for dynamic, interactive graph rendering, and **Tailwind CSS** for styling.

The app should support selecting between different trust structures using a dropdown menu or segmented buttons.

Each option loads a different mock PKI layout:
1. **Single Root CA Tree**
2. **Cross-Signed Intermediate**
3. **Bridged CAs**
4. **Disconnected Islands**

### Page Layout

- **Top Section:**
  - Dropdown or segmented buttons labeled: "Single Root", "Cross-Signed", "Bridge CA", "Disconnected"
  - Selecting one updates the visualized graph

- **Main Section:**
  - Left area: Reagraph graph canvas (full-width on mobile, two-thirds width on desktop)
  - Right sidebar (on desktop) or collapsible panel (on mobile): shows metadata for the selected CA

- **Graph Features:**
  - Nodes represent CAs (Root, Intermediate, Bridge, Leaf)
  - Edges represent relationships: Signed, Cross-Signed, or Bridge
  - Color code nodes:
    - Root: `bg-blue-500`
    - Intermediate: `bg-purple-500`
    - Bridge: `bg-yellow-400`
    - Leaf: `bg-green-500`
  - Edge styles:
    - Solid for Signed
    - Dashed for Cross-Signed
    - Dotted for Bridge
  - Highlight trust chains when a node is clicked
  - Allow zoom/pan
  - Fit-to-screen button

- **Sidebar Features:**
  - Show CA metadata:
    - Name, Type, Validity, Issuer, SHA-1 Fingerprint
  - Edge type info (e.g., "Signed by Root CA")
  - Button to export trust chain as JSON
  - Use Tailwind utility classes like `p-4`, `rounded-2xl`, `shadow-md`, `text-sm`, etc.
  - Hide or collapse sidebar on mobile view

- **Responsiveness:**
  - Mobile-first layout
  - Sidebar becomes collapsible drawer or bottom sheet on mobile

### Mock Data Examples:

Use TypeScript interfaces:
```ts
export type CAType = 'Root' | 'Intermediate' | 'Leaf' | 'Bridge';
export type EdgeType = 'Signed' | 'Cross-Signed' | 'Bridge';

export interface CANode {
  id: string;
  label: string;
  type: CAType;
  validTo?: string;
  revoked?: boolean;
}

export interface CAEdge {
  source: string;
  target: string;
  type: EdgeType;
}

#### 1. Single Root
nodes = [
  { id: 'root', label: 'Root CA', type: 'Root' },
  { id: 'inter1', label: 'Intermediate A', type: 'Intermediate' },
  { id: 'leaf', label: 'Leaf Cert', type: 'Leaf' },
];
edges = [
  { source: 'root', target: 'inter1', type: 'Signed' },
  { source: 'inter1', target: 'leaf', type: 'Signed' },
];


#### 2. Cross-Signed Intermediate
nodes = [
  { id: 'rootA', label: 'Root A', type: 'Root' },
  { id: 'rootB', label: 'Root B', type: 'Root' },
  { id: 'cross', label: 'Intermediate X (Cross-Signed)', type: 'Intermediate' },
];
edges = [
  { source: 'rootA', target: 'cross', type: 'Signed' },
  { source: 'rootB', target: 'cross', type: 'Cross-Signed' },
];

#### 3. Bridged CAs
nodes = [
  { id: 'rootA', label: 'Root A', type: 'Root' },
  { id: 'rootB', label: 'Root B', type: 'Root' },
  { id: 'bridge', label: 'Bridge CA', type: 'Bridge' },
];
edges = [
  { source: 'rootA', target: 'bridge', type: 'Signed' },
  { source: 'rootB', target: 'bridge', type: 'Signed' },
];

#### 4. Disconnected Islands
nodes = [
  { id: 'rootA', label: 'Root A', type: 'Root' },
  { id: 'rootB', label: 'Root B', type: 'Root' },
  { id: 'leafA', label: 'Leaf A', type: 'Leaf' },
  { id: 'leafB', label: 'Leaf B', type: 'Leaf' },
];
edges = [
  { source: 'rootA', target: 'leafA', type: 'Signed' },
  { source: 'rootB', target: 'leafB', type: 'Signed' },
];
# PKI Hierarchy Visualiser Prototype

This project is a prototype web application built with Next.js (App Router) and React Flow (`@xyflow/react`) to visualise different Public Key Infrastructure (PKI) hierarchy structures.

## Features

*   **Visualisation:** Displays various PKI structures (Single Root, Cross-Signed, Bridged CAs, Disconnected Islands) using a graph format.
*   **Structure Selection:** Allows switching between different mock PKI datasets using segmented buttons.
*   **Node Details:** Shows metadata (ID, Type, Label, Mock Validity/Issuer/Fingerprint) for a selected CA node in a sidebar.
*   **Custom Styling:** Nodes are coloured based on CA type (Root, Intermediate, Bridge, Leaf) with appropriate text contrast.
*   **Theme Toggle:** Includes a button to switch between light and dark modes (preference saved in local storage).
*   **JSON Export:** Provides a button in the sidebar to export the currently displayed graph structure (nodes and edges) as a JSON file (`pki-hierarchy.json`) using descriptive keys (`certificateAuthorities`, `relationships`).
*   **Cost Estimation:** Displays a mock estimated monthly cost based on the number of Root and Issuing CAs in the current view.
*   **React Flow Controls:** Includes standard controls for zoom, pan, minimap, and a fit-to-view button.

## Running the Development Server

1.  Navigate to the `app` directory: `cd app`
2.  Install dependencies: `npm install`
3.  Run the development server: `npm run dev`
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used

*   [Next.js](https://nextjs.org/) (App Router)
*   [React](https://reactjs.org/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [React Flow (@xyflow/react)](https://reactflow.dev/)
*   [Tailwind CSS](https://tailwindcss.com/)
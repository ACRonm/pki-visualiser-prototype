import PKIGraphClient from '@/components/PKIGraphClient';
import ThemeToggle from '@/components/ThemeToggle'; // Import the toggle

// Renamed function to Home for the root page
export default function Home() {
  return (
    // Remove the dark:bg-gray-900 that overrides our theme variables
    <main className="flex h-screen flex-col items-stretch p-4 md:p-6 lg:p-8 relative"> 
      {/* Add Theme Toggle Button to top-right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <h1 className="text-2xl font-semibold mb-4 text-center dark:text-white">PKI Hierarchy Visualizer</h1>
      {/* Use flex-grow to make the container fill space, adjust border/shadow for dark mode */}
      <div className="flex-grow w-full border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <PKIGraphClient />
      </div>
    </main>
  );
}

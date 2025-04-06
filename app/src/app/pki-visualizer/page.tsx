import PKIGraphClient from '@/components/PKIGraphClient';
import ThemeToggle from '@/components/ThemeToggle';

export default function PkiVisualizerPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-12 lg:p-24 relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <h1 className="text-2xl font-semibold mb-6">PKI Hierarchy Visualizer</h1>
      <div className="w-full h-[calc(100vh-150px)] border rounded-lg shadow-lg">
        <PKIGraphClient />
      </div>
    </main>
  );
}
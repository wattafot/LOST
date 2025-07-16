import Game from "@/components/Game";

export default function GamePage() {
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            LOST Island Adventure
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Explore the mysterious island as a survivor of Oceanic Flight 815. Discover secrets, meet other survivors, and uncover the island's mysteries.
          </p>
        </div>
        <Game />
      </div>
    </div>
  );
}
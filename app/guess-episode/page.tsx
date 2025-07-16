import GuessEpisode from "@/components/GuessEpisode";

export default function GuessEpisodePage() {
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Screenshot Guesser
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Test your knowledge of LOST episodes through screenshots. Can you identify which episode each image is from?
          </p>
        </div>
        <GuessEpisode />
      </div>
    </div>
  );
}
import Quiz from "@/components/Quiz";

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            The LOST Quiz
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Test your knowledge of the mysterious island, the Dharma Initiative, and the survivors of Oceanic Flight 815
          </p>
        </div>
        <Quiz />
      </div>
    </div>
  );
}
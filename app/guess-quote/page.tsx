import QuoteGuess from "@/components/QuoteGuess";

export default function GuessQuotePage() {
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Quote Guesser
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Test your knowledge of iconic LOST quotes. Can you remember who said these memorable lines?
          </p>
        </div>
        <QuoteGuess />
      </div>
    </div>
  );
}
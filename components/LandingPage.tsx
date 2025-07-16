import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="container mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Welcome to the Island
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Are you ready to test your knowledge of the most mysterious island in television history? 
            Dive into the world of LOST and discover how much you really know about the Dharma Initiative, 
            the Others, and the survivors of Oceanic Flight 815.
          </p>
          <Link href="/quiz">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg">
              Start the Quiz
            </Button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <span className="text-2xl mr-3">🧠</span>
                Trivia Quiz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 mb-4">
                Test your knowledge of the island's deepest mysteries, from the smoke monster to the numbers.
              </CardDescription>
              <Link href="/quiz">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Take Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <span className="text-2xl mr-3">📷</span>
                Episode Guesser
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 mb-4">
                Identify episodes from memorable scenes and plot descriptions.
              </CardDescription>
              <Link href="/guess-episode">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Guess Episodes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <span className="text-2xl mr-3">💬</span>
                Quote Guesser
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 mb-4">
                Match iconic quotes to the characters who said them in the show.
              </CardDescription>
              <Link href="/guess-quote">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Guess Quotes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <span className="text-2xl mr-3">🎮</span>
                Island Adventure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 mb-4">
                Explore the mysterious island in this 2D adventure game inspired by Pokemon.
              </CardDescription>
              <Link href="/game">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Play Game
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Game Stats</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">50+</div>
              <div className="text-gray-300">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">4</div>
              <div className="text-gray-300">Game Modes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">1</div>
              <div className="text-gray-300">Island to Explore</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">∞</div>
              <div className="text-gray-300">Attempts</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gray-800 border-gray-700 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                "We have to go back!"
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                - Jack Shephard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-6">
                Ready to prove you're a true LOST fan? The island is calling, and your knowledge is about to be tested.
              </p>
              <Link href="/quiz">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4">
                  Take the Quiz Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
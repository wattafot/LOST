"use client"

import { useState, useEffect } from "react"
import { quotes } from "../quotes.js"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const STORAGE_KEY = "lost-quote-game-state"

export default function QuoteGuess() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showScore, setShowScore] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY)
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        setCurrentQuote(parsedState.currentQuote || 0)
        setSelectedAnswers(parsedState.selectedAnswers || [])
        setShowScore(parsedState.showScore || false)
        setSelectedOption(parsedState.selectedOption || null)
      } catch (error) {
        console.error("Error loading saved quote game state:", error)
      }
    }
  }, [])

  // Save state to localStorage whenever state changes
  useEffect(() => {
    const state = {
      currentQuote,
      selectedAnswers,
      showScore,
      selectedOption,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [currentQuote, selectedAnswers, showScore, selectedOption])

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === quotes[index].correct ? 1 : 0)
    }, 0)
  }

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)
  }

  const handleNextQuestion = () => {
    if (selectedOption === null) return

    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuote] = selectedOption
    setSelectedAnswers(newAnswers)

    if (currentQuote + 1 < quotes.length) {
      setCurrentQuote(currentQuote + 1)
      setSelectedOption(null)
    } else {
      setShowScore(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuote(0)
    setSelectedAnswers([])
    setShowScore(false)
    setSelectedOption(null)
    // Clear localStorage when restarting
    localStorage.removeItem(STORAGE_KEY)
  }

  const progress = (currentQuote / quotes.length) * 100

  if (showScore) {
    const score = calculateScore()
    const percentage = Math.round((score / quotes.length) * 100)

    return (
      <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">
            Quote Game Complete!
          </CardTitle>
          <CardDescription className="text-xl text-gray-300">
            Your final score: {score} out of {quotes.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-6xl font-bold text-emerald-400">
            {percentage}%
          </div>
          <div className="text-lg text-gray-300">
            {percentage >= 80
              ? "Excellent! You really know your LOST quotes!"
              : percentage >= 60
              ? "Great job! You're a true LOST fan!"
              : percentage >= 40
              ? "Not bad! Time to rewatch some episodes?"
              : "The island's mysteries are still hidden from you!"}
          </div>
          <Button
            onClick={handleRestart}
            size="lg"
            className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
          >
            Play Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700 min-h-[600px] flex flex-col">
      <CardHeader className="pb-8">
        <div className="flex justify-between items-center mb-6">
          <CardDescription className="text-gray-400">
            Quote {currentQuote + 1} of {quotes.length}
          </CardDescription>
          <CardDescription className="text-gray-400">
            {Math.round(progress)}% Complete
          </CardDescription>
        </div>
        <Progress value={progress} className="mb-6" />
        <CardTitle className="text-2xl leading-relaxed text-white min-h-[120px] flex items-center justify-center text-center">
          <div>
            <div className="text-3xl mb-4">💬</div>
            <div className="italic">"{quotes[currentQuote].quote}"</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="text-center text-gray-400 mb-6">
            Who said this quote?
          </div>
          {quotes[currentQuote].options.map((option, index) => (
            <Button
              key={index}
              variant={selectedOption === index ? "default" : "outline"}
              className={`w-full justify-start text-left h-auto p-6 text-base min-h-[60px] cursor-pointer border border-gray-600 ${
                selectedOption === index
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600"
              }`}
              onClick={() => handleAnswerSelect(index)}
            >
              <span className="font-medium mr-4">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </Button>
          ))}
        </div>
        <div className="pt-6">
          <Button
            onClick={handleNextQuestion}
            disabled={selectedOption === null}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-base cursor-pointer disabled:cursor-not-allowed"
            size="lg"
          >
            {currentQuote + 1 === quotes.length ? "Finish Game" : "Next Quote"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

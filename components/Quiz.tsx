"use client";

import { useState, useEffect } from 'react';
import { questions } from '../questions.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const STORAGE_KEY = 'lost-quiz-state';

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setCurrentQuestion(parsedState.currentQuestion || 0);
        setSelectedAnswers(parsedState.selectedAnswers || []);
        setShowScore(parsedState.showScore || false);
        setSelectedOption(parsedState.selectedOption || null);
      } catch (error) {
        console.error('Error loading saved quiz state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever state changes
  useEffect(() => {
    const state = {
      currentQuestion,
      selectedAnswers,
      showScore,
      selectedOption
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [currentQuestion, selectedAnswers, showScore, selectedOption]);

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correct ? 1 : 0);
    }, 0);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = selectedOption;
    setSelectedAnswers(newAnswers);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowScore(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowScore(false);
    setSelectedOption(null);
    // Clear localStorage when restarting
    localStorage.removeItem(STORAGE_KEY);
  };

  const progress = (currentQuestion / questions.length) * 100;

  if (showScore) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">Quiz Complete!</CardTitle>
          <CardDescription className="text-xl text-gray-300">
            Your final score: {score} out of {questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-6xl font-bold text-emerald-400">{percentage}%</div>
          <div className="text-lg text-gray-300">
            {percentage >= 80 ? "Excellent! You're a true LOST fan!" :
             percentage >= 60 ? "Great job! You know your LOST trivia!" :
             percentage >= 40 ? "Not bad! Maybe time for a rewatch?" :
             "Looks like you need to revisit the island!"}
          </div>
          <Button onClick={handleRestart} size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
            Take Quiz Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700 min-h-[600px] flex flex-col">
      <CardHeader className="pb-8">
        <div className="flex justify-between items-center mb-6">
          <CardDescription className="text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </CardDescription>
          <CardDescription className="text-gray-400">{Math.round(progress)}% Complete</CardDescription>
        </div>
        <Progress value={progress} className="mb-6" />
        <CardTitle className="text-2xl leading-relaxed text-white min-h-[80px] flex items-center">
          {questions[currentQuestion].question}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {questions[currentQuestion].options.map((option, index) => (
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
              <span className="font-medium mr-4">{String.fromCharCode(65 + index)}.</span>
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
            {currentQuestion + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
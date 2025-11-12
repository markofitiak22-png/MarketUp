"use client";

import { useState, useEffect } from "react";

interface SimpleCaptchaProps {
  onVerify: (isValid: boolean) => void;
  className?: string;
}

export default function SimpleCaptcha({ onVerify, className = "" }: SimpleCaptchaProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [isValid, setIsValid] = useState(false);

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = Math.random() > 0.5 ? "+" : "-";
    
    let questionText = "";
    let correctAnswer = 0;
    
    if (operation === "+") {
      questionText = `What is ${num1} + ${num2}?`;
      correctAnswer = num1 + num2;
    } else {
      // Ensure positive result for subtraction
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      questionText = `What is ${larger} - ${smaller}?`;
      correctAnswer = larger - smaller;
    }
    
    setQuestion(questionText);
    setAnswer(correctAnswer.toString());
    setUserAnswer("");
    setIsValid(false);
    onVerify(false);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswerChange = (value: string) => {
    setUserAnswer(value);
    const isValidAnswer = value === answer;
    setIsValid(isValidAnswer);
    onVerify(isValidAnswer);
  };

  const handleRefresh = () => {
    generateQuestion();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-semibold text-white">
        Security Check *
      </label>
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <p className="text-sm font-medium text-white/90 mb-3">{question}</p>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Your answer"
              className="w-full px-4 py-2.5 border border-slate-700/60 rounded-lg bg-slate-800/50 backdrop-blur-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
            />
            {isValid && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="px-4 py-2.5 h-[42px] flex items-center justify-center text-white/70 hover:text-white border border-slate-700/60 hover:border-indigo-500/50 rounded-lg bg-slate-800/50 hover:bg-slate-800/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 flex-shrink-0"
            title="Generate new question"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
      {userAnswer && !isValid && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Please check your answer
        </p>
      )}
      {isValid && (
        <p className="text-sm text-green-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Correct!</span>
        </p>
      )}
    </div>
  );
}

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
      <label className="block text-sm font-medium text-foreground">
        Security Check *
      </label>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm text-foreground-muted mb-2">{question}</p>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Your answer"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className="px-3 py-2 text-sm text-foreground-muted hover:text-foreground border border-border rounded-lg hover:bg-surface-elevated transition-colors"
          title="Generate new question"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      {userAnswer && !isValid && (
        <p className="text-sm text-red-500">Please check your answer</p>
      )}
      {isValid && (
        <p className="text-sm text-green-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Correct!
        </p>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Quiz, QuizQuestion } from '@/types/content';
import { useProgressStore } from '@/stores/progressStore';

interface InteractiveQuizProps {
  quiz: Quiz;
  trackId: string;
  onPass?: () => void;
}

type QuizState = 'idle' | 'answered' | 'completed';

export function InteractiveQuiz({ quiz, trackId, onPass }: InteractiveQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [showExplanation, setShowExplanation] = useState<string | null>(null);

  const { saveQuizResult, completeLesson } = useProgressStore();

  const currentQuestion: QuizQuestion | undefined = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (quizState === 'completed') return;

    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setShowExplanation(questionId);
    setQuizState('answered');
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // 퀴즈 완료 처리
      const correctCount = quiz.questions.filter(
        (q) => selectedAnswers[q.id] === q.correctOptionId
      ).length;
      const score = Math.round((correctCount / totalQuestions) * 100);
      const passed = score >= quiz.passingScore;

      const result = {
        lessonId: quiz.lessonId,
        score,
        passed,
        answers: selectedAnswers,
        completedAt: new Date().toISOString(),
      };

      saveQuizResult(quiz.lessonId, result);

      if (passed) {
        completeLesson(quiz.lessonId, trackId);
        onPass?.();
      }

      setQuizState('completed');
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowExplanation(null);
      setQuizState('idle');
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizState('idle');
    setShowExplanation(null);
  };

  // 완료 화면
  if (quizState === 'completed') {
    const correctCount = quiz.questions.filter(
      (q) => selectedAnswers[q.id] === q.correctOptionId
    ).length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= quiz.passingScore;

    return (
      <div className="rounded-xl border border-border p-6 my-6 bg-muted/20">
        <div className="text-center">
          {passed ? (
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" aria-hidden="true" />
          ) : (
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" aria-hidden="true" />
          )}
          <h3 className="text-lg font-bold mb-1">
            {passed ? '퀴즈 통과!' : '다시 도전해보세요'}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {totalQuestions}문제 중 {correctCount}문제 정답 ({score}점 / 합격점 {quiz.passingScore}점)
          </p>
          {passed && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
              <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                레슨이 완료로 표시되었습니다!
              </p>
            </div>
          )}
          <button
            onClick={handleReset}
            className={cn(
              'flex items-center gap-2 mx-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              'bg-muted hover:bg-muted/80 text-foreground'
            )}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            다시 풀기
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const selectedOption = selectedAnswers[currentQuestion.id];
  const isCorrect = selectedOption === currentQuestion.correctOptionId;

  return (
    <div className="rounded-xl border border-border p-6 my-6 bg-muted/20" role="region" aria-label="퀴즈">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground">
          퀴즈 {currentQuestionIndex + 1} / {totalQuestions}
        </h3>
        <div className="flex gap-1">
          {quiz.questions.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 w-6 rounded-full transition-colors',
                i < currentQuestionIndex
                  ? selectedAnswers[quiz.questions[i].id] === quiz.questions[i].correctOptionId
                    ? 'bg-green-500'
                    : 'bg-red-400'
                  : i === currentQuestionIndex
                  ? 'bg-primary'
                  : 'bg-muted'
              )}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <p className="text-base font-medium mb-4">{currentQuestion.question}</p>

      <fieldset>
        <legend className="sr-only">답을 선택하세요</legend>
        <div className="space-y-2" role="group">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const isCorrectOption = option.id === currentQuestion.correctOptionId;
            const showResult = showExplanation === currentQuestion.id;

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                disabled={!!selectedOption}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  !selectedOption && 'hover:border-primary hover:bg-primary/5 cursor-pointer border-border',
                  selectedOption && !showResult && 'cursor-default border-border opacity-60',
                  showResult && isCorrectOption && 'border-green-500 bg-green-50 dark:bg-green-950/30',
                  showResult && isSelected && !isCorrectOption && 'border-red-500 bg-red-50 dark:bg-red-950/30',
                  showResult && !isSelected && !isCorrectOption && 'cursor-default border-border opacity-50',
                )}
                aria-pressed={isSelected}
                aria-label={`${option.id.toUpperCase()}. ${option.text}${showResult && isCorrectOption ? ' (정답)' : ''}${showResult && isSelected && !isCorrectOption ? ' (오답)' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold',
                      showResult && isCorrectOption
                        ? 'border-green-500 bg-green-500 text-white'
                        : showResult && isSelected && !isCorrectOption
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-current text-muted-foreground'
                    )}
                    aria-hidden="true"
                  >
                    {option.id.toUpperCase()}
                  </span>
                  <span className="flex-1">{option.text}</span>
                  {showResult && isCorrectOption && (
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  {showResult && isSelected && !isCorrectOption && (
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </fieldset>

      {showExplanation === currentQuestion.id && (
        <div
          className={cn(
            'mt-4 p-3 rounded-lg text-sm',
            isCorrect
              ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
              : 'bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800'
          )}
          role="alert"
        >
          <p className={cn('font-medium mb-1', isCorrect ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300')}>
            {isCorrect ? '정답입니다!' : '아쉽네요, 정답은 다른 것입니다.'}
          </p>
          <p className="text-foreground/80">{currentQuestion.explanation}</p>
        </div>
      )}

      {selectedOption && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isLastQuestion ? '결과 보기' : '다음 문제'}
          </button>
        </div>
      )}
    </div>
  );
}

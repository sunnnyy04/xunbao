import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { useQuestions, useSubmitAnswer, useLeaderboard } from '../hooks/quizHooks';
import { useQuizStore } from '../store/quizStore';
import SpaceElements from '@/components/bgElements';

export const Route = createFileRoute('/quiz')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { data: allQuestions, isLoading } = useQuestions();
  const submitAnswerMutation = useSubmitAnswer();
  const { data: leaderboardData, isLoading: isLeaderboardLoading, error: leaderboardError } = useLeaderboard();

  const { questions, setQuestions, removeCurrentQuestion } = useQuizStore();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTimer = localStorage.getItem('quizTimer');
    if (savedTimer) {
      const { startTime, duration } = JSON.parse(savedTimer);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = duration - elapsed;
      return remaining > 0 ? remaining : 0;
    }
    return 20;
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [startTime, setStartTime] = useState(() => {
    const savedTimer = localStorage.getItem('quizTimer');
    return savedTimer ? JSON.parse(savedTimer).startTime : null;
  });

  useEffect(() => {
    if (allQuestions && allQuestions.length > 0 && questions.length === 0) {
      setQuestions(allQuestions);
    }
  }, [allQuestions, questions.length, setQuestions]);

  const currentQuestion = questions.length > 0 ? questions[0] : null;

  useEffect(() => {
    if (!currentQuestion || showModal) return;

    const newStartTime = startTime || Date.now();
    if (!startTime) {
      setStartTime(newStartTime);
      localStorage.setItem('quizTimer', JSON.stringify({ startTime: newStartTime, duration: 20 }));
      setTimeLeft(20);
    }

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - newStartTime) / 1000);
      const remaining = 20 - elapsed;

      setTimeLeft(remaining > 0 ? remaining : 0);

      if (remaining <= 0) {
        clearInterval(timer);
        setShowModal(true);
        localStorage.removeItem('quizTimer');
        setStartTime(null);
        if (isCorrect) {
          removeCurrentQuestion();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, showModal, startTime, isCorrect]);

  useEffect(() => {
    if (showModal) {
      const modalTimer = setTimeout(() => {
        setShowModal(false);
        setSelectedOption(null);
        setIsSubmitted(false);
        setIsCorrect(false);
        setStartTime(null);
        localStorage.removeItem('quizTimer');
        if (questions.length === 0 || (isCorrect && questions.length === 1)) {
          navigate({ to: '/leaderboard' });
        }
      }, 10000);

      return () => clearTimeout(modalTimer);
    }
  }, [showModal, questions.length, navigate, isCorrect]);

  const selectOption = (option: string) => {
    if (!isSubmitted || (isSubmitted && !isCorrect)) {
      setSelectedOption(option);
    }
  };

  const submitAnswer = async () => {
    if (!currentQuestion || !selectedOption || (isSubmitted && isCorrect)) return;

    setIsSubmitted(true);

    try {
      const result = await submitAnswerMutation.mutateAsync({
        questionId: currentQuestion.id,
        selectedOption,
      });

      if (result.correct) {
        setIsCorrect(true);
      } else {
        setIsSubmitted(false);
        setSelectedOption(null);
      }

      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = 20 - elapsed;
      if (remaining > 0) {
        setTimeout(() => {
          setShowModal(true);
          localStorage.removeItem('quizTimer');
          setStartTime(null);
          if (result.correct) {
            removeCurrentQuestion();
          }
        }, remaining * 1000);
      } else {
        setShowModal(true);
        localStorage.removeItem('quizTimer');
        setStartTime(null);
        if (result.correct) {
          removeCurrentQuestion();
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setIsSubmitted(false);
      setSelectedOption(null);
    }
  };

  return (
    <>
      <SpaceElements />
      <div className="relative z-10 min-h-screen flex justify-center items-center px-6">
        <div className="relative w-full max-w-3xl">
          <img
            className="absolute top-[-50px] right-[50px] w-30"
            src="/question_saturn.png"
            alt="Saturn"
          />
          <div className="absolute top-0 left-6 translate-y-[-50%] bg-black text-white text-xl px-3 py-1 rounded-bl-xl">
            Question
          </div>
          <SignedOut>
            <div className="flex flex-col border rounded-xl p-6 pt-12 w-full gap-7 text-white text-center">
              <p>Please sign in to play the quiz.</p>
              <SignInButton mode="modal">
                <button className="border py-2 px-3 rounded-sm bg-blue-500 text-white shadow-[3px_4px_0_white]">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex flex-col border rounded-xl p-6 pt-12 w-full gap-7">
              <div>
                {isLoading ? (
                  <div className="text-white text-2xl">Loading questions...</div>
                ) : currentQuestion ? (
                  <div className="text-white text-2xl">{currentQuestion.question}</div>
                ) : (
                  <div className="text-white text-2xl">
                    {questions.length === 0 ? 'All questions answered!' : 'No questions available.'}
                  </div>
                )}
                <div className="text-white">
                  {currentQuestion && !showModal ? `Time left: ${timeLeft}s` : 'Waiting for questions...'}
                </div>
                <div
                  className="my-3 h-5 w-full"
                  style={{
                    background: `repeating-linear-gradient(90deg, white 0 3px, transparent 0 7px)`,
                    backgroundSize: '100% 2px',
                    backgroundRepeat: 'no-repeat',
                  }}
                ></div>
              </div>
              {isCorrect && !showModal && (
                <div className="text-green-500 text-center font-bold">
                  Correct answer! Waiting for timer to finish...
                </div>
              )}
              <div className="text-white flex flex-col gap-4">
                {currentQuestion ? (
                  currentQuestion.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => selectOption(opt)}
                      className={`border py-2 px-3 rounded-sm shadow-[3px_4px_0_white] active:shadow-[1px_2px_0_white] ${
                        selectedOption === opt ? 'bg-blue-500' : ''
                      } ${isCorrect || showModal ? 'cursor-not-allowed' : ''}`}
                      disabled={isCorrect || showModal}
                      aria-pressed={selectedOption === opt}
                    >
                      {opt}
                    </button>
                  ))
                ) : (
                  <div>{isLoading ? 'Loading options...' : 'No options available.'}</div>
                )}
                {currentQuestion && !isCorrect && !showModal && (
                  <button
                    onClick={submitAnswer}
                    className={`border py-2 px-3 rounded-sm shadow-[3px_4px_0_white] active:shadow-[1px_2px_0_white] ${
                      !selectedOption || submitAnswerMutation.isPending ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500'
                    }`}
                    disabled={!selectedOption || submitAnswerMutation.isPending}
                  >
                    {submitAnswerMutation.isPending ? 'Submitting...' : 'Submit'}
                  </button>
                )}
              </div>
            </div>
          </SignedIn>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {questions.length === 0 || (isCorrect && questions.length === 1) ? 'Quiz Complete!' : 'Time’s Up!'}
            </h2>
            <p className="text-lg mb-4">
              {questions.length === 0 || (isCorrect && questions.length === 1)
                ? 'You’ve answered all questions.'
                : isCorrect
                ? 'Correct! Moving to the next question...'
                : 'The timer has expired or answer was incorrect. Moving to the next question...'}
            </p>
            <h3 className="text-xl font-semibold mb-2">Leaderboard</h3>
            {isLeaderboardLoading ? (
              <p>Loading leaderboard...</p>
            ) : leaderboardError ? (
              <p className="text-red-500">Error loading leaderboard: {leaderboardError.message}</p>
            ) : leaderboardData && leaderboardData.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Rank</th>
                    <th className="border p-2">Username</th>
                    <th className="border p-2">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry) => (
                    <tr key={entry.rank} className="hover:bg-gray-50">
                      <td className="border p-2">{entry.rank}</td>
                      <td className="border p-2">{entry.username}</td>
                      <td className="border p-2">{entry.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No leaderboard data available.</p>
            )}
            <p className="text-sm mt-4">
              {questions.length === 0 || (isCorrect && questions.length === 1)
                ? 'Redirecting to leaderboard in 10 seconds...'
                : 'This modal will close in 10 seconds.'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

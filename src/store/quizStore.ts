import { create } from 'zustand';
import { Question } from '../hooks/quizHooks';

interface QuizState {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  removeCurrentQuestion: () => void;
  resetQuestions: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  questions: [],
  setQuestions: (questions) => set({ questions }),
  removeCurrentQuestion: () => set((state) => ({ 
    questions: state.questions.slice(1) 
  })),
  resetQuestions: () => set({ questions: [] }),
}));

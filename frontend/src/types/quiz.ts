export interface QuizQuestion {
  question: string;
  choices: string[];
  correct_answer: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
}
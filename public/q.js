// Cria uma pergunta no mesmo formato do mockQuestions.
// level: 'facil' | 'medio' | 'dificil'. correct: índice (0 a 3) da resposta certa em options.
export const q = (id, level, question, options, correct, explanation) => ({
  id,
  level,
  question,
  options,
  correct,
  explanation,
});

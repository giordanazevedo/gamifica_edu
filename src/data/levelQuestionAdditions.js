import { portuguesLevelQuestions } from './levelQuestions/portugues.js';
import { cienciasLevelQuestions } from './levelQuestions/ciencias.js';
import { historiaLevelQuestions } from './levelQuestions/historia.js';
import { geografiaLevelQuestions } from './levelQuestions/geografia.js';
import { inglesLevelQuestions } from './levelQuestions/ingles.js';
import { arteLevelQuestions } from './levelQuestions/arte.js';
import { edFisicaLevelQuestions } from './levelQuestions/edFisica.js';
import { religiaoLevelQuestions } from './levelQuestions/religiao.js';

const LEVELS = ['facil', 'medio', 'dificil'];

// Garante que cada nível de cada tópico tenha questões suficientes (mínimo de 15).
// A posição da resposta correta varia, e as alternativas ainda são embaralhadas na rodada.
function buildLevelQuestions(subject, topics) {
  return Object.fromEntries(Object.entries(topics).map(([topic, levels]) => [
    topic,
    LEVELS.flatMap(level => (levels[level] || []).map(([question, answer, distractors, explanation], index) => {
      const correct = index % (distractors.length + 1);
      const options = [...distractors];
      options.splice(correct, 0, answer);
      return {
        id: `level-${subject}-${topic}-${level}-${index + 1}`,
        question,
        options,
        correct,
        level,
        explanation,
      };
    })),
  ]));
}

export const levelQuestionAdditions = {
  portugues: { '9': buildLevelQuestions('portugues', portuguesLevelQuestions) },
  ciencias: { '9': buildLevelQuestions('ciencias', cienciasLevelQuestions) },
  historia: { '9': buildLevelQuestions('historia', historiaLevelQuestions) },
  geografia: { '9': buildLevelQuestions('geografia', geografiaLevelQuestions) },
  ingles: { '9': buildLevelQuestions('ingles', inglesLevelQuestions) },
  arte: { '9': buildLevelQuestions('arte', arteLevelQuestions) },
  ed_fisica: { '9': buildLevelQuestions('ed_fisica', edFisicaLevelQuestions) },
  religiao: { '9': buildLevelQuestions('religiao', religiaoLevelQuestions) },
};

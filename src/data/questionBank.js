import { curriculum } from './curriculum.js';
import { mockQuestions } from './questions.js';
import { preparedQuestionAdditions } from './preparedQuestionAdditions.js';
import { topicQuestionAdditions } from './topicQuestionAdditions.js';
import { questions9ano } from './questions9ano.js';

const QUESTION_PROGRESS_KEY = 'gamificaEduQuestionProgress';
const DIFFICULTIES = ['fácil', 'médio', 'difícil'];
const ROUND_SIZE = 15;
const IMPORTED_TOPIC_MAP = {
  portugues: {
    argumentacao_reivindicacao: ['noticias_e_argumentacao', 'conjuncoes_e_coesao'],
    modalizacao_epistemica: ['morfossintaxe'],
    entrevistas_oralidade: ['norma_padrao_e_variacao'],
  },
  matematica: {
    radicais_potencias: ['numeros_reais'],
    funcoes: ['porcentagem_e_funcoes'],
    teorema_pitagoras: ['teorema_pitagoras', 'geometria_e_medidas'],
    equacoes_2grau: ['equacoes_2grau'],
    estatistica: ['probabilidade'],
  },
  ciencias: {
    estrutura_atomica: ['materia_e_atomos'],
    fisica: ['luz_som_e_radiacoes'],
    genetica_evolucao: ['genetica_e_evolucao'],
    astronomia: ['universo_e_conservacao'],
  },
  geografia: {
    economia_global: ['mundo_e_globalizacao'],
    eurasia_oceania: ['europa_asia_oceania'],
    recursos_sustentabilidade: ['energia_e_industrializacao', 'mapas_e_representacao'],
  },
  historia: {
    brasil_republica: ['republica_no_brasil'],
    guerras_mundiais: ['guerras_e_totalitarismos'],
    guerra_fria_ditaduras: ['mundo_pos_guerra'],
    redemocratizacao: ['ditadura_e_democracia'],
  },
};

function normalizeQuestion(question, subjectId, grade, topicId, index) {
  const pergunta = question.pergunta ?? question.question;
  const opcoes = question.opcoes ?? question.options;
  const correta = question.correta ?? question.correct;
  const id = `${subjectId}-${grade}-${topicId}-${question.id ?? index}`;
  const explicacao = question.explicacao
    ?? question.explanation
    ?? `A alternativa correta é: ${opcoes[correta]}.`;
  const rawLevel = question.nivel ?? question.level;
  const levelAliases = {
    facil: 'fácil',
    medio: 'médio',
    dificil: 'difícil',
  };
  const nivel = levelAliases[rawLevel]
    || (DIFFICULTIES.includes(rawLevel) ? rawLevel : 'médio');

  return {
    ...question,
    id,
    nivel,
    pergunta,
    opcoes,
    correta,
    explicacao,
    question: pergunta,
    options: opcoes,
    correct: correta,
    explanation: explicacao,
    subject: subjectId,
  };
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const otherIndex = randomInt(0, index);
    [result[index], result[otherIndex]] = [result[otherIndex], result[index]];
  }
  return result;
}

function formatNumber(value) {
  return Number.isInteger(value)
    ? String(value)
    : value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
}

function formatPoint(x, y) {
  return `(${formatNumber(x)}, ${formatNumber(y)})`;
}

function createQuestion({ id, nivel, pergunta, answer, distractors, explicacao }) {
  const answerText = String(answer);
  const options = [answerText];
  for (const distractor of distractors) {
    const text = String(distractor);
    if (!options.includes(text)) options.push(text);
  }
  while (options.length < 4) {
    const fallback = `${answerText} (${options.length})`;
    if (!options.includes(fallback)) options.push(fallback);
  }
  const opcoes = shuffle(options.slice(0, 4));
  const answerIndex = opcoes.indexOf(answerText);

  return {
    id,
    nivel,
    pergunta,
    opcoes,
    correta: answerIndex,
    explicacao,
    question: pergunta,
    options: opcoes,
    correct: answerIndex,
    explanation: explicacao,
    subject: 'matematica',
  };
}

function generatePythagoras(level) {
  const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
  const [baseA, baseB, baseC] = triples[randomInt(0, triples.length - 1)];
  const scale = randomInt(1, level === 'fácil' ? 3 : level === 'médio' ? 8 : 15);
  const a = baseA * scale;
  const b = baseB * scale;
  const c = baseC * scale;
  const answer = c;
  return createQuestion({
    id: `pythagoras-${a}-${b}`,
    nivel: level,
    pergunta: `Um triângulo retângulo tem catetos de ${a} cm e ${b} cm. Qual é a medida da hipotenusa?`,
    answer,
    distractors: [a + b, Math.abs(b - a), Math.sqrt(a * b)],
    explicacao: `Pelo Teorema de Pitágoras, c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}. Portanto, c = √${c * c} = ${c} cm.`,
  });
}

function generatePercentage(level) {
  const base = level === 'fácil' ? randomInt(2, 10) * 10
    : level === 'médio' ? randomInt(12, 40) * 10
      : randomInt(30, 100) * 10;
  const percentage = [10, 15, 20, 25, 30, 40][randomInt(0, 5)];
  const answer = base * percentage / 100;
  return createQuestion({
    id: `percentage-${base}-${percentage}`,
    nivel: level,
    pergunta: `Quanto é ${percentage}% de ${formatNumber(base)}?`,
    answer: formatNumber(answer),
    distractors: [
      formatNumber(base * percentage),
      formatNumber(base - answer),
      formatNumber(answer + percentage),
    ],
    explicacao: `${percentage}% = ${percentage}/100. Então, ${formatNumber(base)} × ${percentage}/100 = ${formatNumber(answer)}.`,
  });
}

function generateSimpleInterest(level) {
  const principal = level === 'fácil' ? randomInt(2, 10) * 100
    : level === 'médio' ? randomInt(12, 40) * 100
      : randomInt(30, 100) * 100;
  const rate = [2, 3, 4, 5, 8, 10][randomInt(0, 5)];
  const months = randomInt(2, level === 'fácil' ? 6 : 12);
  const interest = principal * (rate / 100) * months;
  return createQuestion({
    id: `simple-interest-${principal}-${rate}-${months}`,
    nivel: level,
    pergunta: `Qual é o juro simples de um capital de R$ ${formatNumber(principal)}, aplicado a ${rate}% ao mês durante ${months} meses?`,
    answer: `R$ ${formatNumber(interest)}`,
    distractors: [
      `R$ ${formatNumber(principal * rate / 100)}`,
      `R$ ${formatNumber(interest + principal)}`,
      `R$ ${formatNumber(principal * months)}`,
    ],
    explicacao: `Use J = C × i × t. Assim, J = ${formatNumber(principal)} × ${rate}/100 × ${months} = R$ ${formatNumber(interest)}.`,
  });
}

function generateFunction(level) {
  const a = randomInt(2, level === 'fácil' ? 5 : level === 'médio' ? 9 : 12);
  const b = randomInt(-10, 15);
  const x = randomInt(2, level === 'fácil' ? 6 : 12);
  const answer = a * x + b;
  const signedB = b < 0 ? ` - ${Math.abs(b)}` : ` + ${b}`;
  return createQuestion({
    id: `function-${a}-${b}-${x}`,
    nivel: level,
    pergunta: `Se f(x) = ${a}x${signedB}, quanto vale f(${x})?`,
    answer,
    distractors: [a * x, a + x + b, a * (x + b)],
    explicacao: `Substitua x por ${x}: f(${x}) = ${a} × ${x}${signedB} = ${a * x}${b < 0 ? ` - ${Math.abs(b)}` : ` + ${b}`} = ${answer}.`,
  });
}

function generateMidpoint(level) {
  const max = level === 'fácil' ? 10 : level === 'médio' ? 20 : 40;
  const x1 = randomInt(-max, max);
  const y1 = randomInt(-max, max);
  const x2 = randomInt(-max, max);
  const y2 = randomInt(-max, max);
  const x = (x1 + x2) / 2;
  const y = (y1 + y2) / 2;
  return createQuestion({
    id: `midpoint-${x1}-${y1}-${x2}-${y2}`,
    nivel: level,
    pergunta: `Qual é o ponto médio do segmento com extremidades A${formatPoint(x1, y1)} e B${formatPoint(x2, y2)}?`,
    answer: formatPoint(x, y),
    distractors: [
      formatPoint(x1 + x2, y1 + y2),
      formatPoint(x, y === 0 ? 1 : -y),
      formatPoint(y, x),
    ],
    explicacao: `M = ((x₁ + x₂)/2, (y₁ + y₂)/2) = ((${x1} + ${x2})/2, (${y1} + ${y2})/2) = ${formatPoint(x, y)}.`,
  });
}

function generatePower(level) {
  const base = randomInt(2, level === 'fácil' ? 5 : level === 'médio' ? 8 : 12);
  const exponent = randomInt(2, level === 'fácil' ? 3 : 4);
  const answer = base ** exponent;
  return createQuestion({
    id: `power-${base}-${exponent}`,
    nivel: level,
    pergunta: `Qual é o valor de ${base} elevado à potência ${exponent}?`,
    answer,
    distractors: [
      base * exponent,
      base ** (exponent - 1),
      answer + base,
    ],
    explicacao: `${base}^${exponent} significa multiplicar ${base} por si mesmo ${exponent} vezes: ${Array(exponent).fill(base).join(' × ')} = ${answer}.`,
  });
}

function generateMathQuestions(difficulty) {
  const generators = [
    generatePythagoras,
    generatePercentage,
    generateSimpleInterest,
    generateFunction,
    generateMidpoint,
    generatePower,
  ];
  const levels = difficulty === 'misturado'
    ? DIFFICULTIES
    : [difficulty];
  const questions = [];
  const questionTexts = new Set();
  let attempts = 0;

  while (questions.length < ROUND_SIZE && attempts < ROUND_SIZE * 50) {
    const index = questions.length;
    const generator = generators[index % generators.length];
    const level = difficulty === 'misturado'
      ? levels[index % levels.length]
      : levels[0];
    const question = generator(level);
    attempts += 1;

    if (questionTexts.has(question.pergunta)) continue;
    questionTexts.add(question.pergunta);
    questions.push({
      ...question,
      id: `math-${difficulty}-${index + 1}-${question.id}`,
    });
  }

  if (questions.length < ROUND_SIZE) {
    throw new Error(`Não foi possível criar ${ROUND_SIZE} perguntas matemáticas sem repetição.`);
  }
  return questions;
}

function readProgress() {
  const stored = localStorage.getItem(QUESTION_PROGRESS_KEY);
  if (!stored) return { answered: [], wrong: [], mathSets: {} };

  try {
    const parsed = JSON.parse(stored);
    return {
      answered: Array.isArray(parsed.answered) ? parsed.answered : [],
      wrong: Array.isArray(parsed.wrong) ? parsed.wrong : [],
      mathSets: parsed.mathSets && typeof parsed.mathSets === 'object'
        ? parsed.mathSets
        : {},
    };
  } catch (error) {
    console.error('Não foi possível ler o progresso das questões salvo no navegador.', error);
    return { answered: [], wrong: [], mathSets: {} };
  }
}

function saveProgress(progress) {
  localStorage.setItem(QUESTION_PROGRESS_KEY, JSON.stringify(progress));
}

export function recordQuestionAnswer(questionId, isWrong) {
  const progress = readProgress();
  const answered = new Set(progress.answered);
  const wrong = new Set(progress.wrong);
  answered.add(questionId);
  if (isWrong) wrong.add(questionId);
  else wrong.delete(questionId);
  saveProgress({
    answered: [...answered],
    wrong: [...wrong],
    mathSets: progress.mathSets,
  });
}

function selectRound(questions, difficulty) {
  const progress = readProgress();
  const answered = new Set(progress.answered);
  const eligible = questions.filter(question => (
    difficulty === 'misturado' || question.nivel === difficulty
  ));
  const unseen = shuffle(eligible.filter(question => !answered.has(question.id)));

  return unseen
    .slice(0, ROUND_SIZE)
    .map(question => {
      const opcoes = shuffle(question.opcoes);
      const correta = opcoes.indexOf(question.opcoes[question.correta]);
      return {
        ...question,
        opcoes,
        correta,
        options: opcoes,
        correct: correta,
      };
    });
}

export function getPreparedQuestions(subjectId, grade, topicId) {
  const gradeKey = grade && grade !== 'Professor' ? String(grade) : '9';
  const existing = mockQuestions[subjectId]?.[gradeKey]?.[topicId] || [];
  const additions = gradeKey === '9'
    ? preparedQuestionAdditions[subjectId]?.['9']?.[topicId] || []
    : [];
  const topicSpecificAdditions = gradeKey === '9'
    ? topicQuestionAdditions[subjectId]?.['9']?.[topicId] || []
    : [];
  const importedTopics = gradeKey === '9'
    ? IMPORTED_TOPIC_MAP[subjectId]?.[topicId] || []
    : [];
  const imported = importedTopics.flatMap(sourceTopic => (
    (questions9ano[subjectId]?.['9']?.[sourceTopic] || []).map((question, index) => ({
      ...question,
      id: `${sourceTopic}-${question.id ?? index}`,
    }))
  ));
  const normalized = [
    ...imported,
    ...existing,
    ...additions,
    ...topicSpecificAdditions,
  ].map((question, index) => (
    normalizeQuestion(question, subjectId, gradeKey, topicId, index)
  ));
  const seenQuestions = new Set();
  return normalized.filter(question => {
    const normalizedText = question.pergunta.trim().toLocaleLowerCase();
    if (seenQuestions.has(normalizedText)) return false;
    seenQuestions.add(normalizedText);
    return true;
  });
}

export function createQuestionRound({ questions, subjectId, grade, topicId, difficulty }) {
  let prepared = questions;
  if (subjectId === 'matematica') {
    const progress = readProgress();
    const mathSetId = `${subjectId}-${grade}-${topicId}-${difficulty}`;
    let generatedQuestions = progress.mathSets[mathSetId];
    if (!Array.isArray(generatedQuestions) || generatedQuestions.length < ROUND_SIZE) {
      generatedQuestions = generateMathQuestions(difficulty).map(question => ({
        ...question,
        id: `${subjectId}-${grade}-${topicId}-${difficulty}-${question.id}`,
      }));
      progress.mathSets[mathSetId] = generatedQuestions;
      saveProgress(progress);
    }
    prepared = [...questions, ...generatedQuestions];
  }
  return selectRound(prepared, difficulty);
}

export function getPreparedQuestionPool(subjectId = 'geral') {
  const subjectIds = subjectId === 'geral'
    ? Object.keys(curriculum)
    : [subjectId];

  return subjectIds.flatMap(id => (
    (curriculum[id]?.['9'] || []).flatMap(topic => (
      getPreparedQuestions(id, '9', topic.id)
    ))
  ));
}

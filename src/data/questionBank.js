import { curriculum } from './curriculum.js';
import { mockQuestions } from './questions.js';
import { preparedQuestionAdditions } from './preparedQuestionAdditions.js';
import { topicQuestionAdditions } from './topicQuestionAdditions.js';
import { levelQuestionAdditions } from './levelQuestionAdditions.js';
import { questions9ano } from './questions9ano.js';

const QUESTION_PROGRESS_KEY = 'gamificaEduQuestionProgress';
// Cada conta tem seu próprio progresso, mesmo usando o mesmo aparelho
let progressStorageKey = QUESTION_PROGRESS_KEY;

export function setQuestionProgressUser(uid) {
  progressStorageKey = uid ? `${QUESTION_PROGRESS_KEY}:${uid}` : QUESTION_PROGRESS_KEY;
}
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

const PYTHAGOREAN_TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37], [11, 60, 61]];

function formatSignedTerm(value, suffix) {
  if (value === 0) return '';
  const coefficient = Math.abs(value) === 1 && suffix ? '' : Math.abs(value);
  return `${value < 0 ? ' - ' : ' + '}${coefficient}${suffix}`;
}

function pickTriple(level) {
  const triples = level === 'fácil'
    ? PYTHAGOREAN_TRIPLES.slice(0, 2)
    : level === 'médio' ? PYTHAGOREAN_TRIPLES.slice(0, 4) : PYTHAGOREAN_TRIPLES;
  const [baseA, baseB, baseC] = triples[randomInt(0, triples.length - 1)];
  const scale = randomInt(1, level === 'fácil' ? 12 : level === 'médio' ? 15 : 20);
  return [baseA * scale, baseB * scale, baseC * scale];
}

function generatePythagoras(level) {
  const [a, b, c] = pickTriple(level);
  return createQuestion({
    id: `pythagoras-${a}-${b}`,
    nivel: level,
    pergunta: `Um triângulo retângulo tem catetos de ${a} cm e ${b} cm. Qual é a medida da hipotenusa?`,
    answer: `${c} cm`,
    distractors: [`${a + b} cm`, `${Math.abs(b - a)} cm`, `${c + 1} cm`],
    explicacao: `Pelo Teorema de Pitágoras, c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}. Portanto, c = √${c * c} = ${c} cm.`,
  });
}

function generateMissingLeg(level) {
  const [a, b, c] = pickTriple(level);
  return createQuestion({
    id: `missing-leg-${a}-${c}`,
    nivel: level,
    pergunta: `Em um triângulo retângulo, a hipotenusa mede ${c} m e um dos catetos mede ${a} m. Quanto mede o outro cateto?`,
    answer: `${b} m`,
    distractors: [`${c - a} m`, `${c + a} m`, `${b + 2} m`],
    explicacao: `b² = c² − a² = ${c * c} − ${a * a} = ${b * b}. Logo, b = ${b} m.`,
  });
}

function generateTrigRatio(level) {
  const [a, b, c] = pickTriple(level);
  const ratios = [
    { name: 'seno', value: `${a}/${c}`, wrong: [`${b}/${c}`, `${a}/${b}`, `${c}/${a}`], rule: 'cateto oposto ÷ hipotenusa' },
    { name: 'cosseno', value: `${b}/${c}`, wrong: [`${a}/${c}`, `${b}/${a}`, `${c}/${b}`], rule: 'cateto adjacente ÷ hipotenusa' },
    { name: 'tangente', value: `${a}/${b}`, wrong: [`${b}/${a}`, `${a}/${c}`, `${b}/${c}`], rule: 'cateto oposto ÷ cateto adjacente' },
  ];
  const ratio = ratios[randomInt(0, level === 'fácil' ? 0 : 2)];
  return createQuestion({
    id: `trig-${ratio.name}-${a}-${b}`,
    nivel: level,
    pergunta: `Em um triângulo retângulo, o ângulo α tem cateto oposto ${a}, cateto adjacente ${b} e hipotenusa ${c}. Qual é o ${ratio.name} de α?`,
    answer: ratio.value,
    distractors: ratio.wrong,
    explicacao: `O ${ratio.name} é ${ratio.rule}, ou seja, ${ratio.value}.`,
  });
}

function generatePercentage(level) {
  const base = level === 'fácil' ? randomInt(2, 20) * 10
    : level === 'médio' ? randomInt(12, 80) * 10
      : randomInt(30, 200) * 10;
  const percentage = [5, 10, 15, 20, 25, 30, 40, 60, 75][randomInt(0, 8)];
  const answer = base * percentage / 100;
  return createQuestion({
    id: `percentage-${base}-${percentage}`,
    nivel: level,
    pergunta: `Em uma pesquisa com ${formatNumber(base)} estudantes, ${percentage}% escolheram futebol. Quantos estudantes escolheram futebol?`,
    answer: formatNumber(answer),
    distractors: [
      formatNumber(base * percentage / 10),
      formatNumber(base - answer),
      formatNumber(answer + percentage),
    ],
    explicacao: `${percentage}% de ${formatNumber(base)} = ${formatNumber(base)} × ${percentage}/100 = ${formatNumber(answer)}.`,
  });
}

function generateMean(level) {
  const size = level === 'fácil' ? 3 : level === 'médio' ? 4 : 5;
  const max = level === 'fácil' ? 10 : level === 'médio' ? 20 : 50;
  const values = Array.from({ length: size }, () => randomInt(1, max));
  const remainder = values.reduce((sum, value) => sum + value, 0) % size;
  if (remainder) values[0] += size - remainder;
  const total = values.reduce((sum, value) => sum + value, 0);
  const mean = total / size;
  return createQuestion({
    id: `mean-${values.join('-')}`,
    nivel: level,
    pergunta: `Qual é a média aritmética dos valores ${values.join(', ')}?`,
    answer: mean,
    distractors: [total, mean + 1, mean - 1],
    explicacao: `Some os valores (${values.join(' + ')} = ${total}) e divida pela quantidade (${size}): ${total} ÷ ${size} = ${mean}.`,
  });
}

function generateMedian(level) {
  const size = level === 'fácil' ? 5 : level === 'médio' ? 7 : 6;
  const max = level === 'fácil' ? 20 : 60;
  const values = Array.from({ length: size }, () => randomInt(1, max));
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(size / 2);
  const median = size % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  return createQuestion({
    id: `median-${values.join('-')}`,
    nivel: level,
    pergunta: `Qual é a mediana do conjunto de dados ${values.join(', ')}?`,
    answer: formatNumber(median),
    distractors: [formatNumber(values[middle]), formatNumber(sorted[0] + sorted[size - 1]), formatNumber(median + 2)],
    explicacao: `Em ordem crescente: ${sorted.join(', ')}. ${size % 2
      ? `O termo central é ${median}.`
      : `A mediana é a média dos dois termos centrais: (${sorted[middle - 1]} + ${sorted[middle]}) ÷ 2 = ${formatNumber(median)}.`}`,
  });
}

function generateProbability(level) {
  const red = randomInt(1, level === 'fácil' ? 6 : 15);
  const blue = randomInt(1, level === 'fácil' ? 6 : 15);
  const green = level === 'fácil' ? 0 : randomInt(1, 12);
  const total = red + blue + green;
  const colors = green
    ? `${red} bolas vermelhas, ${blue} azuis e ${green} verdes`
    : `${red} bolas vermelhas e ${blue} azuis`;
  return createQuestion({
    id: `probability-${red}-${blue}-${green}`,
    nivel: level,
    pergunta: `Uma urna tem ${colors}. Sorteando uma bola ao acaso, qual é a probabilidade de ela ser vermelha?`,
    answer: `${red}/${total}`,
    distractors: [`${blue}/${total}`, `${red}/${total + 1}`, `1/${total}`],
    explicacao: `Probabilidade = casos favoráveis ÷ casos possíveis = ${red}/${total}.`,
  });
}

function generateFunction(level) {
  const a = randomInt(2, level === 'fácil' ? 5 : level === 'médio' ? 9 : 12);
  const b = randomInt(-10, 15);
  const x = randomInt(level === 'difícil' ? -8 : 2, level === 'fácil' ? 6 : 12);
  const answer = a * x + b;
  const signedB = formatSignedTerm(b, '');
  return createQuestion({
    id: `function-${a}-${b}-${x}`,
    nivel: level,
    pergunta: `Se f(x) = ${a}x${signedB}, quanto vale f(${x})?`,
    answer,
    distractors: [a * x, a + x + b, a * (x + b)],
    explicacao: `Substitua x por ${x}: f(${x}) = ${a} × (${x})${signedB} = ${a * x}${signedB} = ${answer}.`,
  });
}

function generateFunctionZero(level) {
  const sign = level === 'difícil' && randomInt(0, 1) ? -1 : 1;
  const a = randomInt(2, level === 'fácil' ? 5 : 10) * sign;
  const root = randomInt(-9, 12);
  const b = -a * root;
  return createQuestion({
    id: `function-zero-${a}-${b}`,
    nivel: level,
    pergunta: `Qual é o zero (raiz) da função f(x) = ${a}x${formatSignedTerm(b, '')}?`,
    answer: `x = ${root}`,
    distractors: [`x = ${-root || 1}`, `x = ${b}`, `x = ${root + 1}`],
    explicacao: `Faça f(x) = 0: ${a}x${formatSignedTerm(b, '')} = 0 ⇒ x = ${-b}/${a} = ${root}.`,
  });
}

function generateQuadraticValue(level) {
  const a = randomInt(1, level === 'fácil' ? 2 : 4);
  const b = randomInt(-6, 6);
  const c = randomInt(-10, 10);
  const x = randomInt(level === 'fácil' ? 1 : -5, 5);
  const answer = a * x * x + b * x + c;
  const expression = `${a === 1 ? '' : a}x²${formatSignedTerm(b, 'x')}${formatSignedTerm(c, '')}`;
  return createQuestion({
    id: `quadratic-value-${a}-${b}-${c}-${x}`,
    nivel: level,
    pergunta: `Dada a função quadrática f(x) = ${expression}, quanto vale f(${x})?`,
    answer,
    distractors: [answer + 3, 2 * a * x + b * x + c, answer - 2],
    explicacao: `f(${x}) = ${a}·(${x})² + (${b})·(${x}) + (${c}) = ${a * x * x} + (${b * x}) + (${c}) = ${answer}.`,
  });
}

function generatePower(level) {
  const base = randomInt(2, level === 'fácil' ? 6 : level === 'médio' ? 9 : 12);
  const exponent = randomInt(2, level === 'fácil' ? 3 : 4);
  const answer = base ** exponent;
  return createQuestion({
    id: `power-${base}-${exponent}`,
    nivel: level,
    pergunta: `Qual é o valor de ${base}^${exponent}?`,
    answer,
    distractors: [base * exponent, base ** (exponent - 1), answer + base],
    explicacao: `${base}^${exponent} significa multiplicar ${base} por si mesmo ${exponent} vezes: ${Array(exponent).fill(base).join(' × ')} = ${answer}.`,
  });
}

function generateSquareRoot(level) {
  const root = randomInt(2, level === 'fácil' ? 12 : level === 'médio' ? 20 : 35);
  const index = level === 'difícil' && root <= 12 ? 3 : 2;
  const radicand = root ** index;
  const symbol = index === 3 ? '∛' : '√';
  return createQuestion({
    id: `root-${index}-${radicand}`,
    nivel: level,
    pergunta: `Qual é o valor de ${symbol}${radicand}?`,
    answer: root,
    distractors: [formatNumber(radicand / index), root + 1, root * index],
    explicacao: `${root}${index === 3 ? '³' : '²'} = ${radicand}, então ${symbol}${radicand} = ${root}.`,
  });
}

function generateFractionalExponent(level) {
  const root = randomInt(2, level === 'difícil' ? 6 : 4);
  const index = randomInt(2, 3);
  const numerator = level === 'fácil' ? 1 : randomInt(1, 3);
  const base = root ** index;
  const answer = root ** numerator;
  return createQuestion({
    id: `fractional-exponent-${base}-${numerator}-${index}`,
    nivel: level,
    pergunta: `Qual é o valor de ${base}^(${numerator}/${index})?`,
    answer,
    distractors: [formatNumber(base * numerator / index), answer + 1, answer + root],
    explicacao: `${base}^(${numerator}/${index}) = (${index === 2 ? '√' : '∛'}${base})^${numerator} = ${root}^${numerator} = ${answer}.`,
  });
}

function generatePowerProperties(level) {
  const base = randomInt(2, level === 'fácil' ? 5 : 10);
  const m = randomInt(2, level === 'fácil' ? 6 : 12);
  const n = randomInt(2, level === 'fácil' ? 6 : 12);
  const isDivision = level !== 'fácil' && randomInt(0, 1) === 1 && m !== n;
  const [high, low] = [Math.max(m, n), Math.min(m, n)];
  const pergunta = isDivision
    ? `Escrevendo como uma única potência, quanto é ${base}^${high} ÷ ${base}^${low}?`
    : `Escrevendo como uma única potência, quanto é ${base}^${m} · ${base}^${n}?`;
  const answer = isDivision ? `${base}^${high - low}` : `${base}^${m + n}`;
  return createQuestion({
    id: `power-property-${isDivision ? 'div' : 'mul'}-${base}-${isDivision ? `${high}-${low}` : `${m}-${n}`}`,
    nivel: level,
    pergunta,
    answer,
    distractors: isDivision
      ? [`${base}^${Math.round(high / low * 10) / 10}`, `${base}^${high + low}`, `1^${high - low}`]
      : [`${base}^${m * n}`, `${base * 2}^${m + n}`, `${base ** 2}^${m * n}`],
    explicacao: isDivision
      ? `Na divisão de potências de mesma base, conserva-se a base e subtraem-se os expoentes: ${high} − ${low} = ${high - low}.`
      : `Na multiplicação de potências de mesma base, conserva-se a base e somam-se os expoentes: ${m} + ${n} = ${m + n}.`,
  });
}

function generateNegativeExponent(level) {
  const base = randomInt(2, level === 'difícil' ? 10 : 5);
  const exponent = randomInt(1, level === 'fácil' ? 2 : 4);
  const value = base ** exponent;
  return createQuestion({
    id: `negative-exponent-${base}-${exponent}`,
    nivel: level,
    pergunta: `Qual é o valor de ${base}^(−${exponent})?`,
    answer: `1/${value}`,
    distractors: [`−${value}`, `${-base * exponent}`, `${value}`],
    explicacao: `Expoente negativo inverte a base: ${base}^(−${exponent}) = 1/${base}^${exponent} = 1/${value}.`,
  });
}

function generateSimplifyRadical(level) {
  const outside = randomInt(2, level === 'fácil' ? 5 : 10);
  const inside = [2, 3, 5, 6, 7, 10, 11][randomInt(0, level === 'fácil' ? 2 : 6)];
  const radicand = outside * outside * inside;
  return createQuestion({
    id: `simplify-radical-${radicand}`,
    nivel: level,
    pergunta: `Simplificando o radical √${radicand}, obtemos:`,
    answer: `${outside}√${inside}`,
    distractors: [`${inside}√${outside}`, `${outside * outside}√${inside}`, `${outside}√${inside * outside}`],
    explicacao: `√${radicand} = √(${outside * outside} · ${inside}) = √${outside * outside} · √${inside} = ${outside}√${inside}.`,
  });
}

function generateQuadraticRoots(level) {
  const max = level === 'fácil' ? 6 : level === 'médio' ? 10 : 15;
  const min = level === 'fácil' ? 1 : -max;
  const r1 = randomInt(min, max);
  let r2 = randomInt(min, max);
  if (r2 === r1) r2 += 1;
  const low = Math.min(r1, r2);
  const high = Math.max(r1, r2);
  const sum = low + high;
  const product = low * high;
  return createQuestion({
    id: `quadratic-roots-${low}-${high}`,
    nivel: level,
    pergunta: `Quais são as raízes da equação x²${formatSignedTerm(-sum, 'x')}${formatSignedTerm(product, '')} = 0?`,
    answer: `${low} e ${high}`,
    distractors: [`${-high} e ${-low}`, `${low} e ${-high}`, `${sum} e ${product}`],
    explicacao: `A soma das raízes é ${sum} e o produto é ${product}. Os números ${low} e ${high} satisfazem as duas condições (confira com Bhaskara).`,
  });
}

function generateDiscriminant(level) {
  const a = randomInt(1, level === 'fácil' ? 2 : 5);
  const b = randomInt(-10, 10);
  const c = randomInt(-10, 10);
  const delta = b * b - 4 * a * c;
  const equation = `${a === 1 ? '' : a}x²${formatSignedTerm(b, 'x')}${formatSignedTerm(c, '')} = 0`;
  const deltaSteps = `Δ = b² − 4ac = (${b})² − 4·${a}·(${c}) = ${b * b} − (${4 * a * c}) = ${delta}.`;
  if (level === 'difícil') {
    const kinds = ['Duas raízes reais distintas', 'Duas raízes reais iguais', 'Nenhuma raiz real', 'Infinitas raízes reais'];
    const answer = delta > 0 ? kinds[0] : delta === 0 ? kinds[1] : kinds[2];
    return createQuestion({
      id: `discriminant-kind-${a}-${b}-${c}`,
      nivel: level,
      pergunta: `Sem resolver a equação ${equation}, o que o valor de Δ indica sobre suas raízes?`,
      answer,
      distractors: kinds.filter(option => option !== answer),
      explicacao: `${deltaSteps} ${delta > 0 ? 'Δ > 0: duas raízes reais distintas.' : delta === 0 ? 'Δ = 0: duas raízes reais iguais.' : 'Δ < 0: não há raízes reais.'}`,
    });
  }
  return createQuestion({
    id: `discriminant-${a}-${b}-${c}`,
    nivel: level,
    pergunta: `Qual é o valor do discriminante (Δ) da equação ${equation}?`,
    answer: delta,
    distractors: [b * b + 4 * a * c, b - 4 * a * c, delta + 4],
    explicacao: deltaSteps,
  });
}

const MATH_GENERATORS_BY_TOPIC = {
  radicais_potencias: [generatePower, generateSquareRoot, generateFractionalExponent, generatePowerProperties, generateNegativeExponent, generateSimplifyRadical],
  equacoes_2grau: [generateQuadraticRoots, generateDiscriminant],
  funcoes: [generateFunction, generateFunctionZero, generateQuadraticValue],
  teorema_pitagoras: [generatePythagoras, generateMissingLeg, generateTrigRatio],
  estatistica: [generateMean, generateMedian, generateProbability, generatePercentage],
};

// Gera questões inéditas do tópico: nunca devolve uma pergunta já respondida
function generateMathQuestions({ subjectId, grade, topicId, difficulty, answered, count }) {
  const generators = MATH_GENERATORS_BY_TOPIC[topicId];
  if (!generators || count <= 0) return [];
  const levels = difficulty === 'misturado' ? DIFFICULTIES : [difficulty];
  const questions = [];
  const questionIds = new Set();
  let attempts = 0;

  while (questions.length < count && attempts < count * 80) {
    const generator = generators[randomInt(0, generators.length - 1)];
    const level = levels[randomInt(0, levels.length - 1)];
    attempts += 1;
    const question = generator(level);
    const id = `${subjectId}-${grade}-${topicId}-gen-${question.id}`;
    if (questionIds.has(id) || answered.has(id)) continue;
    questionIds.add(id);
    questions.push({ ...question, id });
  }
  return questions;
}

function readProgress() {
  try {
    const stored = localStorage.getItem(progressStorageKey);
    if (!stored) return { answered: [], wrong: [] };
    const parsed = JSON.parse(stored);
    return {
      answered: Array.isArray(parsed.answered) ? parsed.answered : [],
      wrong: Array.isArray(parsed.wrong) ? parsed.wrong : [],
    };
  } catch (error) {
    console.error('Não foi possível ler o progresso das questões salvo no navegador.', error);
    return { answered: [], wrong: [] };
  }
}

function saveProgress(progress) {
  // O armazenamento local pode estar bloqueado (aba anônima); o perfil no Firestore continua valendo
  try {
    localStorage.setItem(progressStorageKey, JSON.stringify(progress));
  } catch (error) {
    console.error('Não foi possível salvar o progresso das questões no navegador.', error);
  }
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
  });
}

// Junta as perguntas respondidas salvas no perfil (Firestore) ao progresso local
export function mergeAnsweredQuestions(questionIds) {
  if (!Array.isArray(questionIds) || questionIds.length === 0) return;
  const progress = readProgress();
  const answered = new Set(progress.answered);
  const sizeBefore = answered.size;
  questionIds.forEach(questionId => answered.add(questionId));
  if (answered.size === sizeBefore) return;
  saveProgress({ ...progress, answered: [...answered] });
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
  const levelAdditions = gradeKey === '9'
    ? levelQuestionAdditions[subjectId]?.['9']?.[topicId] || []
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
    ...levelAdditions,
  ].map((question, index) => (
    normalizeQuestion(question, subjectId, gradeKey, topicId, index)
  ));
  const seenQuestions = new Set();
  return normalized.filter(question => {
    // Enunciados genéricos ("Assinale a frase correta:") só são repetidos se a resposta também for igual
    const normalizedText = `${question.pergunta}|${question.opcoes[question.correta]}`.trim().toLocaleLowerCase();
    if (seenQuestions.has(normalizedText)) return false;
    seenQuestions.add(normalizedText);
    return true;
  });
}

export function createQuestionRound({ questions, subjectId, grade, topicId, difficulty }) {
  let prepared = questions;
  if (subjectId === 'matematica') {
    const answered = new Set(readProgress().answered);
    const unseenPrepared = questions.filter(question => (
      !answered.has(question.id)
      && (difficulty === 'misturado' || question.nivel === difficulty)
    )).length;
    const generatedQuestions = generateMathQuestions({
      subjectId,
      grade,
      topicId,
      difficulty,
      answered,
      count: ROUND_SIZE - unseenPrepared,
    });
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

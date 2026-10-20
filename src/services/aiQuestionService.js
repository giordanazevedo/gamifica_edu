import { getToken } from 'firebase/app-check';
import { getAI, getGenerativeModel, GoogleAIBackend, SchemaType } from 'firebase/ai';
import { curriculum } from '../data/curriculum';
import app, { appCheck } from '../firebase';

const topicQuestionRequests = new Map();
const SUBJECT_LABELS = {
  portugues: 'Português',
  matematica: 'Matemática',
  ciencias: 'Ciências',
  historia: 'História',
  geografia: 'Geografia',
  ingles: 'Inglês',
  arte: 'Arte',
  ed_fisica: 'Educação Física',
  religiao: 'Ensino Religioso',
};
const SUBJECT_LEARNING_OBJECTIVES = {
  portugues: 'Multimodalidade e publicidade; entrevistas, oralidade e tomada de notas; argumentação, debate e reivindicação; resenhas, paráfrases, citações e avaliação de fontes; modalização; textos dramáticos, poesia visual e figuras de linguagem.',
  matematica: 'Números reais e irracionais; potências com expoentes inteiros e fracionários, radicais e notação científica; porcentagens e juros; funções, razões e proporcionalidade direta e inversa; fatoração e equações do segundo grau; ângulos, circunferências, semelhança de triângulos e Teorema de Pitágoras; plano cartesiano, polígonos, vistas espaciais e volumes; probabilidade, estatística, gráficos e pesquisas amostrais.',
  ciencias: 'Estados físicos da matéria e calor; modelos atômicos, tabela periódica, ligações e transformações químicas; luz, cores, ondas, som e radiações; comunicação e aplicações médicas das radiações; gametas, DNA, cromossomos, hereditariedade, leis de Mendel, evolução e seleção natural; conservação da biodiversidade; Sistema Solar, constelações e evolução estelar.',
  historia: 'República no Brasil, população negra e afro-brasileira, Primeira República, Era Vargas, guerras mundiais, Revolução Russa, colonialismo e descolonização da África e da Ásia; Brasil após 1946, era JK, ditadura militar e redemocratização; Constituição de 1988, direitos, protagonismo de grupos sociais e Guerra Fria.',
  geografia: 'Europa, Ásia e Oceania; hegemonia e intercâmbios culturais; globalização e organismos internacionais; população, desigualdades, urbanização, industrialização e trabalho; cadeias produtivas, recursos naturais e fontes de energia; mapas temáticos, projeções e leitura de dados; diversidade ambiental, paisagens e sustentabilidade.',
  ingles: 'Persuasão e argumentação em textos orais, escritos e multimodais; distinção entre fatos e opiniões; produção de argumentos; gêneros digitais e segurança; conectores de adição, condição, contraste e conclusão; condicionais dos tipos 1 e 2; verbos modais should, must, have to, may e might; inglês como língua de comunicação internacional.',
  arte: 'Artes visuais contemporâneas e seus elementos; contextos de produção e circulação e profissionais da arte; dança contemporânea e regional, movimento, ritmo e coreografia; música local, brasileira e contemporânea, apreciação, composição e registro; teatro contemporâneo, dramaturgia, criação e encenação.',
  ed_fisica: 'Esportes de rede e parede, campo e taco, invasão e combate; regras, fundamentos, táticas e cooperação; história e ética esportiva; ginástica de condicionamento e conscientização corporal; danças de salão e diversidade cultural; lutas do mundo; práticas corporais de aventura, segurança, riscos e preservação ambiental.',
  religiao: 'Diferentes ideias de imortalidade nas tradições religiosas; convivência, respeito à vida e dignidade humana; princípios e valores éticos familiares, religiosos e culturais; elaboração de projetos de vida com respeito às diferentes crenças.',
};

const ai = getAI(app, { backend: new GoogleAIBackend() });
const questionModel = getGenerativeModel(ai, {
  model: 'gemini-3.8-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        questions: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              question: { type: SchemaType.STRING },
              options: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                minItems: 4,
                maxItems: 4,
              },
              answerIndex: { type: SchemaType.INTEGER },
              explanation: { type: SchemaType.STRING },
            },
            required: ['question', 'options', 'answerIndex', 'explanation'],
          },
        },
      },
      required: ['questions'],
    },
  },
});
const explanationModel = getGenerativeModel(ai, {
  model: 'gemini-3.8-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING },
        sections: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              heading: { type: SchemaType.STRING },
              content: { type: SchemaType.STRING },
            },
            required: ['heading', 'content'],
          },
        },
        example: { type: SchemaType.STRING },
      },
      required: ['title', 'sections', 'example'],
    },
  },
});

export async function generateCustomQuestions({ subject, topic, difficulty, count }) {
  const cleanTopic = validateTopic(topic);
  const allowedCounts = [5, 10];
  if (!allowedCounts.includes(count)) {
    throw new Error('Escolha 5 ou 10 perguntas.');
  }

  return generateQuestionsFromCurriculum({ subject, topic: cleanTopic, difficulty, count });
}

export function generateTopicQuestions({ subject, topic, count = 15, difficulty = 'Média', excludeQuestions = [] }) {
  const cleanTopic = validateTopic(topic);
  const source = resolveSubjectCurriculum(subject);
  const exclusionKey = excludeQuestions.join('|');
  const cacheKey = `${source.key}:${cleanTopic}:${difficulty}:${count}:${exclusionKey}`;
  if (topicQuestionRequests.has(cacheKey)) return topicQuestionRequests.get(cacheKey);

  const request = generateQuestionsFromCurriculum({
    subject,
    topic: cleanTopic,
    difficulty,
    count,
    excludeQuestions,
  });
  topicQuestionRequests.set(cacheKey, request);
  request.then(
    () => {
      if (topicQuestionRequests.get(cacheKey) === request) topicQuestionRequests.delete(cacheKey);
    },
    () => {
      if (topicQuestionRequests.get(cacheKey) === request) topicQuestionRequests.delete(cacheKey);
    }
  );
  return request;
}

async function generateQuestionsFromCurriculum({ subject, topic, difficulty, count, excludeQuestions = [] }) {
  const cleanTopic = validateTopic(topic);
  const source = resolveSubjectCurriculum(subject);
  const prompt = [
    'Você é um professor cuidadoso que cria questões educativas em português do Brasil.',
    'Use os objetivos curriculares resumidos abaixo como referência para o conteúdo do 9º ano.',
    'Crie perguntas originais alinhadas ao currículo, sem citar nem reproduzir literalmente o documento de referência.',
    'Crie questões para estudantes do 9º ano, com conteúdo correto, claro e apropriado para a idade.',
    `Matéria: ${source.label}.`,
    `Conteúdos e habilidades previstos: ${source.learningObjectives}.`,
    `Tema escolhido: ${cleanTopic}.`,
    `Dificuldade: ${difficulty}.`,
    `Crie exatamente ${count} questões de múltipla escolha, cada uma com quatro alternativas.`,
    'Cada questão deve ter somente uma alternativa correta; as outras devem ser plausíveis, mas claramente incorretas.',
    'Distribua as respostas corretas entre as posições 0, 1, 2 e 3.',
    'Inclua uma explicação breve que ajude a entender a resposta correta.',
    'Se o tema não tiver relação com os conteúdos curriculares da matéria, retorne uma lista de questões vazia em vez de inventar alinhamento curricular.',
    ...(excludeQuestions.length ? [
      'Não repita perguntas nem cobre o mesmo fato ou exemplo já usado anteriormente nesta partida.',
      `Perguntas anteriores: ${excludeQuestions.join(' | ')}`,
    ] : []),
    'Não inclua introdução, markdown ou texto fora do JSON solicitado.',
  ].join('\n');

  const result = await generateWithAppCheckRetry(questionModel, prompt);

  const responseText = result.response.text();
  let parsed;

  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new Error('A IA retornou questões em um formato inválido. Tente gerar novamente.');
  }

  if (!Array.isArray(parsed?.questions)) {
    throw new Error('A IA não retornou a quantidade solicitada de questões. Tente novamente.');
  }
  if (parsed.questions.length === 0) {
    throw new Error('Esse tema não aparece nos conteúdos do 9º ano desta disciplina. Tente outro tema da trilha.');
  }
  if (parsed.questions.length !== count) {
    throw new Error('A IA não retornou a quantidade solicitada de questões. Tente novamente.');
  }

  const questions = parsed.questions.map((question, index) => {
    const options = question?.options;
    if (
      typeof question?.question !== 'string'
      || !question.question.trim()
      || !Array.isArray(options)
      || options.length !== 4
      || options.some(option => typeof option !== 'string' || !option.trim())
      || !Number.isInteger(question.answerIndex)
      || question.answerIndex < 0
      || question.answerIndex > 3
      || typeof question.explanation !== 'string'
      || !question.explanation.trim()
    ) {
      throw new Error(`A questão ${index + 1} veio incompleta. Gere as questões novamente.`);
    }

    return {
      question: question.question.trim(),
      options: options.map(option => option.trim()),
      correct: question.answerIndex,
      explanation: question.explanation.trim(),
    };
  });

  return questions;
}

export async function generateContentExplanation({ subject, topic }) {
  const cleanTopic = validateTopic(topic);
  const source = resolveSubjectCurriculum(subject);
  const prompt = [
    'Você é um professor cuidadoso que explica conteúdos educativos em português do Brasil.',
    'Explique o assunto para estudantes do 9º ano, com linguagem clara e apropriada para a idade.',
    'Use os objetivos curriculares resumidos abaixo como referência para o conteúdo do 9º ano. Não cite nem reproduza literalmente o documento de referência.',
    `Conteúdos e habilidades previstos: ${source.learningObjectives}.`,
    'Se os objetivos curriculares resumidos não abordarem o conteúdo solicitado, informe isso claramente e oriente o estudante a escolher um tema do 9º ano.',
    `Matéria relacionada: ${source.label}.`,
    `Conteúdo solicitado: ${cleanTopic}.`,
    'Organize a explicação em 3 ou 4 partes curtas, com conceitos corretos e exemplos quando forem úteis.',
    'Inclua um exemplo prático simples ao final. Mantenha a explicação dentro dos objetivos curriculares do 9º ano.',
    'Retorne somente o JSON no formato solicitado, sem markdown ou texto fora do JSON.',
  ].join('\n');

  const result = await generateWithAppCheckRetry(explanationModel, prompt);
  let parsed;

  try {
    parsed = JSON.parse(result.response.text());
  } catch {
    throw new Error('A IA retornou a explicação em um formato inválido. Tente novamente.');
  }

  if (
    typeof parsed?.title !== 'string'
    || !parsed.title.trim()
    || !Array.isArray(parsed.sections)
    || parsed.sections.length < 2
    || parsed.sections.some(section => (
      typeof section?.heading !== 'string'
      || !section.heading.trim()
      || typeof section?.content !== 'string'
      || !section.content.trim()
    ))
    || typeof parsed.example !== 'string'
    || !parsed.example.trim()
  ) {
    throw new Error('A explicação veio incompleta. Tente gerar novamente.');
  }

  return {
    title: parsed.title.trim(),
    sections: parsed.sections.map(section => ({
      heading: section.heading.trim(),
      content: section.content.trim(),
    })),
    example: parsed.example.trim(),
  };
}

function resolveSubjectCurriculum(subject) {
  const rawSubject = typeof subject === 'string'
    ? subject
    : subject?.id || subject?.name || '';
  const normalizedSubject = rawSubject
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  const aliases = {
    'lingua_portuguesa': 'portugues',
    'educacao_fisica': 'ed_fisica',
    'ensino_religioso': 'religiao',
  };
  const key = aliases[normalizedSubject] || normalizedSubject;
  const subjectTopics = curriculum[key]?.['9'];
  const learningObjectives = SUBJECT_LEARNING_OBJECTIVES[key];
  if (!subjectTopics || !learningObjectives) {
    throw new Error('Não encontrei os conteúdos do 9º ano para essa matéria.');
  }
  return {
    key,
    label: SUBJECT_LABELS[key],
    learningObjectives,
  };
}

function validateTopic(topic) {
  const cleanTopic = typeof topic === 'string' ? topic.trim() : '';
  if (!cleanTopic || cleanTopic.length > 100) {
    throw new Error('Informe um tema com até 100 caracteres.');
  }
  return cleanTopic;
}

async function generateWithAppCheckRetry(model, prompt) {
  try {
    return await model.generateContent(prompt);
  } catch (error) {
    if (!isInvalidAppCheckToken(error)) throw error;

    try {
      await getToken(appCheck, true);
      return await model.generateContent(prompt);
    } catch (retryError) {
      if (isInvalidAppCheckToken(retryError)) {
        throw new Error(
          'O Firebase ainda está rejeitando o token do App Check. Confira se o app Web está registrado com a mesma chave reCAPTCHA Enterprise e se o domínio gamifica-edu.web.app está autorizado.'
        );
      }
      throw retryError;
    }
  }
}

function isInvalidAppCheckToken(error) {
  return typeof error?.message === 'string'
    && error.message.toLowerCase().includes('app check token is invalid');
}

export function getQuestionGenerationError(error) {
  const code = typeof error?.code === 'string' ? error.code : '';
  if (code.includes('api-not-enabled') || code.includes('API_NOT_ENABLED')) {
    return 'Ative o Firebase AI Logic no Console do Firebase e selecione a API Gemini Developer para este projeto.';
  }
  if (code.toLowerCase().includes('app-check')) {
    return 'A proteção App Check do Firebase AI Logic precisa ser configurada para este app no Console do Firebase.';
  }
  if (error instanceof Error && error.message) return error.message;
  return 'Não foi possível gerar as questões. Verifique a configuração de IA no Firebase e tente novamente.';
}

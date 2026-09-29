export const mockQuestions = {
  portugues: {
    '9': {
      'resenha_ensaio': [
        { id: 1, question: "O editorial de um jornal ou revista é um gênero textual que tem como característica principal:", options: ["Relatar os fatos esportivos do dia de forma imparcial.", "Expressar o ponto de vista da empresa jornalística sobre um assunto atual.", "Descrever paisagens e fatos cotidianos sem argumentação.", "Contar a história de heróis mitológicos."], correct: 1 },
        { id: 2, question: "Em um debate regrado, a atitude mais adequada para construir uma boa argumentação é:", options: ["Falar mais alto que o oponente para ser ouvido.", "Desqualificar as opiniões adversárias com ataques pessoais.", "Ouvir com atenção e contra-argumentar usando dados e lógica.", "Mudar o foco do assunto quando for questionado."], correct: 2 },
        { id: 3, question: "A resenha crítica diferencia-se de um simples resumo porque:", options: ["Apenas enumera os capítulos de um livro.", "Apresenta um juízo de valor e a opinião fundamentada do autor sobre a obra.", "Sempre discorda do autor da obra original.", "Deve obrigatoriamente ser escrita em versos."], correct: 1 }
      ],
      'oracoes_subordinadas': [
        { id: 1, question: "Na frase 'É necessário que todos prestem atenção', a oração sublinhada ('que todos prestem atenção') exerce a função de:", options: ["Sujeito (Oração Subordinada Substantiva Subjetiva)", "Objeto Direto (Oração Subordinada Substantiva Objetiva Direta)", "Adjunto Adverbial", "Predicativo do Sujeito"], correct: 0 },
        { id: 2, question: "Assinale a alternativa em que há uma oração subordinada adjetiva restritiva:", options: ["O aluno, que estudou muito, passou no exame.", "O aluno que estudou muito passou no exame.", "Foi comprovado que a leitura melhora a escrita.", "Como choveu muito, o jogo foi cancelado."], correct: 1 }
      ],
      'figuras_pensamento': [
        { id: 1, question: "A figura de linguagem presente na frase 'Que belo comportamento: quebrou o vidro da janela e escondeu a bola!' é a:", options: ["Metáfora", "Ironia", "Eufemismo", "Antítese"], correct: 1 },
        { id: 2, question: "Quando dizemos 'Ele descansou em paz' para evitar dizer que alguém morreu, estamos usando:", options: ["Hipérbole", "Ironia", "Eufemismo", "Metonímia"], correct: 2 }
      ]
    }
  },
  matematica: {
    '9': {
      'radicais_potencias': [
        { id: 1, question: "Ao calcular o valor de 4 elevado a 3/2, obtemos:", options: ["6", "8", "12", "16"], correct: 1 },
        { id: 2, question: "A notação científica do número 0,00045 é:", options: ["45 x 10^-5", "4,5 x 10^-4", "4,5 x 10^4", "450 x 10^-6"], correct: 1 }
      ],
      'equacoes_2grau': [
        { id: 1, question: "Na equação do 2º grau x² - 5x + 6 = 0, quais são as raízes (soluções)?", options: ["2 e 3", "-2 e -3", "1 e 6", "-1 e -6"], correct: 0 },
        { id: 2, question: "A fórmula usada para encontrar as raízes de uma equação quadrática é frequentemente chamada de Fórmula de:", options: ["Tales", "Pitágoras", "Bhaskara", "Newton"], correct: 2 }
      ],
      'teorema_pitagoras': [
        { id: 1, question: "Segundo o Teorema de Pitágoras, em um triângulo retângulo, a soma dos quadrados dos catetos é igual:", options: ["Ao quadrado da hipotenusa", "A 180 graus", "Ao perímetro do triângulo", "À área do triângulo"], correct: 0 },
        { id: 2, question: "Se os catetos de um triângulo retângulo medem 6 cm e 8 cm, a hipotenusa mede:", options: ["10 cm", "12 cm", "14 cm", "100 cm"], correct: 0 }
      ],
      'estatistica': [
        { id: 1, question: "Em um conjunto de dados {2, 4, 4, 6, 8, 12}, a MEDIANA e a MODA são, respectivamente:", options: ["4 e 6", "5 e 4", "6 e 4", "4 e 4"], correct: 1 }
      ]
    }
  },
  ciencias: {
    '9': {
      'estrutura_atomica': [
        { id: 1, question: "O modelo atômico que descreve o átomo como um núcleo central denso e positivo, rodeado por elétrons em órbitas, é o de:", options: ["Dalton", "Thomson", "Rutherford", "Bohr"], correct: 2 },
        { id: 2, question: "Na Tabela Periódica atual, os elementos químicos estão organizados em ordem crescente de:", options: ["Massa atômica", "Número de nêutrons", "Número atômico (prótons)", "Tamanho do átomo"], correct: 2 }
      ],
      'fisica': [
        { id: 1, question: "A 1ª Lei de Newton também é conhecida como o Princípio da:", options: ["Ação e Reação", "Inércia", "Aceleração", "Gravidade"], correct: 1 },
        { id: 2, question: "Se um carro percorre 120 km em 2 horas, qual é a sua velocidade média?", options: ["60 km/h", "80 km/h", "100 km/h", "240 km/h"], correct: 0 }
      ],
      'genetica_evolucao': [
        { id: 1, question: "Qual molécula é a principal responsável por armazenar a informação genética nos seres vivos?", options: ["Proteína", "RNA", "DNA", "Carboidrato"], correct: 2 },
        { id: 2, question: "A teoria de que as espécies evoluem através da Seleção Natural foi proposta por:", options: ["Jean-Baptiste Lamarck", "Charles Darwin", "Gregor Mendel", "Louis Pasteur"], correct: 1 }
      ],
      'astronomia': [
        { id: 1, question: "Qual é a teoria mais aceita atualmente para a origem do Universo?", options: ["Teoria Geocêntrica", "Teoria do Big Bang", "Teoria da Geração Espontânea", "Teoria do Estado Estacionário"], correct: 1 }
      ]
    }
  },
  historia: {
    '9': {
      'brasil_republica': [
        { id: 1, question: "O período da História do Brasil conhecido como 'República Velha' (ou Primeira República) foi marcado politicamente pela:", options: ["Política do Café com Leite e coronelismo.", "Ditadura Militar e censura prévia.", "Abolição da escravidão e Guerra do Paraguai.", "Chegada da Família Real ao Brasil."], correct: 0 },
        { id: 2, question: "Durante a Era Vargas, uma das maiores transformações sociais e trabalhistas implementadas no Brasil foi a:", options: ["Criação da Constituição de 1988.", "Consolidação das Leis do Trabalho (CLT).", "Abolição das leis trabalhistas.", "Privatização da Petrobras."], correct: 1 }
      ],
      'guerras_mundiais': [
        { id: 1, question: "Um dos eventos que marcou profundamente a História no século XX e culminou na quebra da Bolsa de Valores de Nova York foi a:", options: ["Revolução Francesa", "Crise de 1929", "Queda do Muro de Berlim", "Guerra Fria"], correct: 1 },
        { id: 2, question: "Qual país retirou-se da Primeira Guerra Mundial em 1917 devido a uma revolução socialista interna?", options: ["Alemanha", "Estados Unidos", "Rússia", "Japão"], correct: 2 }
      ],
      'guerra_fria_ditaduras': [
        { id: 1, question: "A Guerra Fria (1947-1991) foi um conflito político e ideológico polarizado principalmente entre:", options: ["Brasil e Argentina", "Alemanha Nazista e os Aliados", "Estados Unidos (Capitalismo) e União Soviética (Socialismo)", "Inglaterra e França"], correct: 2 },
        { id: 2, question: "No Brasil, o período da Ditadura Militar que durou de 1964 a 1985 foi caracterizado por:", options: ["Ampla liberdade de imprensa e eleições diretas para presidente.", "Censura, repressão política e cassação de direitos.", "Criação do voto feminino e da justiça eleitoral.", "Pleno apoio de todos os estudantes e movimentos sociais da época."], correct: 1 }
      ],
      'redemocratizacao': [
        { id: 1, question: "A atual Constituição Brasileira, que reestabeleceu a democracia e garantiu amplos direitos civis e sociais, foi promulgada em:", options: ["1889", "1930", "1964", "1988"], correct: 3 }
      ]
    }
  },
  geografia: {
    '9': {
      'geopolitica': [
        { id: 1, question: "A divisão geopolítica atual frequentemente agrupa os países de acordo com seu nível de desenvolvimento econômico. Essa divisão é conhecida como:", options: ["Leste-Oeste", "Norte-Sul", "Capitalistas e Socialistas", "Países Ibéricos e Anglo-Saxões"], correct: 1 },
        { id: 2, question: "Um exemplo de bloco econômico mundial que busca a integração comercial e, em alguns casos, monetária e política é:", options: ["A ONU (Organização das Nações Unidas)", "A OTAN (Organização do Tratado do Atlântico Norte)", "A União Europeia (UE)", "O FMI (Fundo Monetário Internacional)"], correct: 2 }
      ],
      'economia_global': [
        { id: 1, question: "O processo de integração econômica, cultural, social e política mundial, impulsionado pelos avanços nos transportes e comunicações, é chamado de:", options: ["Mercantilismo", "Revolução Industrial", "Globalização", "Guerra Fria"], correct: 2 }
      ],
      'regioes_brasil': [
        { id: 1, question: "No contexto da Geografia Regional e Local do Piauí, a fronteira agrícola conhecida como MATOPIBA destaca-se fortemente pela produção de:", options: ["Café e cana-de-açúcar.", "Soja, milho e algodão no sul do estado.", "Extração de látex da seringueira.", "Pecuária leiteira intensiva."], correct: 1 },
        { id: 2, question: "Os rios Parnaíba e Poti são fundamentais para a hidrografia do Piauí. O Rio Parnaíba serve como divisa natural entre o Piauí e qual outro estado?", options: ["Ceará", "Maranhão", "Pernambuco", "Bahia"], correct: 1 }
      ]
    }
  },
  ingles: {
    '9': {
      'future_forms': [
        { id: 1, question: "Complete the sentence appropriately: 'Look at those dark clouds! It _________ rain soon.'", options: ["will", "is going to", "must", "can"], correct: 1 },
        { id: 2, question: "Which tense is used for promises, instant decisions and predictions without evidence?", options: ["Present Continuous", "Simple Past", "Future with 'will'", "Present Perfect"], correct: 2 }
      ],
      'present_perfect': [
        { id: 1, question: "Which sentence is in the Present Perfect tense?", options: ["I have visited London three times.", "I visited London last year.", "I will visit London next month.", "I am visiting London right now."], correct: 0 },
        { id: 2, question: "Choose the correct verb form: 'She has ______ her keys.'", options: ["lose", "lost", "losed", "losing"], correct: 1 }
      ],
      'conditionals': [
        { id: 1, question: "First Conditional: 'If it rains tomorrow, we ________ at home.'", options: ["stay", "will stay", "would stay", "stayed"], correct: 1 }
      ]
    }
  },
  arte: {
    '9': {
      'artes_visuais_9': [
        { id: 1, question: "O Grafite e as Instalações são expressões muito comuns de qual período/movimento artístico?", options: ["Arte Renascentista", "Arte Clássica Grega", "Arte Contemporânea (Intervenções Urbanas)", "Arte Pré-Histórica"], correct: 2 },
        { id: 2, question: "A Serra da Capivara, no Piauí, é um Patrimônio Cultural de extrema importância mundial porque abriga:", options: ["O maior acervo de arte digital do Brasil.", "As maiores e mais antigas concentrações de pinturas rupestres das Américas.", "As principais obras do movimento modernista brasileiro.", "Arquitetura colonial portuguesa intacta."], correct: 1 }
      ],
      'teatro_danca_9': [
        { id: 1, question: "Dentre as manifestações folclóricas locais valorizadas no Piauí, destaca-se:", options: ["O Bumba-meu-boi e o Reisado", "O Frevo e o Maracatu", "O Fandango e a Chula", "O Carimbó"], correct: 0 }
      ]
    }
  },
  ed_fisica: {
    '9': {
      'esportes_9': [
        { id: 1, question: "O basquetebol, o handebol e o futsal são classificados como:", options: ["Desportos de marca.", "Desportos de rede/parede.", "Desportos de combate.", "Desportos de invasão."], correct: 3 },
        { id: 2, question: "No Voleibol, qual é o número máximo de toques que uma equipe pode dar na bola antes de passá-la para a quadra adversária (sem contar o bloqueio)?", options: ["1 toque", "2 toques", "3 toques", "4 toques"], correct: 2 }
      ],
      'ginastica_9': [
        { id: 1, question: "Um dos grandes objetivos das práticas corporais, aliadas à consciência corporal, é:", options: ["Aumentar o sedentarismo.", "Melhorar a qualidade de vida, promovendo a saúde e a inclusão.", "Formar apenas atletas de alto rendimento.", "Fomentar a exclusão de pessoas menos habilidosas."], correct: 1 }
      ],
      'praticas_aventura_9': [
        { id: 1, question: "Jogos de orientação e caminhadas ecológicas são classificados como:", options: ["Esportes de invasão.", "Práticas corporais de aventura na natureza.", "Lutas de contexto mundial.", "Ginástica rítmica."], correct: 1 }
      ]
    }
  },
  religiao: {
    '9': {
      'direitos_humanos': [
        { id: 1, question: "O Ensino Religioso, sob uma abordagem laica e ética, busca principalmente:", options: ["Impor uma crença específica a todos os alunos.", "Combater preconceitos e promover o respeito à diversidade cultural e religiosa.", "Ignorar as filosofias de vida seculares.", "Converter os estudantes a uma única tradição religiosa."], correct: 1 },
        { id: 2, question: "Os Direitos Humanos são fundamentais porque:", options: ["São aplicados apenas a algumas pessoas escolhidas.", "Garantem a dignidade, liberdade e igualdade para todos os seres humanos, independentemente de suas crenças.", "Protegem apenas as instituições do Estado.", "São um conceito apenas teórico sem impacto prático na sociedade."], correct: 1 }
      ],
      'convivencia': [
        { id: 1, question: "A atitude de respeito e diálogo pacífico entre diferentes tradições religiosas é chamada de:", options: ["Intolerância", "Dogmatismo", "Diálogo Inter-religioso", "Etnocentrismo"], correct: 2 }
      ]
    }
  }
};

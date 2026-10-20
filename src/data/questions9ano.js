// Perguntas do 9º ano no mesmo formato do mockQuestions.
// Campos extras (opcionais): level ('facil' | 'medio' | 'dificil') e explanation (mostrar após responder).
// Para usar: dentro de cada matéria do seu mockQuestions, substitua/adicione a chave '9' com o conteúdo abaixo.

export const questions9ano = {
  portugues: {
    '9': {
      'noticias_e_argumentacao': [
        { id: 1, level: 'medio', question: "Para checar se uma notícia é falsa, qual estratégia ajuda mais?", options: ["Compartilhar para ver quem responde", "Verificar fonte, data, autoria e comparar com outros veículos", "Confiar na notícia com mais curtidas", "Ler só o título"], correct: 1, explanation: "Verificar veículo, fonte, data e autoria, e comparar fontes, é a base para reconhecer fake news." },
        { id: 2, level: 'medio', question: "O que não pode faltar em um artigo de opinião?", options: ["Rimas e versos", "Posicionamento sustentado por argumentos", "Apenas um relato pessoal", "Diálogo entre personagens"], correct: 1, explanation: "O artigo de opinião defende uma posição sobre um tema polêmico usando argumentos." },
        { id: 3, level: 'medio', question: "Citar a opinião de um especialista para defender um ponto de vista é um argumento de:", options: ["Exemplificação", "Autoridade", "Comparação", "Emoção"], correct: 1, explanation: "O argumento de autoridade usa a voz de alguém reconhecido no assunto." },
        { id: 4, level: 'facil', question: "Para que servem os sites de checagem de fatos?", options: ["Divulgar boatos mais rápido", "Verificar se um relato é verdadeiro ou boato", "Vender notícias", "Substituir os jornais"], correct: 1, explanation: "Sites de curadoria e checagem ajudam a confirmar a fidedignidade das informações." }
      ],
      'morfossintaxe': [
        { id: 1, level: 'medio', question: "Em “A aluna ficou nervosa”, o verbo “ficou” é:", options: ["Transitivo direto", "Intransitivo", "De ligação", "Auxiliar"], correct: 2, explanation: "“Ficou” liga o sujeito ao predicativo “nervosa”. Outros verbos de ligação: ser, estar, parecer e permanecer." },
        { id: 2, level: 'facil', question: "Em “O dia está lindo”, o predicativo do sujeito é:", options: ["O dia", "está", "lindo", "está lindo"], correct: 2, explanation: "“Lindo” atribui uma característica ao sujeito, ligado a ele pelo verbo de ligação “está”." },
        { id: 3, level: 'medio', question: "Qual é a diferença entre “Ele está cansado” e “Ele parece cansado”?", options: ["Nenhuma", "“Parece” indica aparência, sem certeza", "“Parece” indica certeza", "“Está” indica dúvida"], correct: 1, explanation: "O verbo “parecer” expressa aparência ou possibilidade; “estar” afirma o estado." },
        { id: 4, level: 'medio', question: "Em “Os alunos, que são esforçados, foram premiados”, a oração em destaque é:", options: ["Adjetiva restritiva", "Adjetiva explicativa", "Substantiva", "Adverbial"], correct: 1, explanation: "Entre vírgulas, ela só acrescenta uma explicação sobre todos os alunos: é adjetiva explicativa." },
        { id: 5, level: 'dificil', question: "“Os alunos que estudaram passaram.” Essa frase significa que:", options: ["Todos os alunos passaram", "Só passaram os alunos que estudaram", "Ninguém estudou", "Os alunos não passaram"], correct: 1, explanation: "Sem vírgulas, a oração adjetiva é restritiva: limita quais alunos passaram." }
      ],
      'conjuncoes_e_coesao': [
        { id: 1, level: 'medio', question: "Em “Estudei muito, mas não passei”, a conjunção “mas” indica:", options: ["Adição", "Oposição", "Causa", "Conclusão"], correct: 1, explanation: "“Mas” é conjunção coordenativa adversativa: une ideias que se opõem." },
        { id: 2, level: 'facil', question: "Em “Não saí porque chovia”, “porque” introduz uma ideia de:", options: ["Oposição", "Causa", "Finalidade", "Condição"], correct: 1, explanation: "A chuva é a causa de eu não ter saído." },
        { id: 3, level: 'medio', question: "Em “Estudei bastante; portanto, fui bem na prova”, “portanto” expressa:", options: ["Oposição", "Adição", "Conclusão", "Comparação"], correct: 2, explanation: "“Portanto” é conjunção conclusiva: indica a consequência do que foi dito antes." }
      ],
      'norma_padrao_e_variacao': [
        { id: 1, level: 'medio', question: "Qual frase está de acordo com a norma-padrão?", options: ["Assisti o filme ontem.", "Assisti ao filme ontem.", "Assisti no filme ontem.", "Assisti pelo filme ontem."], correct: 1, explanation: "No sentido de “ver”, o verbo assistir pede a preposição “a”: assistir ao filme." },
        { id: 2, level: 'medio', question: "Qual frase segue a norma-padrão quanto à colocação do pronome?", options: ["Me empreste o caderno.", "Empreste-me o caderno.", "Empreste me o caderno.", "Me emprestar o caderno."], correct: 1, explanation: "Na norma-padrão, evita-se iniciar a frase com pronome oblíquo átono. “Me empreste” é comum na fala." },
        { id: 3, level: 'facil', question: "Dizer “tá” em vez de “está” em uma conversa com amigos é exemplo de:", options: ["Erro grave de escrita", "Variação linguística adequada ao contexto informal", "Estrangeirismo", "Arcaísmo"], correct: 1, explanation: "A língua varia conforme o contexto. Em situações formais, usa-se a norma-padrão." },
        { id: 4, level: 'facil', question: "“Shopping”, “delivery” e “selfie” são exemplos de:", options: ["Neologismos", "Arcaísmos", "Estrangeirismos", "Gírias regionais"], correct: 2, explanation: "Palavras de outras línguas usadas no português são estrangeirismos." }
      ]
    }
  },

  matematica: {
    '9': {
      'numeros_reais': [
        { id: 1, level: 'facil', question: "Qual destes números é irracional?", options: ["0,25", "1/3", "√2", "√9"], correct: 2, explanation: "√2 tem representação decimal infinita e não periódica." },
        { id: 2, level: 'medio', question: "Quanto vale 2⁻³?", options: ["−8", "−6", "1/6", "1/8"], correct: 3, explanation: "Expoente negativo inverte a base: 2⁻³ = 1/2³ = 1/8." },
        { id: 3, level: 'facil', question: "O número 3.000.000 em notação científica é:", options: ["3 × 10⁵", "3 × 10⁶", "30 × 10⁴", "0,3 × 10⁶"], correct: 1, explanation: "Na notação científica, o número fica entre 1 e 10 multiplicado por potência de 10: 3 × 10⁶." }
      ],
      'porcentagem_e_funcoes': [
        { id: 1, level: 'medio', question: "Um preço sobe 10% e, depois, sobe mais 10% sobre o novo valor. O aumento total é de:", options: ["20%", "21%", "22%", "11%"], correct: 1, explanation: "Percentuais sucessivos: 1,10 × 1,10 = 1,21, ou seja, 21%." },
        { id: 2, level: 'medio', question: "Qual é o juro simples de R$ 1.000 a 5% ao mês durante 3 meses?", options: ["R$ 50", "R$ 150", "R$ 155", "R$ 1.150"], correct: 1, explanation: "J = 1000 × 0,05 × 3 = R$ 150." },
        { id: 3, level: 'facil', question: "Se f(x) = 2x + 3, quanto vale f(4)?", options: ["8", "9", "11", "14"], correct: 2, explanation: "f(4) = 2 × 4 + 3 = 11." }
      ],
      'teorema_pitagoras': [
        { id: 1, level: 'facil', question: "No Teorema de Pitágoras, em um triângulo retângulo, a soma dos quadrados dos catetos é igual ao quadrado da:", options: ["Tangente", "Hipotenusa", "Área", "Altura"], correct: 1, explanation: "A hipotenusa é o maior lado, oposto ao ângulo reto." },
        { id: 2, level: 'facil', question: "Se um triângulo retângulo tem catetos medindo 3 e 4, a hipotenusa medirá:", options: ["5", "7", "12", "25"], correct: 0, explanation: "3² + 4² = 9 + 16 = 25, e √25 = 5." },
        { id: 3, level: 'medio', question: "Um triângulo retângulo tem catetos 6 e 8. Qual é a hipotenusa?", options: ["10", "12", "14", "9"], correct: 0, explanation: "Pitágoras: 6² + 8² = 36 + 64 = 100, e √100 = 10." },
        { id: 4, level: 'medio', question: "Em um triângulo retângulo, a hipotenusa mede 13 e um cateto mede 5. O outro cateto mede:", options: ["8", "10", "12", "18"], correct: 2, explanation: "13² − 5² = 169 − 25 = 144, e √144 = 12." }
      ],
      'equacoes_2grau': [
        { id: 1, level: 'facil', question: "A fórmula usada para resolver equações do 2º grau é conhecida como a Fórmula de:", options: ["Newton", "Tales", "Bhaskara", "Pitágoras"], correct: 2, explanation: "x = (−b ± √Δ) / 2a, com Δ = b² − 4ac." },
        { id: 2, level: 'medio', question: "Quais são as raízes de x² − 5x + 6 = 0?", options: ["1 e 6", "2 e 3", "−2 e −3", "5 e 6"], correct: 1, explanation: "Soma 5 e produto 6: as raízes são 2 e 3." },
        { id: 3, level: 'medio', question: "O desenvolvimento de (x + 3)² é:", options: ["x² + 9", "x² + 6x + 9", "x² + 3x + 9", "2x + 6"], correct: 1, explanation: "Produto notável: (a + b)² = a² + 2ab + b², logo x² + 6x + 9." }
      ],
      'geometria_e_medidas': [
        { id: 1, level: 'medio', question: "Qual é o ponto médio do segmento com extremos A(2, 4) e B(6, 8)?", options: ["(4, 6)", "(8, 12)", "(3, 5)", "(2, 2)"], correct: 0, explanation: "Média das coordenadas: (2+6)/2 = 4 e (4+8)/2 = 6." },
        { id: 2, level: 'medio', question: "Duas retas paralelas são cortadas por uma transversal. Os ângulos alternos internos são:", options: ["Complementares", "Sempre suplementares", "Congruentes (iguais)", "Sempre retos"], correct: 2, explanation: "Ângulos alternos internos formados por paralelas e uma transversal têm a mesma medida." },
        { id: 3, level: 'medio', question: "Qual é o volume de um cilindro com raio 3 cm e altura 10 cm?", options: ["30π cm³", "60π cm³", "90π cm³", "900π cm³"], correct: 2, explanation: "V = π × r² × h = π × 9 × 10 = 90π cm³." },
        { id: 4, level: 'facil', question: "Dois triângulos são semelhantes com razão 2. Se um lado do menor mede 5 cm, o lado correspondente do maior mede:", options: ["7 cm", "10 cm", "2,5 cm", "25 cm"], correct: 1, explanation: "Os lados correspondentes são proporcionais: 5 × 2 = 10 cm." }
      ],
      'probabilidade': [
        { id: 1, level: 'medio', question: "Ao lançar uma moeda e um dado, qual a probabilidade de sair cara e 6?", options: ["1/6", "1/8", "1/12", "1/2"], correct: 2, explanation: "Eventos independentes: 1/2 × 1/6 = 1/12." },
        { id: 2, level: 'dificil', question: "Uma urna tem 3 bolas vermelhas e 2 azuis. Retirando 2 bolas sem reposição, qual a probabilidade de ambas serem vermelhas?", options: ["3/10", "9/25", "6/5", "1/2"], correct: 0, explanation: "Eventos dependentes: 3/5 × 2/4 = 6/20 = 3/10." }
      ]
    }
  },

  ciencias: {
    '9': {
      'materia_e_atomos': [
        { id: 1, level: 'facil', question: "A passagem do estado líquido para o gasoso chama-se:", options: ["Fusão", "Solidificação", "Vaporização", "Condensação"], correct: 2, explanation: "Vaporização é a passagem de líquido para gás, por exemplo ao ferver ou evaporar." },
        { id: 2, level: 'facil', question: "Qual partícula do átomo tem carga elétrica negativa?", options: ["Próton", "Nêutron", "Elétron", "Núcleo"], correct: 2, explanation: "Elétrons têm carga negativa, prótons positiva e nêutrons não têm carga." },
        { id: 3, level: 'facil', question: "Qual é o símbolo químico do sódio?", options: ["S", "So", "Na", "N"], correct: 2, explanation: "O símbolo Na vem do nome em latim, natrium." },
        { id: 4, level: 'medio', question: "O sal de cozinha (NaCl) é formado por qual tipo de ligação?", options: ["Iônica", "Covalente", "Metálica", "Ponte de hidrogênio"], correct: 0, explanation: "O sódio transfere um elétron ao cloro, formando íons: é uma ligação iônica." },
        { id: 5, level: 'medio', question: "A lei de Lavoisier diz que, em uma reação química em sistema fechado:", options: ["A massa total se conserva", "A massa sempre aumenta", "A massa sempre diminui", "A energia some"], correct: 0, explanation: "“Na natureza nada se cria, nada se perde, tudo se transforma.”" }
      ],
      'luz_som_e_radiacoes': [
        { id: 1, level: 'medio', question: "Ao atravessar um prisma, a luz branca:", options: ["Fica mais escura", "Se decompõe nas cores do espectro", "Desaparece", "Vira luz azul"], correct: 1, explanation: "A refração separa as cores que compõem a luz branca." },
        { id: 2, level: 'medio', question: "Quais são as três cores primárias da luz?", options: ["Vermelho, amarelo e azul", "Vermelho, verde e azul", "Verde, amarelo e roxo", "Ciano, magenta e amarelo"], correct: 1, explanation: "Misturando luz vermelha, verde e azul, obtém-se todas as outras cores." },
        { id: 3, level: 'medio', question: "Em qual destes meios o som se propaga mais rápido?", options: ["Ar", "Água", "Aço", "Vácuo"], correct: 2, explanation: "O som não se propaga no vácuo e, em geral, é mais rápido em sólidos do que em líquidos e gases." },
        { id: 4, level: 'facil', question: "Qual radiação é muito usada na medicina para ver ossos?", options: ["Infravermelho", "Micro-ondas", "Raio X", "Ondas de rádio"], correct: 2, explanation: "O raio X atravessa tecidos moles e é barrado pelos ossos." }
      ],
      'genetica_e_evolucao': [
        { id: 1, level: 'facil', question: "Quem é considerado o pai da genética, por seus estudos com ervilhas?", options: ["Darwin", "Lamarck", "Pasteur", "Mendel"], correct: 3, explanation: "Gregor Mendel formulou as leis da hereditariedade." },
        { id: 2, level: 'medio', question: "Qual ideia evolucionista é de Lamarck?", options: ["Seleção natural", "Uso e desuso dos órgãos", "Mutação por radiação", "Geração espontânea"], correct: 1, explanation: "Lamarck propôs uso e desuso. Darwin propôs a seleção natural." },
        { id: 3, level: 'medio', question: "Quantos cromossomos tem um gameta humano (óvulo ou espermatozoide)?", options: ["46", "23", "44", "92"], correct: 1, explanation: "Os gametas têm metade dos cromossomos das demais células: 23." },
        { id: 4, level: 'dificil', question: "No cruzamento Aa × Aa (dominância completa), qual a probabilidade de um filho aa?", options: ["1/4", "1/2", "3/4", "0"], correct: 0, explanation: "Pela 1ª Lei de Mendel, os descendentes são 1/4 AA, 2/4 Aa e 1/4 aa." },
        { id: 5, level: 'medio', question: "Segundo Darwin, quem tem mais chance de sobreviver e deixar descendentes?", options: ["Sempre os mais fortes", "Os mais bem adaptados ao ambiente", "Os maiores", "Os que mais se esforçam"], correct: 1, explanation: "A seleção natural favorece as variações mais adequadas ao ambiente." }
      ],
      'universo_e_conservacao': [
        { id: 1, level: 'facil', question: "O Sistema Solar fica em qual galáxia?", options: ["Andrômeda", "Via Láctea", "Triângulo", "Grande Nuvem de Magalhães"], correct: 1, explanation: "Estamos na Via Láctea, uma entre bilhões de galáxias." },
        { id: 2, level: 'medio', question: "Qual unidade de conservação do Piauí é Parque Nacional?", options: ["Sete Cidades", "Delta do Parnaíba", "Serra Vermelha", "Ilha Grande"], correct: 0, explanation: "O Parque Nacional de Sete Cidades protege a biodiversidade e um patrimônio nacional." }
      ]
    }
  },

  geografia: {
    '9': {
      'mundo_e_globalizacao': [
        { id: 1, level: 'medio', question: "A divisão do mundo em Ocidente e Oriente está ligada a:", options: ["Fusos horários", "Sistema colonial das potências europeias", "Linha do Equador", "Guerra do Paraguai"], correct: 1, explanation: "O critério nasceu do ponto de vista europeu durante o colonialismo." },
        { id: 2, level: 'facil', question: "A integração econômica, política e cultural entre países em escala mundial é chamada de:", options: ["Colonização", "Globalização", "Urbanização", "Industrialização"], correct: 1, explanation: "A globalização conecta países por meio do comércio, das tecnologias e da cultura." },
        { id: 3, level: 'medio', question: "Empresas com sede em um país e filiais em vários outros são chamadas de:", options: ["Cooperativas", "Corporações multinacionais", "Autarquias", "ONGs"], correct: 1, explanation: "As multinacionais atuam em vários países e influenciam consumo, cultura e trabalho." },
        { id: 4, level: 'medio', question: "A Antártida tem importância internacional principalmente por:", options: ["Ter grandes cidades", "Pesquisa científica e interesse geopolítico", "Ser o maior produtor de soja", "Ter fronteira com o Brasil"], correct: 1, explanation: "A Antártida é um centro de pesquisa e está no centro de debates geopolíticos." }
      ],
      'europa_asia_oceania': [
        { id: 1, level: 'medio', question: "Qual cadeia de montanhas costuma ser o limite entre Europa e Ásia?", options: ["Andes", "Himalaia", "Alpes", "Montes Urais"], correct: 3, explanation: "A Eurásia é um só continente. Os Urais são o limite convencional." },
        { id: 2, level: 'facil', question: "Qual destes países fica na Oceania?", options: ["Nova Zelândia", "Indonésia", "Japão", "Filipinas"], correct: 0, explanation: "Austrália e Nova Zelândia são os principais países da Oceania." },
        { id: 3, level: 'facil', question: "Qual é o maior país do mundo em área, ocupando parte da Europa e da Ásia?", options: ["China", "Cazaquistão", "Rússia", "Índia"], correct: 2, explanation: "A Rússia se estende da Europa Oriental até o extremo leste da Ásia." },
        { id: 4, level: 'facil', question: "Qual é o maior continente em extensão?", options: ["África", "Ásia", "América", "Europa"], correct: 1, explanation: "A Ásia é o maior continente em área e em população." },
        { id: 5, level: 'facil', question: "Qual é o maior país da Oceania em área?", options: ["Nova Zelândia", "Austrália", "Papua-Nova Guiné", "Fiji"], correct: 1, explanation: "A Austrália é, de longe, o maior país da Oceania." },
        { id: 6, level: 'medio', question: "Como se chama a grande floresta de coníferas do norte da Rússia e da Ásia?", options: ["Savana", "Estepe", "Taiga", "Pampa"], correct: 2, explanation: "A taiga é a maior floresta de coníferas do planeta, em clima frio." },
        { id: 7, level: 'medio', question: "A Península Arábica é conhecida por grandes reservas de qual recurso?", options: ["Carvão vegetal", "Petróleo", "Madeira", "Água doce"], correct: 1, explanation: "O Oriente Médio concentra grandes reservas de petróleo." }
      ],
      'energia_e_industrializacao': [
        { id: 1, level: 'facil', question: "Qual destas é fonte de energia renovável?", options: ["Carvão mineral", "Usina nuclear", "Termoelétrica a óleo", "Eólica"], correct: 3, explanation: "A energia eólica usa a força do vento." },
        { id: 2, level: 'medio', question: "A industrialização começou, no século XVIII, em qual país?", options: ["Brasil", "Japão", "Inglaterra", "Austrália"], correct: 2, explanation: "A Revolução Industrial teve início na Inglaterra." }
      ],
      'mapas_e_representacao': [
        { id: 1, level: 'dificil', question: "Em uma anamorfose geográfica, o tamanho de cada território é:", options: ["Igual para todos", "Proporcional a um dado, como população", "Sempre o da área real", "Definido pela altitude"], correct: 1, explanation: "A anamorfose deforma o mapa para mostrar um dado, como população ou PIB." },
        { id: 2, level: 'facil', question: "Um mapa que usa cores para mostrar dados, como densidade populacional, é um mapa:", options: ["Físico", "Político", "Temático", "Topográfico"], correct: 2, explanation: "Mapas temáticos representam um tema ou dado específico no espaço." },
        { id: 3, level: 'dificil', question: "Qual característica da projeção de Mercator aparece nos mapas-múndi?", options: ["Reduz as áreas perto dos polos", "Distorce e aumenta as áreas perto dos polos", "Mostra todas as áreas em tamanho real", "Não tem distorção nenhuma"], correct: 1, explanation: "Por isso a Groenlândia parece muito maior do que é em comparação com a África." }
      ]
    }
  },

  historia: {
    '9': {
      'republica_no_brasil': [
        { id: 1, level: 'facil', question: "Em que ano foi proclamada a República no Brasil?", options: ["1822", "1889", "1930", "1964"], correct: 1, explanation: "A República foi proclamada em 15 de novembro de 1889." },
        { id: 2, level: 'medio', question: "O coronelismo, na Primeira República, era marcado por:", options: ["Voto secreto e livre", "Poder local de grandes proprietários", "Governo de operários", "Fim do latifúndio"], correct: 1, explanation: "Os coronéis controlavam votos e a política local, inclusive no Piauí." },
        { id: 3, level: 'medio', question: "Qual conjunto de leis trabalhistas foi criado no governo Vargas, em 1943?", options: ["Constituição Cidadã", "CLT", "Lei Áurea", "Plano Real"], correct: 1, explanation: "A Consolidação das Leis do Trabalho reuniu direitos como salário mínimo e férias." },
        { id: 4, level: 'facil', question: "Qual grande obra marcou o governo de Juscelino Kubitschek?", options: ["Construção de Brasília", "Transamazônica", "Ponte Rio-Niterói", "Usina de Itaipu"], correct: 0, explanation: "JK prometeu “50 anos em 5” e inaugurou Brasília em 1960." }
      ],
      'guerras_e_totalitarismos': [
        { id: 1, level: 'medio', question: "O assassinato de qual figura, em Sarajevo, em 1914, foi o estopim da Primeira Guerra Mundial?", options: ["Arquiduque Francisco Ferdinando", "Kaiser Guilherme II", "Napoleão III", "Czar Nicolau II"], correct: 0, explanation: "O atentado contra o herdeiro do trono austro-húngaro desencadeou a guerra." },
        { id: 2, level: 'medio', question: "Qual líder bolchevique foi a principal figura política da Revolução Russa de 1917?", options: ["Gorbachev", "Lênin", "Nicolau II", "Churchill"], correct: 1, explanation: "Lênin liderou os bolcheviques e o novo governo soviético." },
        { id: 3, level: 'facil', question: "O Holocausto foi:", options: ["Uma batalha da Primeira Guerra", "O extermínio sistemático de judeus e outras vítimas pelo regime nazista", "Um tratado de paz", "Um movimento artístico"], correct: 1, explanation: "O regime nazista assassinou milhões de judeus e de outros grupos perseguidos." },
        { id: 4, level: 'facil', question: "A Segunda Guerra Mundial aconteceu entre:", options: ["1914 e 1918", "1939 e 1945", "1945 e 1991", "1929 e 1933"], correct: 1, explanation: "A Segunda Guerra começou em 1939 e terminou em 1945." },
        { id: 5, level: 'medio', question: "A crise de 1929 começou com a quebra de qual bolsa de valores?", options: ["Londres", "Tóquio", "Nova York", "Paris"], correct: 2, explanation: "A quebra da Bolsa de Nova York afetou a economia mundial." }
      ],
      'mundo_pos_guerra': [
        { id: 1, level: 'medio', question: "A ONU foi criada em 1945 depois de qual acontecimento?", options: ["Revolução Russa", "Primeira Guerra Mundial", "Guerra Fria", "Segunda Guerra Mundial"], correct: 3, explanation: "Seu objetivo inicial era manter a paz e proteger os direitos humanos." },
        { id: 2, level: 'medio', question: "A Declaração Universal dos Direitos Humanos foi aprovada pela ONU em:", options: ["1919", "1948", "1964", "1988"], correct: 1, explanation: "Foi aprovada em 1948, após os horrores da Segunda Guerra." },
        { id: 3, level: 'medio', question: "A Guerra Fria foi uma disputa política e ideológica entre:", options: ["Brasil e Argentina", "EUA e União Soviética", "França e Alemanha", "China e Japão"], correct: 1, explanation: "Capitalismo e socialismo disputaram influência no mundo, sem confronto direto entre as duas potências." },
        { id: 4, level: 'medio', question: "Quem liderou a independência da Índia com a estratégia da não violência?", options: ["Gandhi", "Mandela", "Sukarno", "Atatürk"], correct: 0, explanation: "Gandhi liderou a resistência pacífica contra o domínio britânico. A Índia ficou independente em 1947." }
      ],
      'ditadura_e_democracia': [
        { id: 1, level: 'dificil', question: "O AI-5, de 1968, foi:", options: ["Um ato que ampliou a liberdade de imprensa", "Um decreto que endureceu a repressão durante a ditadura", "Uma lei de anistia", "A primeira constituição republicana"], correct: 1, explanation: "O AI-5 permitiu fechar o Congresso e aumentou a censura e a perseguição política." },
        { id: 2, level: 'dificil', question: "O movimento Diretas Já, de 1983-1984, pedia:", options: ["Eleição direta para presidente", "O fim da escravidão", "A volta da monarquia", "Voto apenas para quem sabia ler"], correct: 0, explanation: "Milhões de pessoas foram às ruas pedindo eleições diretas para presidente." },
        { id: 3, level: 'medio', question: "A Constituição de 1988 ficou conhecida como:", options: ["Constituição Imperial", "Ato Institucional", "Constituição Cidadã", "Carta do Estado Novo"], correct: 2, explanation: "Ela ampliou direitos civis, políticos e sociais após a ditadura civil-militar." }
      ]
    }
  }
};
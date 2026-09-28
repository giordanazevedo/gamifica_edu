export const mockQuestions = {
  portugues: {
    '6': {
      'generos_narrativos': [
        { id: 1, question: "Qual gênero narrativo geralmente traz animais falantes e termina com uma moral da história?", options: ["Notícia", "Fábula", "Crônica", "Mito"], correct: 1 },
        { id: 2, question: "O mito é um tipo de narrativa que tem como objetivo principal:", options: ["Relatar fatos reais do dia a dia", "Explicar a origem do mundo e fenômenos da natureza de forma simbólica", "Dar uma opinião sobre política", "Vender um produto"], correct: 1 },
        { id: 3, question: "Qual das opções abaixo é uma característica da Crônica?", options: ["Texto longo e complexo", "Baseia-se em fatos do cotidiano", "Sempre tem rimas e métrica", "Conta a história de deuses gregos"], correct: 1 },
        { type: "boolean", id: 4, question: "Verdadeiro ou Falso: A Notícia é um gênero textual que não tem o compromisso de informar fatos reais.", options: ["Verdadeiro", "Falso"], correct: 1 }
      ],
      'classes_gramaticais': [
        { id: 1, question: "Em 'O menino inteligente correu rápido', qual palavra é o adjetivo?", options: ["menino", "correu", "rápido", "inteligente"], correct: 3 },
        { id: 2, question: "Qual das palavras abaixo é um pronome pessoal do caso reto?", options: ["Meu", "Aquele", "Nós", "Nenhum"], correct: 2 },
        { id: 3, question: "A classe gramatical que dá nome aos seres e objetos é:", options: ["Verbo", "Substantivo", "Artigo", "Preposição"], correct: 1 },
        { id: 4, question: "Na frase 'Eu vou jogar bola', 'jogar' é qual classe gramatical?", options: ["Substantivo", "Adjetivo", "Verbo", "Pronome"], correct: 2 }
      ]
    },
    '8': {
      'textos_argumentativos': [
        { id: 1, question: "O artigo de opinião tem como característica principal:", options: ["Contar uma piada", "Defender um ponto de vista com argumentos", "Descrever uma paisagem", "Apenas informar sem tomar partido"], correct: 1 },
        { id: 2, question: "Em um debate regrado, a atitude mais adequada é:", options: ["Gritar mais alto", "Ouvir e contra-argumentar com respeito", "Falar junto com o adversário", "Mudar de assunto"], correct: 1 },
        { id: 3, question: "O editorial de um jornal costuma expressar a opinião:", options: ["Do leitor", "Do repórter", "Da empresa jornalística (do veículo)", "Do entrevistado"], correct: 2 }
      ]
    }
  },
  matematica: {
    '6': {
      'numeros_racionais': [
        { type: 'boolean', id: 1, question: "Verdadeiro ou Falso: Todo número natural é também um número racional.", options: ["Verdadeiro", "Falso"], correct: 0 },
        { id: 2, question: "O resultado da soma das frações 1/2 e 1/4 é:", options: ["2/6", "3/4", "1/8", "1/6"], correct: 1 },
        { id: 3, question: "Qual é o valor em decimal da fração 3/4?", options: ["3,4", "0,34", "0,75", "1,33"], correct: 2 },
        { id: 4, question: "Pedro comeu 2/5 de uma pizza e Maria comeu 1/5. Quanto sobrou da pizza?", options: ["2/5", "3/5", "1/5", "Nenhuma"], correct: 0 }
      ],
      'geometria_plana': [
        { id: 1, question: "Como chamamos um polígono de 5 lados?", options: ["Hexágono", "Quadrilátero", "Pentágono", "Octógono"], correct: 2 },
        { id: 2, question: "O que é o perímetro de uma figura?", options: ["O espaço interno dela", "A soma da medida de todos os seus lados", "O seu peso", "O número de ângulos"], correct: 1 },
        { id: 3, question: "Um triângulo tem um ângulo de 90 graus. Ele é chamado de:", options: ["Triângulo Equilátero", "Triângulo Isósceles", "Triângulo Retângulo", "Triângulo Obtusângulo"], correct: 2 }
      ],
      'multiplos_divisores': [
        { id: 1, question: "Qual é o Mínimo Múltiplo Comum (MMC) entre 4 e 6?", options: ["10", "12", "24", "2"], correct: 1 },
        { id: 2, question: "Todo número par é divisível por:", options: ["3", "5", "7", "2"], correct: 3 },
        { id: 3, question: "Qual o Máximo Divisor Comum (MDC) entre 10 e 15?", options: ["5", "10", "30", "15"], correct: 0 }
      ]
    },
    '7': {
      'proporcionalidade': [
        { id: 1, question: "Se uma blusa custava R$ 100 e teve 20% de desconto, qual é o novo valor?", options: ["R$ 120", "R$ 80", "R$ 90", "R$ 20"], correct: 1 },
        { id: 2, question: "Se 2 operários constroem um muro em 10 dias, em quantos dias 4 operários construiriam o mesmo muro? (Grandezas Inversamente Proporcionais)", options: ["20 dias", "10 dias", "5 dias", "8 dias"], correct: 2 },
        { id: 3, question: "Quanto é 30% de 200?", options: ["30", "60", "90", "120"], correct: 1 }
      ],
      'numeros_inteiros': [
        { id: 1, question: "Qual o resultado de (-5) + (-3)?", options: ["-8", "-2", "8", "2"], correct: 0 },
        { id: 2, question: "Qual é maior: -10 ou -2?", options: ["-10", "Os dois são iguais", "-2", "Depende"], correct: 2 },
        { id: 3, question: "O resultado da multiplicação (-4) x (-3) é:", options: ["-12", "12", "-7", "7"], correct: 1 }
      ]
    },
    '9': {
      'teorema_pitagoras': [
        { id: 1, question: "No Teorema de Pitágoras, em um triângulo retângulo, a soma dos quadrados dos catetos é igual ao quadrado da:", options: ["Tangente", "Hipotenusa", "Área", "Altura"], correct: 1 },
        { id: 2, question: "Se um triângulo retângulo tem catetos medindo 3 e 4, a hipotenusa medirá:", options: ["5", "7", "12", "25"], correct: 0 }
      ],
      'equacoes_2grau': [
        { id: 1, question: "A fórmula usada para resolver equações do 2º grau é conhecida como a Fórmula de:", options: ["Newton", "Tales", "Bhaskara", "Pitágoras"], correct: 2 }
      ]
    }
  },
  ciencias: {
    '6': {
      'terra': [
        { id: 1, question: "A camada sólida mais externa da Terra, onde vivemos, é chamada de:", options: ["Manto", "Núcleo", "Atmosfera", "Litosfera"], correct: 3 },
        { id: 2, question: "O movimento de placas tectônicas é o principal causador de:", options: ["Chuvas ácidas", "Terremotos", "Ventos fortes", "Fases da Lua"], correct: 1 },
        { id: 3, question: "A camada de gases que envolve a Terra é a:", options: ["Litosfera", "Hidrosfera", "Atmosfera", "Biosfera"], correct: 2 }
      ]
    },
    '8': {
      'corpo_humano': [
        { id: 1, question: "Qual sistema é responsável por transportar nutrientes e oxigênio pelo corpo humano?", options: ["Sistema Respiratório", "Sistema Excretor", "Sistema Circulatório", "Sistema Digestório"], correct: 2 },
        { id: 2, question: "O estômago faz parte do sistema:", options: ["Nervoso", "Digestório", "Respiratório", "Imunológico"], correct: 1 },
        { id: 3, question: "A troca de gases (oxigênio por gás carbônico) ocorre em qual órgão?", options: ["Coração", "Rim", "Fígado", "Pulmão"], correct: 3 }
      ]
    }
  },
  historia: {
    '7': {
      'renascimento_reformas': [
        { id: 1, question: "Qual movimento cultural e científico ocorreu na Europa marcando a transição para a Idade Moderna?", options: ["Iluminismo", "Renascimento", "Cruzadas", "Revolução Industrial"], correct: 1 },
        { id: 2, question: "O pensador alemão que iniciou a Reforma Protestante ao pregar as 95 teses foi:", options: ["Leonardo da Vinci", "Galileu Galilei", "Martinho Lutero", "João Calvino"], correct: 2 },
        { id: 3, question: "Qual destas foi uma grande invenção da época que ajudou a espalhar as ideias renascentistas?", options: ["Máquina a vapor", "Imprensa de Gutenberg", "Bússola", "Pólvora"], correct: 1 }
      ],
      'grandes_navegacoes': [
        { id: 1, question: "Qual país europeu foi pioneiro nas Grandes Navegações?", options: ["Espanha", "Inglaterra", "Portugal", "Holanda"], correct: 2 }
      ]
    }
  },
  geografia: {
    '7': {
      'regioes_brasil': [
        { id: 1, question: "O Brasil é dividido oficialmente pelo IBGE em quantas macrorregiões?", options: ["4", "5", "6", "27"], correct: 1 },
        { id: 2, question: "Qual região brasileira abriga a maior parte da Floresta Amazônica?", options: ["Nordeste", "Centro-Oeste", "Norte", "Sudeste"], correct: 2 },
        { id: 3, question: "Qual é a região mais industrializada e populosa do Brasil?", options: ["Sul", "Nordeste", "Norte", "Sudeste"], correct: 3 }
      ]
    }
  },
  ingles: {
    '6': {
      'saudacoes_pessoais': [
        { id: 1, question: "Como se diz 'Bom dia' em inglês?", options: ["Good night", "Good afternoon", "Good morning", "Good evening"], correct: 2 },
        { id: 2, question: "Como você responde à pergunta 'How are you?'", options: ["I am 12 years old", "I am fine, thanks", "My name is John", "I like apples"], correct: 1 },
        { id: 3, question: "O que significa 'Nice to meet you'?", options: ["Bom dia", "Quantos anos você tem?", "Prazer em te conhecer", "Tchau"], correct: 2 }
      ]
    }
  }
};

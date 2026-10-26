function prepareQuestions(subject, topic, entries) {
  return entries.map(([question, answer, distractors, correctIndex], index) => {
    const options = [...distractors];
    options.splice(correctIndex, 0, answer);
    return {
      id: `prepared-${subject}-${topic}-${index + 1}`,
      question,
      options,
      correct: correctIndex,
    };
  });
}

export const preparedQuestionAdditions = {
  portugues: {
    '9': {
      periodo_composto: prepareQuestions('portugues', 'periodo_composto', [
        ['Em “Leu o artigo e anotou os argumentos”, a conjunção “e” introduz uma oração coordenada sindética:', 'aditiva.', ['adversativa.', 'alternativa.', 'conclusiva.'], 0],
        ['Em “Ou revisamos as citações, ou retiramos o trecho”, a relação entre as orações é de:', 'alternância.', ['explicação.', 'conclusão.', 'oposição concessiva.'], 0],
      ]),
      oracoes_substantivas: prepareQuestions('portugues', 'oracoes_substantivas', [
        ['Em “A turma espera que o passeio seja confirmado”, a oração iniciada por “que” é substantiva:', 'objetiva direta.', ['predicativa.', 'subjetiva.', 'completiva nominal.'], 0],
        ['Em “Só peço uma coisa: que você confira os dados”, a oração após os dois-pontos é substantiva:', 'apositiva.', ['objetiva direta.', 'completiva nominal.', 'predicativa.'], 0],
      ]),
      oracoes_adjetivas_adverbiais: prepareQuestions('portugues', 'oracoes_adjetivas_adverbiais', [
        ['Em “Embora o texto fosse curto, apresentou bons argumentos”, a oração inicial expressa:', 'concessão.', ['causa.', 'condição.', 'finalidade.'], 0],
        ['Em “Quando terminou a entrevista, a aluna organizou as anotações”, a oração inicial indica:', 'tempo.', ['causa.', 'concessão.', 'comparação.'], 0],
      ]),
      concordancia_regencia_crase: prepareQuestions('portugues', 'concordancia_regencia_crase', [
        ['Qual frase usa corretamente a crase?', 'A turma retornou à sala para concluir a atividade.', ['A turma começou à revisar a atividade.', 'Os estudantes chegaram à pé.', 'A professora entregou o material à uma aluna.'], 0],
        ['Complete corretamente: “_____ muitos motivos para revisar as fontes.”', 'Há.', ['Hão.', 'Havia-se.', 'Existia.'], 0],
      ]),
      pontuacao_colocacao_pronominal: prepareQuestions('portugues', 'pontuacao_colocacao_pronominal', [
        ['Em “Não se deve publicar uma informação sem checá-la”, o pronome “se” aparece antes do verbo porque:', 'a palavra negativa “não” atrai o pronome, ocorrendo próclise.', ['todo pronome deve vir antes do verbo.', 'a frase está no futuro e exige mesóclise.', 'o verbo está no imperativo afirmativo.'], 0],
        ['Qual pontuação pode introduzir uma fala em um diálogo narrativo?', 'Travessão.', ['Ponto e vírgula obrigatoriamente.', 'Parênteses em qualquer situação.', 'Vírgula entre sujeito e verbo.'], 0],
      ]),
      producao_textual_coesao: prepareQuestions('portugues', 'producao_textual_coesao', [
        ['Qual sequência organiza a estrutura básica de um texto dissertativo-argumentativo?', 'Introdução com tese, desenvolvimento com argumentos e conclusão.', ['Conclusão, título e lista de personagens.', 'Exemplos sem tese, seguidos de uma pergunta.', 'Citações soltas sem introdução ou conclusão.'], 0],
        ['Na revisão de um artigo de opinião, é importante verificar se:', 'os argumentos sustentam a tese e os conectivos articulam as ideias.', ['todos os parágrafos começam com o mesmo conectivo.', 'a conclusão introduz um tema sem relação com o texto.', 'as fontes foram omitidas para deixar a leitura mais rápida.'], 0],
      ]),
      literatura_piauiense: prepareQuestions('portugues', 'literatura_piauiense', [
        ['Fontes Ibiapina, Da Costa e Silva e H. Dobal são estudados como autores relacionados à:', 'literatura piauiense.', ['literatura exclusivamente portuguesa medieval.', 'literatura oral da Grécia Antiga.', 'produção jornalística sem relação com literatura.'], 0],
        ['Relacionar uma obra literária piauiense ao seu contexto ajuda o leitor a:', 'perceber relações entre escolhas do texto, cultura, história e sociedade.', ['dispensar a leitura e analisar apenas o lugar de nascimento do autor.', 'encontrar uma única interpretação obrigatória.', 'ignorar os recursos de linguagem da obra.'], 0],
      ]),
      multissemiose_publicidade: prepareQuestions('portugues', 'multissemiose_publicidade', [
        ['Em um cartaz contra o desperdício de água, a imagem de uma torneira seca junto da frase “Cada gota conta” combina linguagens para:', 'reforçar visualmente a urgência da mensagem.', ['contradizer a frase e defender o desperdício.', 'substituir toda a mensagem por uma informação científica.', 'evitar que o leitor interprete o cartaz.'], 0],
        ['Um anúncio usa letras grandes e cores contrastantes na palavra “ATENÇÃO”. Esse recurso visual busca principalmente:', 'destacar a informação e chamar a atenção do público.', ['esconder a informação principal.', 'indicar que o anúncio não tem destinatário.', 'transformar o texto em uma narrativa ficcional.'], 1],
      ]),
      entrevistas_oralidade: prepareQuestions('portugues', 'entrevistas_oralidade', [
        ['Qual pergunta tende a produzir uma resposta mais detalhada em uma entrevista?', 'Como essa mudança afetou a rotina da comunidade?', ['Você gostou? Responda sim ou não.', 'Está tudo certo, não está?', 'Posso encerrar a entrevista agora?'], 2],
        ['Ao resumir uma palestra para estudar, é mais útil anotar:', 'ideias principais, palavras-chave e relações entre os assuntos.', ['todas as palavras sem selecionar informações.', 'apenas opiniões que não foram explicadas.', 'frases aleatórias sem relação com o tema.'], 3],
      ]),
      argumentacao_reivindicacao: prepareQuestions('portugues', 'argumentacao_reivindicacao', [
        ['Qual elemento fortalece uma reivindicação por melhorias na biblioteca escolar?', 'dados sobre o uso do espaço acompanhados de uma proposta concreta.', ['ataques pessoais aos responsáveis.', 'uma opinião sem justificativa ou pedido.', 'informações sem relação com a biblioteca.'], 0],
        ['Em um debate, apresentar uma refutação significa:', 'contestar um argumento com razões ou evidências pertinentes.', ['mudar de assunto sem responder ao argumento.', 'repetir a própria opinião sem justificá-la.', 'impedir que os outros participantes falem.'], 1],
      ]),
      resenha_citacoes: prepareQuestions('portugues', 'resenha_citacoes', [
        ['O que distingue uma resenha crítica de um resumo?', 'A resenha também avalia a obra e justifica essa avaliação.', ['A resenha apresenta somente o título da obra.', 'O resumo sempre precisa defender uma opinião pessoal.', 'A resenha não pode mencionar o conteúdo da obra.'], 2],
        ['Ao usar com suas palavras uma ideia de outra pessoa em um trabalho, o estudante deve:', 'indicar a fonte consultada e preservar o sentido original.', ['apresentar a ideia como se fosse sua.', 'alterar o sentido da ideia sem avisar.', 'apagar o nome do autor da fonte.'], 3],
      ]),
      modalizacao_epistemica: prepareQuestions('portugues', 'modalizacao_epistemica', [
        ['Na frase “Talvez a reunião aconteça amanhã”, a palavra “talvez” indica:', 'possibilidade ou dúvida.', ['certeza absoluta.', 'uma ordem direta.', 'uma comparação entre reuniões.'], 0],
        ['Qual expressão demonstra maior certeza do enunciador?', 'Sem dúvida, os dados confirmam a conclusão.', ['Quem sabe os dados confirmem a conclusão.', 'É possível que os dados confirmem a conclusão.', 'Talvez os dados confirmem a conclusão.'], 1],
      ]),
      texto_dramatico_poesia: prepareQuestions('portugues', 'texto_dramatico_poesia', [
        ['Em um texto teatral, uma indicação entre parênteses como “(entra apressado)” costuma orientar:', 'a atuação ou movimentação da personagem.', ['a lista de referências bibliográficas.', 'a divisão silábica do título.', 'o significado de uma palavra no dicionário.'], 2],
        ['Um poema visual explora o formato e a disposição das palavras para:', 'construir sentidos também por meio da organização gráfica.', ['eliminar qualquer relação entre forma e significado.', 'substituir obrigatoriamente todas as palavras por números.', 'apresentar somente regras gramaticais.'], 3],
      ]),
      figuras_linguagem: prepareQuestions('portugues', 'figuras_linguagem', [
        ['Em “A notícia correu pela escola”, o verbo “correu” foi usado para expressar que a notícia:', 'se espalhou rapidamente.', ['participou de uma competição esportiva.', 'ficou parada no mesmo lugar.', 'foi escrita em uma pista de corrida.'], 0],
        ['A repetição do som inicial em “Ventos velozes varriam o vale” é um exemplo de:', 'aliteração.', ['eufemismo.', 'ironia.', 'paradoxo.'], 1],
      ]),
    },
  },
  matematica: {
    '9': {
      radicais_potencias: prepareQuestions('matematica', 'radicais_potencias', [
        ['Qual é o valor de 2⁻³?', '1/8', ['-8', '8', '-1/8'], 2],
        ['Qual é o valor de √81?', '9', ['8', '18', '40,5'], 3],
        ['Como se escreve 3 × 3 × 3 × 3 usando potência?', '3⁴', ['4³', '3 + 4', '3²'], 0],
      ]),
      equacoes_2grau: prepareQuestions('matematica', 'equacoes_2grau', [
        ['Na equação x² − 9 = 0, quais são as soluções?', 'x = −3 e x = 3', ['x = 0 e x = 9', 'x = −9 e x = 9', 'x = 3 apenas'], 1],
        ['Qual é o discriminante da equação x² − 4x + 3 = 0?', '4', ['−4', '7', '16'], 2],
        ['Qual equação tem raízes 2 e 5?', 'x² − 7x + 10 = 0', ['x² + 7x + 10 = 0', 'x² − 3x + 10 = 0', 'x² + 3x − 10 = 0'], 3],
      ]),
      teorema_pitagoras: prepareQuestions('matematica', 'teorema_pitagoras', [
        ['Um triângulo retângulo tem catetos de 5 cm e 12 cm. Quanto mede a hipotenusa?', '13 cm', ['10 cm', '12 cm', '17 cm'], 0],
        ['Em um triângulo retângulo, os catetos medem 9 m e 12 m. Qual é a hipotenusa?', '15 m', ['18 m', '21 m', '10 m'], 1],
        ['Se a hipotenusa mede 10 cm e um cateto mede 6 cm, quanto mede o outro cateto?', '8 cm', ['4 cm', '6 cm', '16 cm'], 2],
      ]),
      estatistica: prepareQuestions('matematica', 'estatistica', [
        ['Qual é a média aritmética de 4, 6 e 8?', '6', ['4', '8', '18'], 3],
        ['No conjunto 2, 3, 3, 5, 7, qual é a moda?', '3', ['2', '4', '5'], 0],
        ['No conjunto ordenado 1, 4, 6, 9, 12, qual é a mediana?', '6', ['4', '7', '9'], 1],
        ['Em um gráfico, uma barra representa 20 alunos e outra, 30. Quantos alunos as duas representam juntas?', '50', ['10', '30', '600'], 2],
      ]),
      funcoes: prepareQuestions('matematica', 'funcoes', [
        ['Na função f(x) = 2x + 3, qual é o valor de f(4)?', '11', ['8', '10', '14'], 3],
        ['Qual é a taxa de variação da função afim f(x) = 5x − 2?', '5', ['−2', '2', '−5'], 0],
        ['Qual ponto pertence ao gráfico de y = x + 2?', '(1, 3)', ['(1, 2)', '(2, 1)', '(3, 2)'], 1],
        ['Quando x aumenta uma unidade em f(x) = 3x + 1, o valor de f(x):', 'aumenta 3 unidades.', ['diminui 3 unidades.', 'permanece sempre igual.', 'aumenta 1 unidade.'], 2],
        ['Qual expressão representa uma função quadrática?', 'f(x) = x² + 2x + 1', ['f(x) = 2x + 1', 'f(x) = 7', 'f(x) = 1/x'], 3],
      ]),
    },
  },
  ciencias: {
    '9': {
      estrutura_atomica: prepareQuestions('ciencias', 'estrutura_atomica', [
        ['Qual partícula possui carga elétrica negativa?', 'Elétron', ['Próton', 'Nêutron', 'Núcleo'], 0],
        ['O número atômico de um elemento corresponde ao número de:', 'prótons no núcleo.', ['nêutrons mais elétrons.', 'camadas eletrônicas.', 'moléculas no material.'], 1],
        ['Em uma ligação iônica, em geral ocorre:', 'transferência de elétrons entre átomos.', ['compartilhamento igual de prótons.', 'desaparecimento dos núcleos.', 'separação de nêutrons do átomo.'], 2],
      ]),
      fisica: prepareQuestions('ciencias', 'fisica', [
        ['Um ciclista percorre 90 km em 3 horas. Qual é sua velocidade média?', '30 km/h', ['27 km/h', '45 km/h', '270 km/h'], 3],
        ['De acordo com a lei da inércia, um corpo tende a:', 'manter seu estado de repouso ou de movimento retilíneo uniforme se a força resultante for nula.', ['aumentar a velocidade sem ação de forças.', 'mudar de direção continuamente.', 'parar sempre que estiver em movimento.'], 0],
        ['Se uma força resultante de 12 N atua sobre uma massa de 3 kg, qual é a aceleração?', '4 m/s²', ['9 m/s²', '15 m/s²', '36 m/s²'], 1],
      ]),
      genetica_evolucao: prepareQuestions('ciencias', 'genetica_evolucao', [
        ['Os genes são segmentos de DNA que:', 'contêm informações relacionadas a características hereditárias.', ['produzem energia sem relação com as células.', 'formam apenas os ossos.', 'existem somente em células vegetais.'], 2],
        ['Na formação dos gametas, os alelos de um par se separam. Essa ideia está associada à:', 'primeira lei de Mendel.', ['lei da gravitação universal.', 'lei da conservação de energia.', 'teoria da geração espontânea.'], 3],
        ['Na seleção natural, indivíduos com características vantajosas em determinado ambiente tendem a:', 'deixar mais descendentes ao longo das gerações.', ['transformar-se por vontade própria.', 'deixar de transmitir qualquer característica.', 'ser sempre maiores que os demais.'], 0],
      ]),
      astronomia: prepareQuestions('ciencias', 'astronomia', [
        ['Qual estrela está no centro do Sistema Solar?', 'O Sol', ['A Lua', 'Sirius', 'A Terra'], 1],
        ['A Via Láctea é:', 'a galáxia onde está localizado o Sistema Solar.', ['um planeta gasoso.', 'uma estrela que orbita a Terra.', 'uma constelação do Sistema Solar.'], 2],
        ['As constelações são:', 'padrões aparentes formados por estrelas vistos da Terra.', ['grupos de planetas ligados fisicamente.', 'estrelas sempre próximas umas das outras no espaço.', 'satélites artificiais em órbita.'], 3],
        ['Durante a maior parte de sua vida, uma estrela produz energia principalmente por:', 'fusão nuclear em seu interior.', ['combustão de oxigênio como uma fogueira.', 'reflexão da luz dos planetas.', 'atração elétrica da Lua.'], 0],
      ]),
    },
  },
  historia: {
    '9': {
      brasil_republica: prepareQuestions('historia', 'brasil_republica', [
        ['Na Primeira República brasileira, o coronelismo esteve relacionado:', 'ao poder local de chefes políticos e às relações de dependência eleitoral.', ['ao voto secreto universal já plenamente garantido.', 'à ausência de elites rurais na política.', 'à eleição direta de todos os governantes locais.'], 1],
        ['A abolição da escravidão no Brasil ocorreu em:', '1888, com a assinatura da Lei Áurea.', ['1822, com a Independência.', '1889, com a Proclamação da República.', '1930, com o início da Era Vargas.'], 2],
        ['Durante a Era Vargas, a CLT, criada em 1943, reuniu principalmente:', 'normas relacionadas aos direitos e às relações de trabalho.', ['leis para restaurar a monarquia.', 'acordos de criação da ONU.', 'regras para abolir eleições municipais.'], 3],
      ]),
      guerras_mundiais: prepareQuestions('historia', 'guerras_mundiais', [
        ['Uma causa de longo prazo da Primeira Guerra Mundial foi:', 'a rivalidade imperialista e militar entre potências europeias.', ['a disputa entre Estados Unidos e União Soviética após 1945.', 'a criação da União Europeia.', 'a independência das colônias americanas no século XVIII.'], 0],
        ['A Revolução Russa de 1917 levou à:', 'queda do czarismo e à ascensão dos bolcheviques.', ['unificação imediata da Alemanha.', 'restauração do Império Romano.', 'criação da Liga das Nações em Moscou.'], 1],
        ['A crise econômica de 1929 começou com a quebra da Bolsa de Valores de:', 'Nova York.', ['Londres.', 'Tóquio.', 'Buenos Aires.'], 2],
      ]),
      guerra_fria_ditaduras: prepareQuestions('historia', 'guerra_fria_ditaduras', [
        ['A Guerra Fria foi marcada principalmente pela rivalidade entre:', 'Estados Unidos e União Soviética.', ['Brasil e Argentina.', 'França e Portugal.', 'China e Japão na Antiguidade.'], 3],
        ['A expressão “guerra fria” indica que as superpotências:', 'competiam e se enfrentavam indiretamente, sem uma guerra direta total entre elas.', ['não tinham conflitos políticos ou militares.', 'mantinham um único governo compartilhado.', 'travavam apenas guerras dentro da Europa ocidental.'], 0],
        ['Durante a ditadura militar brasileira (1964–1985), houve:', 'censura e restrições a direitos políticos e liberdades civis.', ['eleições presidenciais diretas em todos os anos.', 'restauração do governo imperial.', 'fim de qualquer intervenção estatal na política.'], 1],
      ]),
      redemocratizacao: prepareQuestions('historia', 'redemocratizacao', [
        ['A Constituição brasileira atualmente em vigor foi promulgada em:', '1988', ['1964', '1979', '1994'], 2],
        ['A campanha das Diretas Já defendia:', 'eleições diretas para presidente da República.', ['o retorno da monarquia.', 'a extinção do Congresso Nacional.', 'a prorrogação da ditadura militar.'], 3],
        ['A redemocratização brasileira representou a:', 'retomada gradual de instituições democráticas e direitos políticos.', ['substituição da República por uma monarquia.', 'suspensão permanente das eleições.', 'extinção da Constituição.'], 0],
        ['A Constituição de 1988 ficou conhecida como Constituição Cidadã por ampliar:', 'direitos civis, políticos e sociais.', ['o poder hereditário do imperador.', 'a censura prévia à imprensa.', 'a proibição de participação política.'], 1],
      ]),
    },
  },
  geografia: {
    '9': {
      geopolitica: prepareQuestions('geografia', 'geopolitica', [
        ['A atuação de uma organização internacional pode influenciar países por meio de:', 'cooperação, acordos e discussões de questões comuns.', ['substituição automática de todos os governos nacionais.', 'eliminação das culturas locais.', 'proibição de qualquer comércio entre países.'], 2],
        ['Globalização é um processo associado à intensificação de:', 'fluxos de mercadorias, informações, capitais e pessoas entre lugares.', ['isolamento total das economias nacionais.', 'redução das comunicações mundiais.', 'desaparecimento de todas as fronteiras políticas.'], 3],
        ['O respeito à diversidade cultural envolve:', 'reconhecer diferentes identidades e combater discriminações.', ['considerar uma cultura superior às demais.', 'impedir que minorias expressem suas tradições.', 'uniformizar os costumes de todos os povos.'], 0],
      ]),
      economia_global: prepareQuestions('geografia', 'economia_global', [
        ['A divisão internacional do trabalho descreve:', 'como atividades produtivas se distribuem e se relacionam entre países.', ['a divisão de um país em estados.', 'a organização das horas de lazer de uma cidade.', 'a separação entre zonas climáticas.'], 1],
        ['Uma cadeia produtiva global pode envolver:', 'matérias-primas, fabricação e distribuição em diferentes países.', ['todas as etapas concentradas necessariamente em uma casa.', 'somente atividades agrícolas locais.', 'o fim do transporte de mercadorias.'], 2],
        ['A urbanização corresponde ao:', 'crescimento da população urbana e à expansão das cidades.', ['aumento exclusivo da população rural.', 'desaparecimento das atividades industriais.', 'retorno de toda a população às áreas agrícolas.'], 3],
        ['O desemprego estrutural pode ocorrer quando:', 'mudanças tecnológicas e produtivas alteram as ocupações disponíveis.', ['a população deixa de precisar de serviços.', 'todos os trabalhadores passam a ter o mesmo emprego.', 'as cidades não têm atividades econômicas.'], 0],
      ]),
      regioes_brasil: prepareQuestions('geografia', 'regioes_brasil', [
        ['Uma característica comum a mapas temáticos é:', 'representar espacialmente um tema ou conjunto específico de dados.', ['mostrar apenas fronteiras sem informação temática.', 'não usar legenda nem escala.', 'substituir toda análise por texto corrido.'], 1],
        ['Ao comparar indicadores de duas regiões, é importante verificar:', 'a fonte, o período e a unidade dos dados apresentados.', ['somente a cor usada no mapa.', 'o tamanho da página impressa.', 'a posição do título em relação à legenda.'], 2],
        ['O uso de projeções cartográficas pode alterar a representação de:', 'áreas, formas, distâncias ou direções na superfície terrestre.', ['a existência dos continentes.', 'o número de oceanos.', 'a rotação da Terra.'], 3],
      ]),
      eurasia_oceania: prepareQuestions('geografia', 'eurasia_oceania', [
        ['Europa e Ásia formam uma grande massa continental chamada:', 'Eurásia.', ['Oceania.', 'Afro-Eurásia insular.', 'Antártida.'], 0],
        ['Qual fator ajuda a explicar a variedade de paisagens da Ásia?', 'Sua grande extensão territorial e diversidade de climas e relevos.', ['A ausência de montanhas e desertos.', 'A localização inteira dentro da zona polar.', 'A inexistência de grandes rios.'], 1],
        ['A Oceania inclui:', 'a Austrália, a Nova Zelândia e numerosos países e ilhas do Pacífico.', ['somente a Antártida.', 'apenas países europeus banhados pelo Atlântico.', 'todas as ilhas do Caribe.'], 2],
        ['A Antártida tem importância geopolítica também por:', 'sua relevância científica e ambiental e pelo interesse em seus recursos.', ['ser o continente mais densamente povoado.', 'concentrar todas as capitais da Oceania.', 'não ter qualquer importância para pesquisas.'], 3],
        ['Ao estudar uma paisagem da Europa, Ásia ou Oceania, a Geografia relaciona:', 'elementos naturais e modos de ocupação e vida das populações.', ['somente os nomes dos países.', 'apenas as fronteiras políticas.', 'exclusivamente o idioma oficial.'], 0],
      ]),
      recursos_sustentabilidade: prepareQuestions('geografia', 'recursos_sustentabilidade', [
        ['A energia eólica é obtida principalmente a partir:', 'do movimento dos ventos.', ['da queima de carvão.', 'da fissão de urânio.', 'do movimento das marés apenas.'], 1],
        ['Uma matriz energética diversificada pode contribuir para:', 'reduzir a dependência de uma única fonte de energia.', ['eliminar toda necessidade de planejamento.', 'impedir o uso de eletricidade.', 'tornar todas as fontes igualmente poluentes.'], 2],
        ['O uso sustentável de recursos naturais busca:', 'atender necessidades atuais sem comprometer as gerações futuras.', ['consumir recursos no menor tempo possível.', 'substituir ecossistemas por áreas urbanas.', 'impedir toda atividade econômica.'], 3],
        ['A industrialização pode transformar paisagens e o trabalho porque:', 'altera técnicas de produção, circulação de mercadorias e usos do território.', ['não utiliza recursos nem energia.', 'elimina a necessidade de transportes.', 'mantém a paisagem e as ocupações sempre idênticas.'], 0],
        ['Uma consequência possível do uso intensivo de combustíveis fósseis é:', 'o aumento das emissões de gases de efeito estufa.', ['a eliminação do efeito estufa natural.', 'a redução automática da temperatura global.', 'a produção de energia sem impactos ambientais.'], 1],
      ]),
    },
  },
  ingles: {
    '9': {
      future_forms: prepareQuestions('ingles', 'future_forms', [
        ['Choose the correct completion: “I think our team ___ the match.”', 'will win', ['wins yesterday', 'winning', 'has win'], 2],
        ['“Look at those clouds! It ___ rain.” Choose the best option.', 'is going to', ['went to', 'was going', 'has going to'], 3],
        ['Which sentence expresses a spontaneous decision?', '“The phone is ringing. I will answer it.”', ['“I answered it yesterday.”', '“I am answered it now.”', '“I have answer it.”'], 0],
      ]),
      present_perfect: prepareQuestions('ingles', 'present_perfect', [
        ['Choose the correct Present Perfect form: “They ___ the project.”', 'have finished', ['has finish', 'did finished', 'are finish'], 2],
        ['Which word commonly appears with the Present Perfect to describe life experience?', 'ever', ['yesterday', 'tomorrow', 'last week'], 3],
        ['Complete: “She has lived here ___ 2020.”', 'since', ['for', 'during', 'ago'], 0],
      ]),
      conditionals: prepareQuestions('ingles', 'conditionals', [
        ['Complete the First Conditional: “If you study, you ___ the test.”', 'will pass', ['passed', 'would passed', 'passing'], 1],
        ['Which sentence expresses a general fact (Zero Conditional)?', '“If you heat ice, it melts.”', ['“If it rains tomorrow, I will stay home.”', '“If I had more time, I would travel.”', '“If she studied, she will pass.”'], 2],
        ['Complete the Second Conditional: “If I ___ more free time, I would learn Japanese.”', 'had', ['have', 'will have', 'am having'], 3],
        ['In a conditional sentence, “unless” usually means:', 'if not.', ['because.', 'as soon as.', 'even though.'], 0],
      ]),
      interpretacao_textual: prepareQuestions('ingles', 'interpretacao_textual', [
        ['In an argumentative text, a fact is:', 'a statement that can be checked using evidence.', ['a personal preference only.', 'a sentence with a question mark.', 'an unsupported prediction.'], 1],
        ['In an advertisement, persuasive language is mainly used to:', 'influence the audience’s opinion or choices.', ['hide every message from the audience.', 'report only historical dates.', 'replace all images with numbers.'], 2],
        ['Which connector indicates contrast?', 'however', ['because', 'therefore', 'in addition'], 3],
        ['Before sharing an online article, it is important to check:', 'who published it and whether reliable evidence supports its claims.', ['only the number of emojis in it.', 'whether its headline is written in capital letters.', 'if it agrees with every opinion you already have.'], 0],
        ['The main idea of a text is:', 'the central information or message developed by the author.', ['always the last word of each paragraph.', 'a detail unrelated to the subject.', 'the title copied without reading.'], 1],
      ]),
    },
  },
  arte: {
    '9': {
      artes_visuais_9: prepareQuestions('arte', 'artes_visuais_9', [
        ['Uma instalação artística contemporânea costuma:', 'organizar objetos e elementos em um espaço para criar uma experiência para o público.', ['ser obrigatoriamente uma pintura de paisagem.', 'reproduzir somente esculturas da Antiguidade.', 'dispensar qualquer relação com o espaço.'], 2],
        ['Em uma obra visual, linhas, formas, cores e texturas são:', 'elementos que podem ser organizados para construir significados.', ['regras exclusivas da música.', 'materiais que não podem ser combinados.', 'elementos sem relação com a composição.'], 3],
        ['O trabalho de curadoria em uma exposição inclui:', 'selecionar e organizar obras e informações para o público.', ['fabricar todas as obras expostas.', 'impedir a contextualização das obras.', 'substituir os artistas durante a criação.'], 0],
      ]),
      teatro_danca_9: prepareQuestions('arte', 'teatro_danca_9', [
        ['Na criação de uma coreografia, os movimentos podem ser organizados considerando:', 'tempo, espaço, gestos e relações entre os dançarinos.', ['somente a cor das roupas.', 'apenas a duração do intervalo.', 'a exclusão de qualquer ritmo.'], 1],
        ['Uma produção teatral pode comunicar sentidos por meio de:', 'atuação, texto, cenário, figurino, iluminação e som.', ['somente a lista de espectadores.', 'apenas as instruções de montagem do palco.', 'exclusivamente a bilheteria.'], 2],
        ['Ao criar uma dança que dialoga com uma tradição cultural, é importante:', 'pesquisar e respeitar os contextos e as pessoas ligados a essa tradição.', ['copiar gestos sem conhecer seu contexto.', 'afirmar que todas as danças têm a mesma origem.', 'apagar as referências culturais da criação.'], 3],
        ['A dança contemporânea se caracteriza por:', 'explorar diferentes movimentos, ideias e formas de composição.', ['permitir apenas passos de uma dança específica.', 'proibir improvisação e experimentação.', 'usar sempre a mesma música e o mesmo figurino.'], 0],
      ]),
      musica_9: prepareQuestions('arte', 'musica_9', [
        ['Qual alternativa apresenta elementos que podem ser analisados em uma música?', 'ritmo, timbre, melodia e dinâmica.', ['legenda, escala cartográfica e relevo.', 'parágrafo, rima obrigatória e pontuação.', 'ângulo, perímetro e volume.'], 1],
        ['O timbre permite distinguir:', 'fontes sonoras diferentes, mesmo quando produzem a mesma nota.', ['o número de versos de um poema.', 'a velocidade de uma pintura.', 'a duração de uma peça teatral apenas.'], 2],
        ['Uma apreciação musical crítica considera:', 'elementos sonoros e o contexto de criação e circulação da obra.', ['somente a popularidade da canção.', 'apenas a idade do instrumento.', 'se a música tem exatamente quatro versos.'], 3],
        ['Uma partitura é uma forma de:', 'registrar informações para orientar a execução musical.', ['medir a intensidade da luz.', 'representar fronteiras de países.', 'escrever somente diálogos teatrais.'], 0],
        ['Ao criar um jingle, o grupo pode combinar música e texto para:', 'comunicar uma ideia de modo expressivo e adequado ao público.', ['eliminar qualquer mensagem.', 'reproduzir uma notícia sem considerar o contexto.', 'garantir que todos os sons tenham o mesmo timbre.'], 1],
      ]),
    },
  },
  ed_fisica: {
    '9': {
      esportes_9: prepareQuestions('ed_fisica', 'esportes_9', [
        ['No voleibol, o saque é:', 'a ação que inicia uma jogada ao enviar a bola para a quadra adversária.', ['um tipo de bloqueio junto à rede.', 'uma substituição de jogadores.', 'o movimento que encerra cada set automaticamente.'], 2],
        ['Em esportes de invasão, uma equipe busca principalmente:', 'avançar pelo espaço adversário e alcançar o alvo, respeitando as regras.', ['derrubar a rede da quadra.', 'evitar qualquer cooperação entre os jogadores.', 'marcar pontos sem interagir com o adversário.'], 3],
        ['No beisebol, o confronto entre ataque e defesa envolve:', 'rebater a bola e percorrer as bases antes que a defesa elimine o corredor.', ['marcar um gol com os pés em uma rede.', 'arremessar a bola para uma cesta elevada.', 'tocar a bola três vezes antes de cruzar uma rede.'], 0],
      ]),
      ginastica_9: prepareQuestions('ed_fisica', 'ginastica_9', [
        ['Antes de iniciar um programa de exercícios, é importante:', 'considerar as condições e necessidades individuais e buscar orientação adequada.', ['copiar a carga de outra pessoa sem avaliação.', 'ignorar sinais de dor e cansaço.', 'treinar sem descanso em qualquer situação.'], 1],
        ['Uma prática de alongamento pode contribuir para:', 'a mobilidade e a percepção corporal, quando feita de forma adequada.', ['eliminar a necessidade de toda atividade física.', 'garantir resultado esportivo imediato.', 'substituir qualquer cuidado com a saúde.'], 2],
        ['A ginástica laboral é realizada principalmente para:', 'promover movimento e bem-estar em contextos de trabalho.', ['substituir todas as modalidades esportivas.', 'preparar exclusivamente atletas profissionais.', 'impedir pausas e mudanças de postura.'], 3],
        ['Uma diferença entre ginástica de condicionamento e de conscientização corporal é que:', 'a primeira enfatiza capacidades físicas e a segunda também explora percepção e controle do corpo.', ['as duas proíbem a atenção ao movimento.', 'a primeira só pode ser praticada sentado.', 'a segunda não envolve movimentos corporais.'], 0],
      ]),
      praticas_aventura_9: prepareQuestions('ed_fisica', 'praticas_aventura_9', [
        ['Antes de praticar rapel ou tirolesa, é fundamental:', 'verificar equipamentos e seguir procedimentos de segurança com orientação qualificada.', ['usar equipamentos improvisados.', 'ignorar as condições do local.', 'praticar sem conhecer os riscos.'], 1],
        ['Uma prática corporal de aventura na natureza deve buscar:', 'minimizar impactos ambientais e respeitar o patrimônio natural.', ['deixar resíduos para marcar o percurso.', 'remover plantas para facilitar a passagem.', 'desconsiderar as regras da área visitada.'], 2],
        ['Ao planejar uma caminhada em trilha, o grupo deve:', 'avaliar o percurso, prever riscos e levar equipamentos adequados.', ['sair sem informar o destino a ninguém.', 'escolher qualquer caminho sem consultar o clima.', 'separar-se do grupo sem comunicação.'], 3],
        ['O uso de capacete em atividades como ciclismo de montanha serve para:', 'reduzir o risco de lesões na cabeça em caso de queda.', ['substituir todos os demais equipamentos.', 'aumentar a velocidade da bicicleta.', 'dispensar a escolha de uma rota segura.'], 0],
      ]),
      dancas_9: prepareQuestions('ed_fisica', 'dancas_9', [
        ['Ao participar de danças de salão com um grupo, é importante:', 'respeitar os parceiros e reconhecer a diversidade das tradições culturais.', ['ridicularizar quem está aprendendo.', 'impor um único estilo a todas as pessoas.', 'evitar qualquer cooperação.'], 1],
        ['Ritmo, espaço e gestos são elementos que ajudam a:', 'organizar e expressar movimentos na dança.', ['determinar o resultado de uma partida de voleibol.', 'substituir todas as regras de segurança.', 'classificar modalidades de natação.'], 2],
        ['Propor alternativas a estereótipos na dança significa:', 'questionar preconceitos e ampliar a participação de diferentes pessoas.', ['proibir determinados grupos de dançar.', 'afirmar que movimentos definem o valor de alguém.', 'rejeitar todas as manifestações culturais.'], 3],
        ['As danças de salão se caracterizam, entre outros aspectos, por:', 'movimentos ritmados realizados em interação com um par ou grupo.', ['ser praticadas somente em competições olímpicas.', 'não utilizar música nem ritmo.', 'proibir a comunicação entre os participantes.'], 0],
        ['Conhecer a história de uma dança ajuda a:', 'compreender suas origens, transformações e significados culturais.', ['definir que apenas uma forma de dançar é correta.', 'eliminar diferenças entre as tradições.', 'impedir novas criações coreográficas.'], 1],
      ]),
    },
  },
  religiao: {
    '9': {
      direitos_humanos: prepareQuestions('religiao', 'direitos_humanos', [
        ['Respeitar a liberdade religiosa significa:', 'proteger o direito de ter, mudar ou não seguir uma crença, sem discriminação.', ['exigir que todos pratiquem a mesma religião.', 'impedir a expressão de convicções pessoais.', 'privilegiar pessoas por sua crença.'], 2],
        ['A dignidade humana deve ser reconhecida:', 'em todas as pessoas, independentemente de suas crenças ou origens.', ['somente em quem pertence à maioria.', 'apenas em adultos com a mesma opinião.', 'de acordo com a religião de cada cidadão.'], 3],
        ['O diálogo entre pessoas com diferentes visões de mundo deve se basear em:', 'escuta, respeito e disposição para conviver com diferenças.', ['imposição e desqualificação.', 'competição para silenciar o outro.', 'obrigação de concordar em tudo.'], 0],
      ]),
      convivencia: prepareQuestions('religiao', 'convivencia', [
        ['Diferentes tradições religiosas podem compreender a imortalidade por meio de:', 'ideias como ancestralidade, reencarnação ou ressurreição.', ['uma única interpretação obrigatória para todas.', 'apenas resultados de experimentos físicos.', 'regras iguais em todas as culturas.'], 1],
        ['Um projeto de vida baseado em valores éticos envolve:', 'refletir sobre objetivos e agir com responsabilidade e respeito.', ['desconsiderar as consequências das próprias escolhas.', 'impedir que outras pessoas façam planos.', 'abandonar qualquer princípio de convivência.'], 2],
        ['Diante de uma crença diferente da sua, uma atitude ética é:', 'ouvir e respeitar a pessoa sem impor sua própria crença.', ['fazer piadas para constrangê-la.', 'exigir que ela mude de religião.', 'negar sua participação na comunidade.'], 3],
        ['A convivência democrática se fortalece quando as pessoas:', 'dialogam e reconhecem igualmente a dignidade umas das outras.', ['usam a força para encerrar divergências.', 'excluem quem tem outra tradição.', 'evitam respeitar direitos individuais.'], 0],
      ]),
    },
  },
};

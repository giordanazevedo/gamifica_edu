import React, { useState, useEffect } from 'react';

const educationalPairs = {
  matematica: [
    { a: 'Raiz de 25', b: '5' },
    { a: '10 x 10', b: '100' },
    { a: 'Metade de 50', b: '25' },
    { a: '7 x 8', b: '56' },
    { a: '1/2', b: '0,5' },
    { a: 'Uma Dúzia', b: '12' }
  ],
  portugues: [
    { a: 'Verbo', b: 'Ação' },
    { a: 'Sinônimo de Feliz', b: 'Alegre' },
    { a: 'Antônimo de Bom', b: 'Mau' },
    { a: 'Substantivo', b: 'Dá Nome' },
    { a: 'Adjetivo', b: 'Qualidade' },
    { a: 'Pronome', b: 'Substitui Nome' }
  ],
  geografia: [
    { a: 'Capital do Brasil', b: 'Brasília' },
    { a: 'Nossa Galáxia', b: 'Via Láctea' },
    { a: 'Maior Oceano', b: 'Pacífico' },
    { a: 'Nosso Continente', b: 'América' },
    { a: 'Equador', b: 'Divide ao Meio' },
    { a: 'Bússola', b: 'Norte' }
  ],
  ciencias: [
    { a: 'H2O', b: 'Água' },
    { a: 'Fotossíntese', b: 'Plantas' },
    { a: 'Planeta Vermelho', b: 'Marte' },
    { a: 'Centro do Sistema', b: 'Sol' },
    { a: 'Pulmões', b: 'Respiração' },
    { a: 'Coração', b: 'Bombeia Sangue' }
  ],
  historia: [
    { a: 'Descobrimento', b: '1500' },
    { a: 'Proclamação República', b: '1889' },
    { a: 'Independência', b: '1822' },
    { a: '1º Presidente', b: 'Deodoro' },
    { a: 'Faraós', b: 'Egito Antigo' },
    { a: 'Coliseu', b: 'Roma' }
  ],
  ingles: [
    { a: 'Red', b: 'Vermelho' },
    { a: 'Blue', b: 'Azul' },
    { a: 'Dog', b: 'Cachorro' },
    { a: 'Cat', b: 'Gato' },
    { a: 'Apple', b: 'Maçã' },
    { a: 'Sun', b: 'Sol' }
  ],
  arte: [
    { a: 'Monalisa', b: 'Da Vinci' },
    { a: 'Abaporu', b: 'Tarsila' },
    { a: 'Cores Primárias', b: 'Amarelo, Azul, Verm.' },
    { a: 'Escultura', b: 'Arte 3D' },
    { a: 'Música', b: 'Sons' },
    { a: 'Teatro', b: 'Atuação' }
  ],
  ed_fisica: [
    { a: 'Futebol', b: '11 Jogadores' },
    { a: 'Vôlei', b: 'Rede' },
    { a: 'Basquete', b: 'Cesta' },
    { a: 'Natação', b: 'Piscina' },
    { a: 'Atletismo', b: 'Corridas' },
    { a: 'Olimpíadas', b: 'Medalhas de Ouro' }
  ],
  religiao: [
    { a: 'Bíblia', b: 'Cristianismo' },
    { a: 'Torá', b: 'Judaísmo' },
    { a: 'Alcorão', b: 'Islamismo' },
    { a: 'Monoteísmo', b: '1 Deus' },
    { a: 'Politeísmo', b: 'Vários Deuses' },
    { a: 'Regra de Ouro', b: 'Fazer o Bem' }
  ]
};

export default function MemoryGame({ subjectId, onWin, onClose }) {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    // Pegar os pares da matéria atual, ou matemática por padrão
    const pairs = educationalPairs[subjectId] || educationalPairs.matematica;
    
    // Transformar os pares em 12 cartas individuais
    let deck = [];
    pairs.forEach((pair, index) => {
      deck.push({ id: `a_${index}`, matchId: index, text: pair.a });
      deck.push({ id: `b_${index}`, matchId: index, text: pair.b });
    });

    // Embaralhar
    deck = deck.sort(() => Math.random() - 0.5);
    setCards(deck);
  }, [subjectId]);

  const handleCardClick = (index) => {
    if (disabled || flippedIndices.includes(index) || matchedIds.includes(cards[index].matchId)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const [firstIndex, secondIndex] = newFlipped;
      
      // Se tiverem o mesmo matchId, é um par correto! (ex: "Verbo" e "Ação")
      if (cards[firstIndex].matchId === cards[secondIndex].matchId) {
        setMatchedIds(prev => [...prev, cards[firstIndex].matchId]);
        setFlippedIndices([]);
        setDisabled(false);
        
        // São 6 pares no total
        if (matchedIds.length + 1 === cards.length / 2) {
          setWon(true);
          setTimeout(() => {
            onWin(200); // 200 XP por ganhar
          }, 1500);
        }
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
          setDisabled(false);
        }, 1500); // Tempo maior pra pessoa poder ler o texto e memorizar
      }
    }
  };

  return (
    <div className="memory-game-overlay">
      <div className="memory-game-modal glass-card">
        <div className="memory-header">
          <h2>🧠 Fixação de Conteúdo</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <p className="text-center" style={{marginBottom: '1.5rem', color: 'var(--text-muted)'}}>
          Ligue as palavras aos seus pares corretos na matéria atual para ganhar recompensas!
        </p>

        {won ? (
          <div className="victory-screen text-center">
            <div className="trophy" style={{fontSize: '5rem'}}>🏆</div>
            <h3 className="text-gradient" style={{fontSize: '2rem'}}>Mente Brilhante!</h3>
            <p>+200 XP e +1 Vida adicionados na sua conta.</p>
            <button className="btn-primary" onClick={onClose} style={{marginTop: '1rem'}}>
              Voltar ao Painel
            </button>
          </div>
        ) : (
          <div className="memory-grid">
            {cards.map((card, index) => {
              const isFlipped = flippedIndices.includes(index) || matchedIds.includes(card.matchId);
              return (
                <div 
                  key={card.id} 
                  className={`memory-card ${isFlipped ? 'flipped' : ''}`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="card-inner">
                    <div className="card-front text-gradient" style={{fontSize: '3rem'}}>?</div>
                    <div className="card-back">
                      <span className="card-text">{card.text}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .memory-game-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .memory-game-modal {
          background: white;
          padding: 2rem;
          width: 95%;
          max-width: 600px;
          border-radius: var(--radius-lg);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          border: 4px solid var(--primary);
        }

        .memory-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .memory-header h2 {
          color: var(--primary);
          margin: 0;
        }

        .close-btn {
          background: var(--danger-light);
          color: var(--danger);
          border: none;
          width: 35px; height: 35px;
          border-radius: 50%;
          font-weight: bold;
          cursor: pointer;
        }

        .memory-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          perspective: 1000px;
        }

        .memory-card {
          aspect-ratio: 1.2;
          cursor: pointer;
          transform-style: preserve-3d;
          transition: transform 0.5s;
          position: relative;
        }

        .memory-card.flipped .card-inner {
          transform: rotateY(180deg);
        }

        .card-inner {
          width: 100%; height: 100%;
          position: relative;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-style: preserve-3d;
        }

        .card-front, .card-back {
          position: absolute;
          width: 100%; height: 100%;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          padding: 5px;
        }

        .card-front {
          background: linear-gradient(135deg, var(--primary-light), var(--secondary-light));
          border: 2px solid var(--primary);
          color: white;
          font-weight: 900;
        }

        .card-back {
          background: white;
          transform: rotateY(180deg);
          border: 2px solid var(--primary);
        }
        
        .card-text {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.2;
        }

        .victory-screen {
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @media (max-width: 600px) {
          .memory-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .memory-card { aspect-ratio: 1; }
          .card-text { font-size: 0.8rem; }
        }
      `}</style>
    </div>
  );
}

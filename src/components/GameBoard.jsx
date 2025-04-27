import React, { useEffect, useState } from "react";

import Header from "./Header";
import Card from "./Card";
import ScoreCard from "./ScoreCard";

export default function GameBoard() {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState(null);

  const [cards, setCards] = useState([
    { id: 0, name: null, description: null, imgUrl: null },
    { id: 1, name: null, description: null, imgUrl: null },
    { id: 2, name: null, description: null, imgUrl: null },
    { id: 3, name: null, description: null, imgUrl: null },
    { id: 4, name: null, description: null, imgUrl: null },
    { id: 5, name: null, description: null, imgUrl: null },
    { id: 6, name: null, description: null, imgUrl: null },
    { id: 7, name: null, description: null, imgUrl: null },
    { id: 8, name: null, description: null, imgUrl: null },
    { id: 9, name: null, description: null, imgUrl: null },
  ]);


  // Score and game state
  const [score, setScore] = useState(0);
  const [highscore, setHighscore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [gameState, setGameState] = useState(true);
  const [visited, setVisited] = useState([]);

  // Generate random indices for the Valorant agents
  const generateRandomIndices = () => {
    if (!jsonData) return [];

    const max = jsonData.length - 1;
    const min = 0;

    const tempArray = Array.from(
      { length: max - min + 1 },
      (_, i) => i + min
    ).filter((num) => num !== 10);

    // Shuffle the array using Fisher-Yates algorithm
    for (let i = tempArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
    }

    return tempArray.slice(0, cards.length);
  };

  const handleCardClick = (name) => {
    if (isFlipped) return; // Prevent clicking during flip animation
    setIsFlipped(true);

    setTimeout(() => {
      if (visited.includes(name)) {
        setGameState(false);
      } else {
        setVisited((prevVisited) => [...prevVisited, name]);
        handleScore();

        const newRandomIndices = generateRandomIndices();
        updateCardsWithAgentData(newRandomIndices);
      }
      setIsFlipped(false);
    }, 600);
  };

  // Fetch Valorant agents data
  useEffect(() => {
    async function getAgentData() {
      const fetchUrl = "https://valorant-api.com/v1/agents";
      setLoading(true);

      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const tempData = await response.json();
        // Filter out any invalid agents if needed
        const validAgents = tempData.data.filter(
          (agent) => agent && agent.displayName && agent.fullPortrait
        );
        setJsonData(validAgents);
        setError(null);
      } catch (err) {
        console.error(`Error while fetching: ${err.message}`);
        setError("Failed to load agent data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    getAgentData();
  }, []);

  // Initialize cards once data is loaded
  useEffect(() => {
    if (jsonData && jsonData.length > 0) {
      const newRandomIndices = generateRandomIndices();
      updateCardsWithAgentData(newRandomIndices);
    }
  }, [jsonData]);

  // Update cards with agent data using the random indices
  function updateCardsWithAgentData(randomIndices) {
    if (!jsonData || !randomIndices || randomIndices.length === 0) return;

    const updatedCards = cards.map((card, idx) => {
      const agentIndex = randomIndices[idx];

      if (agentIndex === undefined || !jsonData[agentIndex]) {
        console.error(`Invalid agent index: ${agentIndex}`);
        return card;
      }

      const agentData = jsonData[agentIndex];

      return {
        ...card,
        name: agentData.displayName,
        description: agentData.description,
        imgUrl: agentData.fullPortrait,
      };
    });

    setCards(updatedCards);
  }

  // Update score and game state
  function handleScore() {
    if (gameState) {
      const newScore = score + 1;
      setScore(newScore);
      setRounds(rounds + 1);

      if (newScore > highscore) {
        setHighscore(newScore);
        // Store highscore in localStorage for persistence
        localStorage.setItem("valoranteHighscore", newScore);
      }

      if (rounds + 1 === 5) {
        setGameState(false);
      }
    }
  }

  // Reset the game
  function resetBoard() {
    setScore(0);
    setRounds(0);
    setVisited([]);
    setGameState(true);
    setIsFlipped(false);

    const newRandomIndices = generateRandomIndices();
    updateCardsWithAgentData(newRandomIndices);
  }

  // Load highscore from localStorage on component mount
  useEffect(() => {
    const savedHighscore = localStorage.getItem("valoranteHighscore");
    if (savedHighscore) {
      setHighscore(parseInt(savedHighscore, 10));
    }
  }, []);

  return (
    <>
      <header>
        <Header />
        <ScoreCard score={score} highscore={highscore} round={rounds} />
      </header>
      <main>
        {error ? (
          <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : gameState ? (
          <div className="card-container">
            {loading ? (
              <div className="loading-container">
                <h2>Loading Agents...</h2>
                <div className="loading-spinner"></div>
              </div>
            ) : (
              cards.map((card) => {
                const name = card.name || "Unknown Agent";
                const imgUrl = card.imgUrl || "default-image-url.jpg";
                return (
                  <Card
                    key={card.id}
                    name={name}
                    description={card.description}
                    imgUrl={imgUrl}
                    isFlipped={isFlipped}
                    onCardClick={() => handleCardClick(card.name)}
                  />
                );
              })
            )}
          </div>
        ) : (
          <div className="gameover-container">
            <h2>{rounds === 5 ? "You Won!" : "Game Over"}</h2>
            <h2>{rounds === 5 ? "Perfect Memory!" : `You scored: ${score}`}</h2>
            <button className="reset-btn" onClick={resetBoard}>
              Play Again
            </button>
          </div>
        )}
      </main>
    </>
  );
}

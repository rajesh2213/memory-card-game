import React from 'react';

export default function ScoreCard({ score, highscore, round }) {
  return (
    <div className="score-section">
      <div className="score">
        <h2>Score: <span>{score}</span></h2>
      </div>
      <div className="highscore">
        <h2>Highscore: <span>{highscore}</span></h2>
      </div>
      <div className="round">
        <h2>Round <span>{round}</span>/5</h2>
      </div>
    </div>
  );
}
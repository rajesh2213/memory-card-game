import React from 'react';
import Tilt from "react-parallax-tilt";

const Card = ({ name, description, imgUrl, onCardClick, isFlipped }) => {
  return (
    <Tilt
      className="tilt-wrapper"
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      perspective={1500}
      scale={1.02}
      transitionSpeed={800}
      glareEnable={true}
      glareMaxOpacity={0.2}
      glareColor="#ffffff"
      glareBorderRadius="8px"
      reset={true}
    >
      <div
        className={`card ${isFlipped ? "flipped" : ""}`}
        onClick={onCardClick}
        aria-label={`Agent card for ${name}`}
      >
        <div className="card-inner">
          <div className="card-front">
            <div className="img-container">
              <img src={imgUrl} alt={`${name}`} className="agent-img" loading="lazy" />
            </div>
            <div className="text-container">
              <h2 className="agent-name">{name}</h2>
              <p className="agent-desc">{description}</p>
            </div>
          </div>
          <div className="card-back">
            <h2>Good Luck</h2>
          </div>
        </div>
      </div>
    </Tilt>
  );
};

export default Card;

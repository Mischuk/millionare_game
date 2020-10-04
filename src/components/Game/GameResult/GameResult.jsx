import React from "react";
import wrappedLayout from "../../../containers/wrappedLayout";
import Button from "../../Button";
import "./GameResult.scss";

const GameResult = ({ score, steps, resetGame, status }) => {
  let win = steps.find(el => el.id === score - 1);

  return (
    <div className="game-result">
      <div className="game-result__score">
        <div className="game-result__score-label">Total score:</div>
        <div className="game-result__score-value">${win?.cost || 0} earned</div>
      </div>
      <div className="game-result__action">
        <Button event={resetGame}>Try again...</Button>
      </div>
    </div>
  );
};

const layoutConfig = {
  image: true,
  parallax: true,
  backgroundFigure: false,
};

export default wrappedLayout(layoutConfig)(GameResult);

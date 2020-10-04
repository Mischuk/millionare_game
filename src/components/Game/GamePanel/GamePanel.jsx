import React from "react";
import { formatPrice } from "../../../common/formatPrice";
import "./GamePanel.scss";

const GamePanel = ({ panelSteps, currentStep }) => {
  const list = panelSteps.map(({ id, status, cost }) => {
    return (
      <div key={id} className={`game-panel__item ${status}`}>
        <div className="game-panel__label">
          <div className="game-panel__decor-arrow game-panel__decor-arrow--left"></div>
          <div className="game-panel__decor-arrow game-panel__decor-arrow--right"></div>
          <div className="game-panel__value">$ {formatPrice(cost)}</div>
        </div>
      </div>
    );
  });

  return <div className="game-panel">{list}</div>;
};

export default GamePanel;

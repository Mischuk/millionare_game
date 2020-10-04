import React, { useState } from "react";
import { PREFIXES } from "../../../constants/prefixes";
import wrappedLayout from "../../../containers/wrappedLayout";
import MenuButton from "../../MenuButton/MenuButton";
import GamePanel from "../GamePanel";
import "./GameSteps.scss";

const GameSteps = ({
  panelSteps,
  currentQuestion,
  currentStep,
  checkAnswer,
  canSelect,
  debug,
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const { question, answers } = currentQuestion;

  const handleSelect = (e, answer, idx) => {
    if (!canSelect) {
      e.stopPropagation();
      return false;
    }
    checkAnswer(answer, idx);
  };

  const handleToggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <div className={`game-steps ${openMenu ? "is-open" : ""}`}>
      <div className="game-steps__menu" onClick={handleToggleMenu}>
        <MenuButton openMenu={openMenu} />
      </div>

      <div className="game-steps__body">
        <div className="game-steps__question">
          {question}
          {debug && (
            <div className="game-steps__question-debug">
              ({currentQuestion.correct.join(", ")})
            </div>
          )}
        </div>
        <div className="game-steps__answers">
          {answers.map((answer, idx) => (
            <div
              key={idx}
              className={`game-steps__answer ${answer.status}`}
              onClick={e => handleSelect(e, answer.answer, idx)}
            >
              <div className="game-steps__answer-label">
                <div className="game-steps__answer-decor-arrow game-steps__answer-decor-arrow--left"></div>
                <div className="game-steps__answer-decor-arrow game-steps__answer-decor-arrow--right"></div>
                <div className="game-steps__answer-value">
                  <div className="game-steps__answer-prefix">{PREFIXES[idx]}</div>
                  {answer.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`game-steps__sidebar ${openMenu ? "is-open" : ""}`}>
        <GamePanel currentStep={currentStep} panelSteps={panelSteps} />
      </div>
    </div>
  );
};
const layoutConfig = {
  image: false,
  parallax: false,
  backgroundFigure: false,
};

export default wrappedLayout(layoutConfig)(GameSteps);

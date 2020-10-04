import React, { useEffect } from "react";
import {
  IDLE_STATUS,
  GAME_START_STATUS,
  GAME_PLAY_STATUS,
  GAME_END_STATUS,
} from "../../constants/status";
import wrappedGame from "../../containers/wrappedGame";
import GameInitial from "./GameInitial";
import GameResult from "./GameResult";
import GameSteps from "./GameSteps";
import "./Game.scss";

function Game({
  status,
  gameStatus,
  getConfig,
  initialGameSession,
  score,
  steps,
  currentQuestion,
  getQuestion,
  currentStep,
  setStep,
  checkAnswer,
  canSelect,
  resetGame,
  debug,
}) {
  useEffect(() => {
    if (status === IDLE_STATUS) {
      let debug = localStorage.getItem("debug");
      getConfig(debug);
    }
  }, [getConfig, status]);

  return (
    <div className="game">
      {gameStatus === GAME_START_STATUS && (
        <GameInitial
          status={status}
          getQuestion={getQuestion}
          setStep={setStep}
          initialGameSession={initialGameSession}
        />
      )}

      {gameStatus === GAME_PLAY_STATUS && (
        <GameSteps
          currentStep={currentStep}
          panelSteps={steps}
          currentQuestion={currentQuestion}
          checkAnswer={checkAnswer}
          canSelect={canSelect}
          debug={debug}
        />
      )}

      {gameStatus === GAME_END_STATUS && (
        <GameResult status={status} resetGame={resetGame} steps={steps} score={score} />
      )}
    </div>
  );
}

export default wrappedGame(Game);

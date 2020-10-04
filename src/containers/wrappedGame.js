import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  checkAnswer,
  fetchData,
  getQuestion,
  initialGameSession,
  resetGame,
  togglePanelStep,
} from "../actions/steps";

const wrappedGame = Component => {
  const Wrapped = ({ ...props }) => {
    return (
      <div className="wrapped">
        <Component {...props} />
      </div>
    );
  };
  return Wrapped;
};

const mapStateToProps = ({ game }) => {
  const {
    status,
    score,
    steps,
    currentQuestion,
    gameStatus,
    currentStep,
    canSelect,
    debug,
  } = game;
  return {
    status,
    gameStatus,
    score,
    steps,
    currentQuestion,
    currentStep,
    canSelect,
    debug,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getConfig: debug => dispatch(fetchData(debug)),
    initialGameSession: () => dispatch(initialGameSession()),
    getQuestion: () => dispatch(getQuestion()),
    setStep: () => dispatch(togglePanelStep()),
    checkAnswer: (answer, idx) => dispatch(checkAnswer(answer, idx)),
    resetGame: () => dispatch(resetGame()),
  };
};

const composedWrappedGame = compose(
  connect(mapStateToProps, mapDispatchToProps),
  wrappedGame,
);

export default composedWrappedGame;

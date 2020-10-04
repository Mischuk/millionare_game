import React from "react";
import {
  FAILURE_STATUS,
  LOADING_STATUS,
  SUCCESS_STATUS,
} from "../../../constants/status";
import wrappedLayout from "../../../containers/wrappedLayout";
import Button from "../../Button";
import Spinner from "../../Spinner";
import "./GameInitial.scss";

const GameInitial = ({ initialGameSession, getQuestion, status, setStep }) => {
  const starGame = () => {
    initialGameSession();
    getQuestion();
    setStep();
  };
  const loader = status === LOADING_STATUS ? <Spinner /> : null;

  const error =
    status === FAILURE_STATUS ? (
      <div>
        Something went wrong... <br />
        Please, try again.
      </div>
    ) : null;

  const render =
    status === SUCCESS_STATUS ? (
      <>
        <h1 className="game-initial__title">Who wants to be a millionaire?</h1>
        <div className="game-initial__action">
          <Button event={starGame}>Start</Button>
        </div>
      </>
    ) : null;

  return (
    <div className="game-initial">
      {loader}
      {error}
      {render}
    </div>
  );
};

const layoutConfig = {
  image: true,
  parallax: true,
  backgroundFigure: true,
};

export default wrappedLayout(layoutConfig)(GameInitial);

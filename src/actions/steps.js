import GameService from "../api/GameService";
import { shuffleArray } from "../common/shuffleArray";
import { ANSWER_UNSELECTED_STATUS, STEP_OPEN_STATUS } from "../constants/status";
import {
  GET_CONFIG_FAIL,
  GET_CONFIG_REQUEST,
  GET_CONFIG_SUCCESS,
  GET_QUESTION,
  HANDLE_ANSWER_FAIL,
  HANDLE_ANSWER_START,
  HANDLE_ANSWER_SUCCESS,
  INITIAL_GAME_SESSION,
  SET_END_GAME,
  SET_STEP,
  RESET_GAME,
} from "../constants/types";

const gameService = new GameService();
const DELAY_ANSWER = 2000;
export function fetchData(debug) {
  return dispatch => {
    dispatch({
      type: GET_CONFIG_REQUEST,
      payload: debug,
    });

    gameService
      .getConfig()
      .then(data => {
        dispatch({
          type: GET_CONFIG_SUCCESS,
          payload: data,
        });
      })
      .catch(error => {
        dispatch({
          type: GET_CONFIG_FAIL,
          payload: new Error("Fetch error"),
        });
      });
  };
}

// function TransformedStep(value) {
//   this.cost = value;
//   this.status = STEP_OPEN_STATUS;
// }

function TransformedAnswer(value) {
  this.answer = value;
  this.status = ANSWER_UNSELECTED_STATUS;
}

const transformSteps = steps => {
  let transformed = [];

  steps.forEach(step => {
    transformed = [...transformed, { cost: step, status: STEP_OPEN_STATUS }];
  });

  return transformed;
};

function initGameSession(steps, questions) {
  let currentSteps = [];
  let currentQuestions = [];

  for (const key in steps) {
    const currentGroup = questions[key];
    const currentGroupMax = steps[key].length;
    const shuffledQuestions = shuffleArray(currentGroup);
    const selectedQuestions = shuffledQuestions.slice(0, currentGroupMax);
    currentQuestions = [...currentQuestions, ...selectedQuestions];

    if (steps.hasOwnProperty(key)) {
      currentSteps = [...currentSteps, ...transformSteps(steps[key])];
    }
  }

  currentSteps.forEach((el, idx) => {
    el.id = idx;
  });

  return {
    steps: currentSteps.reverse(),
    questions: currentQuestions,
  };
}

export function initialGameSession() {
  return (dispatch, getState) => {
    let {
      game: {
        data: { questions, steps },
      },
    } = getState();

    dispatch({
      type: INITIAL_GAME_SESSION,
      payload: initGameSession(steps, questions),
    });
  };
}

const transformQuestion = ({ question, answers }) => {
  const shuffledAnswers = shuffleArray([...answers.correct, ...answers.incorrect]);

  let transformedAnswers = [];
  shuffledAnswers.forEach(answer => {
    transformedAnswers = [...transformedAnswers, new TransformedAnswer(answer)];
  });

  return {
    question: question,
    correct: answers.correct,
    answers: transformedAnswers,
  };
};

export function getQuestion() {
  return (dispatch, getState) => {
    const {
      game: { sessionQuestions, currentStep },
    } = getState();

    dispatch({
      type: GET_QUESTION,
      payload: transformQuestion(sessionQuestions[currentStep]),
    });
  };
}

export function togglePanelStep() {
  return (dispatch, getState) => {
    dispatch({
      type: SET_STEP,
      payload: getState().game.currentStep,
    });
  };
}

export function checkAnswer(answer, idx) {
  return (dispatch, getState) => {
    const {
      game: { currentQuestion, canSelect, currentStep, sessionQuestions, steps },
    } = getState();

    if (!canSelect) return;

    const correctAnswer = currentQuestion.correct.includes(answer);

    dispatch({
      type: HANDLE_ANSWER_START,
      payload: idx,
    });

    setTimeout(() => {
      if (correctAnswer) {
        dispatch({
          type: HANDLE_ANSWER_SUCCESS,
          payload: idx,
        });

        setTimeout(() => {
          let nextStep = currentStep + 1;
          const totalSteps = steps.length - 1;

          if (nextStep <= totalSteps) {
            dispatch({
              type: SET_STEP,
              payload: nextStep,
            });

            dispatch({
              type: GET_QUESTION,
              payload: transformQuestion(sessionQuestions[nextStep]),
            });
          } else {
            dispatch({
              type: SET_END_GAME,
            });
          }
        }, DELAY_ANSWER);
      } else {
        dispatch({
          type: HANDLE_ANSWER_FAIL,
          payload: idx,
        });

        setTimeout(() => {
          dispatch({
            type: SET_END_GAME,
          });
        }, DELAY_ANSWER);
      }
    }, DELAY_ANSWER);
  };
}

export function resetGame() {
  return dispatch => {
    dispatch({
      type: RESET_GAME,
    });
  };
}

import {
  ANSWER_FAILURE_STATUS,
  ANSWER_SELECTED_STATUS,
  ANSWER_SUCCESS_STATUS,
  FAILURE_STATUS,
  GAME_END_STATUS,
  GAME_PLAY_STATUS,
  GAME_START_STATUS,
  IDLE_STATUS,
  LOADING_STATUS,
  STEP_ACTIVE_STATUS,
  STEP_DISABLED_STATUS,
  SUCCESS_STATUS,
} from "../constants/status";
import {
  GET_CONFIG_FAIL,
  GET_CONFIG_REQUEST,
  GET_CONFIG_SUCCESS,
  GET_QUESTION,
  HANDLE_ANSWER_FAIL,
  HANDLE_ANSWER_START,
  HANDLE_ANSWER_SUCCESS,
  INITIAL_GAME_SESSION,
  RESET_GAME,
  SET_END_GAME,
  SET_STEP,
} from "../constants/types";

const initialState = {
  status: IDLE_STATUS,
  error: null,
  data: null,

  steps: [],
  currentStep: 0,
  score: 0,
  gameStatus: GAME_START_STATUS,
  sessionQuestions: [],
  currentQuestion: {},
  canSelect: false,
  debug: false,
};

export function gameReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CONFIG_REQUEST:
      const debug = action.payload === "true";
      return {
        ...state,
        error: null,
        status: LOADING_STATUS,
        debug: debug,
      };

    case GET_CONFIG_FAIL:
      return { ...state, error: action.payload.message, status: FAILURE_STATUS };

    case GET_CONFIG_SUCCESS:
      return { ...state, data: action.payload.game, status: SUCCESS_STATUS };

    case INITIAL_GAME_SESSION:
      return {
        ...state,
        currentStep: 0,
        sessionQuestions: action.payload.questions,
        steps: action.payload.steps,
        gameStatus: GAME_START_STATUS,
      };

    case GET_QUESTION:
      return {
        ...state,
        currentQuestion: action.payload,
        gameStatus: GAME_PLAY_STATUS,
        canSelect: true,
      };

    case SET_STEP:
      return {
        ...state,
        currentStep: action.payload,
        steps: state.steps.map(el => {
          if (action.payload > 0 && el.id === action.payload - 1) {
            return { ...el, status: STEP_DISABLED_STATUS };
          } else if (el.id === action.payload) {
            return { ...el, status: STEP_ACTIVE_STATUS };
          } else {
            return el;
          }
        }),
      };

    case HANDLE_ANSWER_START:
      return {
        ...state,
        canSelect: false,
        currentQuestion: {
          ...state.currentQuestion,
          answers: state.currentQuestion.answers.map((el, idx) =>
            idx === action.payload ? { ...el, status: ANSWER_SELECTED_STATUS } : el,
          ),
        },
      };

    case HANDLE_ANSWER_SUCCESS:
      return {
        ...state,
        score: state.score + 1,
        currentQuestion: {
          ...state.currentQuestion,
          answers: state.currentQuestion.answers.map((el, idx) =>
            idx === action.payload ? { ...el, status: ANSWER_SUCCESS_STATUS } : el,
          ),
        },
      };

    case HANDLE_ANSWER_FAIL:
      const correctAnswers = state.currentQuestion.correct;
      const answers = state.currentQuestion.answers;
      let correctIdxs = [];
      correctAnswers.forEach(el => {
        let indexs = answers.findIndex(x => x.answer === el);
        correctIdxs.push(indexs);
      });

      return {
        ...state,
        currentQuestion: {
          ...state.currentQuestion,
          answers: state.currentQuestion.answers.map((el, idx) => {
            if (idx === action.payload) {
              return { ...el, status: ANSWER_FAILURE_STATUS };
            } else if (correctIdxs.includes(idx)) {
              return { ...el, status: ANSWER_SUCCESS_STATUS };
            } else {
              return el;
            }
          }),
        },
      };

    case SET_END_GAME:
      return {
        ...state,
        gameStatus: GAME_END_STATUS,
      };

    case RESET_GAME:
      return {
        ...state,
        steps: [],
        currentStep: 0,
        score: 0,
        gameStatus: GAME_START_STATUS,
        sessionQuestions: [],
        currentQuestion: {},
        canSelect: false,
      };

    default:
      return state;
  }
}

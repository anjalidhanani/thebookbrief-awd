import {
  INIT_MAIN,
  SET_CATEGORIES,
  SET_USER_INFO,
} from "./actions";

export interface MainState {
  userInfo: any;
  categories: any;
}

const INITIAL_STATE: MainState = {
  userInfo: null,
  categories: null,
};

export default function main(
  state = INITIAL_STATE,
  action: { type: any; payload: any }
) {
  switch (action.type) {
    case INIT_MAIN:
      return INITIAL_STATE;
    case SET_USER_INFO:
      return { ...state, userInfo: action.payload };
    case SET_CATEGORIES:
      return { ...state, categories: action.payload };
    default:
      return state;
  }
}

import { combineReducers } from "redux";
import main, { MainState } from "./main/reducer";

export interface GlobalState {
  main: MainState;
}

export default combineReducers({
  main: main,
});

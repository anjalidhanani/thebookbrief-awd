import { CategoryInfo } from "../../api/categories";
import { UserInfo } from "../../api/users";

export const SET_USER_INFO: string = "SET_USER_INFO";
export const SET_CATEGORIES: string = "SET_CATEGORIES";
export const INIT_MAIN: string = "INIT_MAIN";

export const setUserInfo = (data: UserInfo) => {
  return { type: SET_USER_INFO, payload: data };
};

export const setCategories = (data: CategoryInfo) => {
  return { type: SET_CATEGORIES, payload: data };
};

export const initMain = () => {
  return { type: INIT_MAIN };
};

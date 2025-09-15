import authRequest from "../utils/authRequest";

export interface CategoryInfo {
  id?: string;
  name: string;
  icon?: string;
  color?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllCategories = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + "/category",
      method: "get",
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getBooksByCategory = (categoryName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + `/category/${encodeURIComponent(categoryName)}`,
      method: "get",
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

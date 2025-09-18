import authRequest from "../utils/authRequest";

export interface CategoryInfo {
  id?: string;
  name: string;
  icon?: string;
  color?: string;
}

export const getAllCategories = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: "/api/categories",
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
      url: `/api/categories/${encodeURIComponent(categoryName)}`,
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

import authRequest from "../utils/authRequest";

export interface iChapter {
  id: number;
  title: string;
  text: string;
}

export interface iBookInfo {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  imageUrl: string;
  aboutTheBook: string;
  author: string;
  category: string;
  buy_amazon: string;
  chapterCount: string;
  language: string;
  readingTime: string;
  rating: number;
  is_free: boolean;
  chapter: iChapter[];
}

export const getBooksByKeyword = (data: {
  keyword: string;
  page: number;
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `/api/search?offset=${data.page}`,
      method: "post",
      data: data,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};


export const getAllFreeBooks = (page: number, limit: number = 20): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `/api/books/free?offset=${page}&limit=${limit}`,
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


export const getFeaturedBook = (page: number = 0, limit: number = 20): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `/api/books/daily-reads?offset=${page}&limit=${limit}`,
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

export const getBookById = (id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: "/api/books/" + id,
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


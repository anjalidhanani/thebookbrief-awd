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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getBooksByKeyword = (data: {
  keyword: string;
  page: number;
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + `/search?offset=${data.page}`,
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


export const getAllFreeBooks = (page: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + `/books/free?offset=${page}`,
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


export const getFeaturedBook = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + "/books/daily-reads",
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
      url: BASE_URL + "/books/id/" + id,
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


import authRequest from "../utils/authRequest";

export interface ReadingListInfo {
  id: string;
  userId: string;
  name: string;
  description?: string;
  bookIds: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getPublicReadingLists = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + "/reading-lists/public",
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

export const getUserReadingLists = (userId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + `/reading-lists/user/${userId}`,
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

export const getReadingListById = (listId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + `/reading-lists/${listId}`,
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

export const createReadingList = (listData: Partial<ReadingListInfo>): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + "/reading-lists",
      method: "post",
      data: listData,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateReadingList = (listId: string, listData: Partial<ReadingListInfo>): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + `/reading-lists/${listId}`,
      method: "put",
      data: listData,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const addBookToList = (listId: string, bookId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + `/reading-lists/${listId}/books`,
      method: "post",
      data: { bookId },
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const removeBookFromList = (listId: string, bookId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + `/reading-lists/${listId}/books/${bookId}`,
      method: "delete",
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteReadingList = (listId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + `/reading-lists/${listId}`,
      method: "delete",
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

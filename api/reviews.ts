import authRequest from "../utils/authRequest";

export interface BookReviewInfo {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  comment?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}


export const getBookReviews = (bookId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `/api/reviews/book/${bookId}`,
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

export const getUserReviews = (userId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `/api/reviews/user/${userId}`,
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

export const getUserBookReview = (userId: string, bookId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `/api/reviews/user/${userId}/book/${bookId}`,
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

export const createOrUpdateReview = (reviewData: Partial<BookReviewInfo>): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: "/api/reviews",
      method: "post",
      data: reviewData,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteReview = (reviewId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: `/api/reviews/${reviewId}`,
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

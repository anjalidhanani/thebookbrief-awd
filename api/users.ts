import authRequest from "../utils/authRequest";
import request from "../utils/request";

export interface UserInfo {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
  age?: string;
  providers?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const userLogin = (loginData: {
  email?: string;
  password?: string;
  id_token?: string;
  method?: string;

}): Promise<any> => {
  return new Promise((resolve, reject) => {
    request({
      url: "/auth/login",
      method: "post",
      data: loginData,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const userSignup = (loginData: {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
  id_token?: string;
  method?: string;
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    request({
      url: BASE_URL + "/auth/signup",
      method: "post",
      data: loginData,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getUserInfo = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: "/auth/profile",
      method: "post",
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const userBasicDetailsUpdate = (basicData: {
  name?: string;
  age?: string;
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: BASE_URL + "/auth/update_profile",
      method: "post",
      data: basicData,
    })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};


export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    authRequest({
      url: "/auth/change_password",
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

export const restPassword = (data: {
  password: string;
  passwordConfirm: string;
  oobCode: string;
  apiKey: string;
}): Promise<any> => {
  return new Promise((resolve, reject) => {
    request({
      url: BASE_URL + "/auth/password_reset",
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
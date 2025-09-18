import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from "axios";
import Router from "next/router";
import { clearAllCookie, getToken } from "./auth";

export const authPages = [
  "/login",
  "/signup",
  "/reset-password",
  "/forgot-password",
  "/admin-login",
];

let cancelTokenSource = axios.CancelToken.source();

export default function authRequest(
  options: AxiosRequestConfig,
  token?: string
): AxiosPromise<any> {
  // const dispatch = useDispatch();
  token = token ?? getToken();
  if (!token) {
    Router.push("/login");
    return Promise.reject(new AxiosError("Invalid Token", "401"));
  }
  cancelTokenSource = axios.CancelToken.source();
  const request = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { Authorization: `Bearer ${token}` },
    cancelToken: cancelTokenSource.token,
  });
  request.interceptors.response.use(
    function (res) {
      return res;
    },
    function (error) {
      if (
        error?.response?.status === 401 &&
        !!!authPages?.find((path) => path === Router.pathname)
      ) {
        // dispatch(initMain())
        clearAllCookie();
        Router.push("/login");
      }
      // else {
      //   try {
      //     const { email, message } = JSON.parse(error?.response?.data?.detail);
      //     if (email) {
      //       // redirect to verify-email page
      //       logout({ email });
      //       return Promise.reject({
      //         ...error,
      //         response: {
      //           ...error?.response,
      //           data: { ...error?.response?.data, detail: message },
      //         },
      //       });
      //     }
      //   } catch (err) {}
      // }
      return Promise.reject(error);
    }
  );
  return request(options);
}

export function cancelRequest() {
  cancelTokenSource.cancel();
}

export function isCanceled(err: any) {
  return axios.isCancel(err);
}

import { NextComponentType, NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import { ReactElement, ReactNode, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { connect, useDispatch } from "react-redux";
import { getUserInfo } from "../api/users";
import { initMain, setUserInfo } from "../store/main/actions";
import { GlobalState } from "../store/reducers";
import { getToken } from "../utils/auth";
import { authPages } from "../utils/authRequest";

export type NextPageWithLayout<P = {}> = NextPage<P, P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MainProps {
  Component: NextComponentType<NextPageContext, any, {}> & NextPageWithLayout;
  pageProps: any;
}

const Main: React.FC<MainProps> = ({ Component, pageProps }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const getUser = async () => {
    try {
      const data: any = await getUserInfo();
      dispatch(setUserInfo(data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Only run on client side to prevent hydration mismatch
    if (typeof window !== 'undefined') {
      const token = getToken();
      if (!token && !!!authPages?.find((path) => path === router.pathname)) {
        dispatch(initMain());
        router.push("/login");
      } else {
        if (token && !pageProps.userInfo) {
          getUser();
        }
      }
    }
  }, []);

  return (
    <div suppressHydrationWarning>
      <Toaster position="bottom-left" containerClassName="font-satoshi" />
      <Component {...pageProps} />
    </div>
  );
};
const mapStateToPros = (state: GlobalState) => {
  return {
    userInfo: state.main?.userInfo,
  };
};

export default connect(mapStateToPros)(Main);

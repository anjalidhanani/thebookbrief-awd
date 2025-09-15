import "../styles/globals.css";
import { Provider } from "react-redux";
import logger from "redux-logger";
import { configureStore } from "@reduxjs/toolkit";
import reducers from "../store/reducers";
import Main from "../components/main";
import Script from 'next/script';

const preloadedState = {};
const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware: any) =>
    process.env.NEXT_PUBLIC_ENV !== "prod"
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware(),
  devTools: process.env.NEXT_PUBLIC_ENV !== "prod",
  preloadedState,
});

export default function App(props: any) {
  return (
    <div suppressHydrationWarning>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-CEVMGTS6MJ`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-CEVMGTS6MJ');
        `}
      </Script>
      <Provider store={store} >
        <Main {...props} />
      </Provider>
    </div>
  );
}

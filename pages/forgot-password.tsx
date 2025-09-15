import Head from "next/head";
import ForgotPassword from "../components/pages/forgotpassword";

export default function Index() {
  return (
    <>
      <Head>
        <title>{"Forgot password"}</title>
      </Head>
      <div className="bg-white font-satoshi">
        <ForgotPassword />
      </div>
    </>
  );
}

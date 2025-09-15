import Head from "next/head";
import ResetPassword from "../components/pages/resetpassword";

export default function Index() {
  return (
    <>
      <Head>
        <title>{"Reset Password"}</title>
      </Head>
      <div className="bg-white font-satoshi">
        <ResetPassword />
      </div>
    </>
  );
}

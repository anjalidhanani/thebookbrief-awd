import Head from "next/head";
import Login from "../components/pages/login";

export default function Index() {
  return (
    <>
      <Head>
        <title>{"Log In | Thebookbrief"}</title>
      </Head>
      <div className="bg-white font-satoshi">
        <Login />
      </div>
    </>
  );
}

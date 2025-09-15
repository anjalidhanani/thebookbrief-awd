import Head from "next/head";
import SignUp from "../components/pages/signup";

export default function Index() {
  return (
    <>
      <Head>
        <title>{"Sign Up | Thebookbrief"}</title>
      </Head>
      <div className="bg-white font-satoshi">
        <SignUp />
      </div>
    </>
  );
}

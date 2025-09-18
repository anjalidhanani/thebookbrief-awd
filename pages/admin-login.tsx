import Head from "next/head";
import AdminLogin from "../components/pages/admin-login";

export default function AdminLoginPage() {
  return (
    <>
      <Head>
        <title>{"Admin Login | Thebookbrief"}</title>
      </Head>
      <div className="bg-white font-satoshi">
        <AdminLogin />
      </div>
    </>
  );
}

import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { GlobalState } from "../store/reducers";
import { UserInfo } from "../api/users";
import { getToken } from "../utils/auth";
import AdminDashboard from "../components/pages/admin";

interface AdminPageProps {
  userInfo: UserInfo;
}

function AdminPage({ userInfo }: AdminPageProps) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/admin-login');
      return;
    }
    
    if (userInfo && userInfo.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [userInfo, router]);

  if (!userInfo || userInfo.role !== 'admin') {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard | Thebookbrief</title>
      </Head>
      <div className="bg-gray-50 min-h-screen font-satoshi">
        <AdminDashboard />
      </div>
    </>
  );
}

const mapStateToProps = (state: GlobalState) => {
  return {
    userInfo: state.main.userInfo,
  };
};

export default connect(mapStateToProps)(AdminPage);

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { userLogout } from "../api/users";
import Layout from "../components/common/layout";
import { initMain } from "../store/main/actions";
import { clearAllCookie } from "../utils/auth";

export default function Index() {
  const dispatch = useDispatch();
  const router = useRouter();

  const logout = async () => {
    // await userLogout();
    dispatch(initMain());
    clearAllCookie();
    router.push("/login");
  };

  useEffect(() => {
    logout();
  }, []);

  return <Layout title={`Theboobrief`}>Logging you out...</Layout>;
}

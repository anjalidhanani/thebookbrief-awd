import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  LockClosedIcon,
} from "@heroicons/react/20/solid";
import FullLogo from "../../common/FullLogo";
import { restPassword } from "../../../api/users";
import { toast } from "react-hot-toast";
import DivLoader from "../../common/DivLoader";

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [secondPwdErr, setSecondPwdErr] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { oobCode, apiKey } = router.query;

  function handlePasswordChange(e: any) {
    setPassword(e.target.value);
    setPwdErr("");
    setErr("");
  }

  function handlePasswordConfirmChange(e: any) {
    setPasswordConfirm(e.target.value);
    setSecondPwdErr("");
    setErr("");
  }

  function validateData() {
    if (password.length < 8) {
      setPwdErr("Password must contain at least 8 characters");
      return false;
    }
    if (!password) {
      setPwdErr("Please enter a value");
      return false;
    }
    if (passwordConfirm.length < 8) {
      setSecondPwdErr("Password must contain at least 8 characters");
      return false;
    }
    if (!passwordConfirm) {
      setSecondPwdErr("Please enter a value");
      return false;
    }
    if (password !== passwordConfirm) {
      setErr("Both passwords are not same");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    let validate = validateData();
    if (validate) {
      try {
        if (
          oobCode &&
          typeof oobCode === "string" &&
          apiKey &&
          typeof apiKey === "string"
        ) {
          setIsLoading(true);
          const inputData = {
            password: password,
            passwordConfirm: passwordConfirm,
            oobCode: oobCode ?? "",
            apiKey: apiKey ?? "",
          };
          await restPassword(inputData);
          router.push("/login");
          toast.success("Password reset successfully");
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.detail ?? "Password resetting failed");
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <>
      <div className="h-full flex flex-col items-center justify-start mobile:justify-center py-12 px-4 mobile:p-10">
        <div className="max-w-xs w-full space-y-8">
          <div className="flex flex-col items-center">
            <FullLogo />
            <div className="relative flex items-center mt-14">
              <LockClosedIcon className="w-8 h-8 text-sky-500" />
            </div>
            <p className="text-sky-500 mb-10 text-2xl">Set a new password</p>
            {err && <p className="text-sm text-orange-500 my-3">{err}</p>}
            <div className="w-full flex flex-col gap-6">
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-xl bg-white border outline-0 ring-0 focus:ring-2 focus:ring-sky-100 px-3 py-2 text-gray-800"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                {pwdErr && <p className="text-sm text-orange-500">{pwdErr}</p>}
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  required
                  className="w-full rounded-xl bg-white border outline-0 ring-0 focus:ring-2 focus:ring-sky-100 px-3 py-2 text-gray-800"
                  placeholder="Re-enter password"
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                />
                {secondPwdErr && (
                  <p className="text-sm text-orange-500">{secondPwdErr}</p>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                type="submit"
                className="group relative w-full mt-6 flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-500 hover:bg-sky-600 outline-none h-10"
              >
                {isLoading ? (
                  <DivLoader className="border-b-white border-r-white border-t-white border-transparent w-6 h-6" />
                ) : (
                  "Continue"
                )}
              </button>
            </div>
            <Link href={"/login"}>
              <p className="text-base text-sky-400 my-5 underline">
                Go to login
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;

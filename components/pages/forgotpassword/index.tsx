import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getToken } from "../../../utils/auth";
import FullLogo from "../../common/FullLogo";
import DivLoader from "../../common/DivLoader";
import { toast } from "react-hot-toast";

const ForgotPassword: React.FC = () => {
  const router = useRouter();

  const [errEmail, setErrEmail] = useState("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let token = getToken();
    if (token) {
      router.push("/");
    }
  }, []);

  function validateData() {
    if (!email) {
      setErrEmail("Please enter your registered email");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    let validate = validateData();
    if (validate) {
      setErrEmail("");
      setIsLoading(true);
      
      // Simulate processing time
      setTimeout(() => {
        setIsLoading(false);
        toast.error("Password reset functionality is not implemented yet. Please contact support.");
      }, 1000);
    }
  }

  return (
    <>
      <div className="h-full flex flex-col items-center justify-start mobile:justify-center py-12 px-4 mobile:p-10">
        <div className="max-w-xs w-full space-y-8">
          <div className="flex flex-col items-center">
            <FullLogo />
            <p className="text-sky-500 my-4 text-2xl">Forgot password?</p>
            <p className="text-gray-400 text-sm mt-2 my-5 text-center w-5/6">
              We'll sent a link to your registered email to confirm your
              account. please open that link to set a new password
            </p>
            <label htmlFor="email" className="sr-only">
              email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              required
              className="w-full rounded-xl bg-white border outline-0 ring-0 focus:ring-2 focus:ring-sky-100 px-3 py-2 text-gray-800"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            {errEmail && (
              <p className="text-sm text-orange-500 w-full text-start">
                {errEmail}
              </p>
            )}
            <div className="flex justify-center mt-6">
              <button
                onClick={(e) => handleSubmit(e)}
                type="submit"
                className="group relative w-full flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-500 hover:bg-sky-600 outline-none h-10"
              >
                {isLoading ? (
                  <DivLoader className="border-b-white border-r-white border-t-white border-transparent w-6 h-6" />
                ) : (
                  "Send mail"
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

export default ForgotPassword;

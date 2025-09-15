import {
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { connect } from "react-redux";
import { userBasicDetailsUpdate, UserInfo, changePassword } from "../../../api/users";
import { GlobalState } from "../../../store/reducers";
import DivLoader from "../../common/DivLoader";
import SubHeaderText from "../../common/SubHeaderText";

interface AccountSettingsPageProps {
  userInfo: UserInfo;
}

function AccountSettings({ userInfo }: AccountSettingsPageProps) {
  const [isLoadingBasicSetting, setIsLoadingBasicSetting] =
    useState<boolean>(false);
  const [isImageChange, setIsImageChange] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [isLoadingPasswordChange, setIsLoadingPasswordChange] = useState<boolean>(false);

  const [userData, setUserData] = useState<UserInfo>({
    id: "",
    name: "",
    email: "",
    avatar: "",
    age: "",
    providers: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setUserData(userInfo);
  }, [userInfo]);

  function handleChange(e: any) {
    setUserData((preVal) => {
      return { ...preVal, [e.target.name]: e.target.value };
    });
  }

  async function saveBasicChanges() {
    try {
      setIsLoadingBasicSetting(true);
      const basicData = { name: userData.name, age: userData.age };
      const res = await userBasicDetailsUpdate(basicData);
      toast.success(res?.data?.message ?? "Changes saved");
    } catch (err: any) {
      toast.error(
        (err &&
          err?.response &&
          err?.response?.data &&
          err?.response?.data?.detail) ??
          "Saving changes failed"
      );
    } finally {
      setIsLoadingBasicSetting(false);
    }
  }

  function handlePasswordChange(e: any) {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validatePasswordData() {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  }

  async function handlePasswordSubmit() {
    if (!validatePasswordData()) return;

    try {
      setIsLoadingPasswordChange(true);
      const res = await changePassword(passwordData);
      toast.success(res?.message ?? "Password changed successfully");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ?? "Failed to change password"
      );
    } finally {
      setIsLoadingPasswordChange(false);
    }
  }
  return (
    <>
      <div className="flex flex-col w-fit mobile:w-full">
        <SubHeaderText text={"Personal Information"} />
      </div>
      <div className="flex flex-col w-1/3 mobile:w-full tablet:w-1/2">
        <label className="mt-5 mb-2 text-md text-dark" htmlFor="firstName">
          First Name
        </label>
        <input
          className="rounded-full bg-white border outline-0 ring-0 focus:ring-2 focus:ring-sky-100 px-3 py-2 text-gray-600"
          placeholder="First name"
          value={userData?.name}
          id="name"
          name="name"
          onChange={(e) => handleChange(e)}
        />
        <label className="mt-5 mb-2 text-md text-dark" htmlFor="lastName">
          Age
        </label>
        <input
          className="rounded-full bg-white border outline-0 ring-0 focus:ring-2 focus:ring-sky-100 px-3 py-2 text-gray-600"
          placeholder="Age"
          value={userData?.age}
          id="age"
          name="age"
          onChange={(e) => handleChange(e)}
        />
      </div>
      <div className="flex justify-start">
        <button
          className="rounded-full bg-sky-500 px-5 py-1.5 w-fit mt-5 text-white"
          onClick={saveBasicChanges}
        >
          {isLoadingBasicSetting ? (
            <DivLoader className="border-b-white border-r-white border-t-white border-transparent w-6 h-6" />
          ) : (
            "Save changes"
          )}
        </button>
      </div>
      <div className="flex flex-col w-1/3 mobile:w-full tablet:w-1/2">
        <SubHeaderText text={"Account Information"} className="mt-10" />
        <label
          className="flex items-center mt-5 mb-2 text-md text-dark"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="disabled:bg-gray-100 rounded-full bg-white border outline-0 ring-0 focus:ring-2 focus:ring-sky-100 px-3 py-2 text-gray-600"
          placeholder="Email"
          id="email"
          name="email"
          disabled={true}
          value={userData?.email}
        />
        <label
          className="flex items-center mt-5 mb-2 text-md text-dark"
          htmlFor="password"
        >
          Password
          <PencilSquareIcon 
            className="cursor-pointer ml-2 w-5 h-5 text-sky-500 hover:text-sky-600" 
            onClick={() => setShowPasswordModal(true)}
          />
        </label>
        <input
          className="disabled:bg-gray-100 rounded-full bg-white border outline-0 ring-0 focus:ring-2 focus:ring-sky-100 px-3 py-2 text-gray-600"
          placeholder="***********"
          id="password"
          disabled={true}
        />
      </div>

      {/* Password Change Modal */}
      <Transition appear show={showPasswordModal} as={Fragment}>
        <Dialog as="div" className="relative z-[1000]" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all w-full sm:w-96 font-satoshi">
                  <div className="flex justify-between px-6 pt-8 pb-2">
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-bold leading-6 text-sky-500"
                      >
                        Change Password
                      </Dialog.Title>
                      <Dialog.Description
                        as="p"
                        className="text-sm text-gray-500 mt-4"
                      >
                        Enter your current password and choose a new one.
                      </Dialog.Description>
                    </div>
                    <div className="rounded-4xl">
                      <XMarkIcon
                        className="rounded-4xl cursor-pointer w-6 h-6 text-gray-500 hover:text-sky-500 active:text-navy-1"
                        onClick={() => {
                          setShowPasswordModal(false);
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                          setPasswordErrors({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="px-6 pb-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full rounded-full bg-white border outline-0 ring-0 focus:ring-2 focus:ring-sky-100 px-3 py-2 text-gray-600"
                          placeholder="Enter current password"
                        />
                        {passwordErrors.currentPassword && (
                          <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full rounded-full bg-white border outline-0 ring-0 focus:ring-2 focus:ring-sky-100 px-3 py-2 text-gray-600"
                          placeholder="Enter new password"
                        />
                        {passwordErrors.newPassword && (
                          <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full rounded-full bg-white border outline-0 ring-0 focus:ring-2 focus:ring-sky-100 px-3 py-2 text-gray-600"
                          placeholder="Confirm new password"
                        />
                        {passwordErrors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mobile:flex-col-reverse mt-6 w-full">
                      <button
                        className="border h-10 rounded-full ml-auto mt-4 mr-2 mobile:mr-0 text-light w-full outline-none"
                        onClick={() => {
                          setShowPasswordModal(false);
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                          setPasswordErrors({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        disabled={isLoadingPasswordChange}
                      >
                        Cancel
                      </button>
                      <button
                        className="text-white h-10 rounded-full mt-4 ml-2 mobile:ml-0 w-full outline-none bg-sky-500 hover:bg-sky-600 disabled:opacity-50"
                        disabled={isLoadingPasswordChange}
                        onClick={handlePasswordSubmit}
                      >
                        {isLoadingPasswordChange ? (
                          <DivLoader className="w-6 h-6 border-b-white border-r-white border-t-white border-transparent" />
                        ) : (
                          "Change Password"
                        )}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

const mapStateToPros = (state: GlobalState) => {
  return {
    userInfo: state.main.userInfo,
  };
};

export default connect(mapStateToPros)(AccountSettings);

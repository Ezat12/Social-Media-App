import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { IoIosCloseCircle } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

function Setting() {
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");

  const navigator = useNavigate();

  const submitChangePassword = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/user/changePasswordUser`,
        { newPassword, currentPassword },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
          },
        }
      );
      sessionStorage.removeItem("access-token");
      navigator("/login");
      toast.success("change successfully, login again");
    } catch (e) {
      const errorMassage = e.response.data.errors[0].msg;
      const errorPath = e.response.data.errors[0].path;
      setError(errorPath);
      toast.error(errorMassage);
    }
  };

  return (
    <div className="home p-2 lg:p-5 md:lg:p-5">
      <div className="grid md:grid-cols-7 lg:grid-cols-5 gap-4">
        <Sidebar />
        <div className="lg:col-span-4 md:col-span-5 lg:px-5 md:px-5 px-2  lg:pt-5 md:pt-5 pt-2 bg-gray-100 min-h-[calc(100vh-125px)]">
          <h2 className="text-2xl font-semibold">Security Setting</h2>
          <div className="p-4 bg-white mt-6">
            <h4 className="text-lg font-medium">Setting</h4>
            <div className="flex items-end gap-3 mt-5">
              <div className="flex flex-col gap-2">
                <span className="font-medium">Password</span>
                <input
                  type="text"
                  value={"********"}
                  className="p-4 border border-gray-300 outline-none"
                  readOnly
                />
              </div>
              <button
                onClick={() => setChangePassword(true)}
                className="font-medium py-4 px-5 border border-gray-300 transform duration-100 cursor-pointer hover:bg-blue-600 hover:text-white "
              >
                Change Password
              </button>
            </div>
          </div>
          {changePassword && (
            <div className="absolute top-0 left-0 w-full h-full bg-[#ebe6e773]"></div>
          )}
          {changePassword && (
            <div className="absolute z-50 top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] p-6 lg:w-xl md:w-xl w-80 mx-auto bg-white rounded-lg shadow-md">
              <div className="relative">
                <span
                  onClick={() => setChangePassword(false)}
                  className="absolute top-0 right-0 cursor-pointer"
                >
                  <IoIosCloseCircle size={"25px"} color="#282828" />
                </span>
                <h2 className="text-2xl font-bold mb-4">Change Password</h2>
                <form onSubmit={submitChangePassword}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      type="password"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        error === "currentPassword"
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                      className={`t-1 block w-full px-3 py-2 border ${
                        error === "newPassword"
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Setting;

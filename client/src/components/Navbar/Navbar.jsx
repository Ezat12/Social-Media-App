/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import img_log from "../../assets/logo-purple .svg";
import { GoSearch } from "react-icons/go";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { IoNotificationsSharp } from "react-icons/io5";
import img_black_profile from "../../assets/blank profile.webp";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../../ReduxTK/UserSlice/userSlice";
import { FcComments } from "react-icons/fc";
import { AiOutlineLike } from "react-icons/ai";
import { RiUserFollowFill } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import { PiListBold } from "react-icons/pi";
import { IoPricetagsSharp } from "react-icons/io5";
import img_like from "../../assets/interactions/like.png";
import img_blank_profile from "../../assets/blank profile.webp";
import img_friends from "../../assets/Icons/friends.png";
import img_save from "../../assets/Icons/Save.png";
import img_setting from "../../assets/Icons/setting.svg";
import img_logout from "../../assets/Icons/Logout.png";
import Swal from "sweetalert2";

function Navbar() {
  const [search, setSearch] = useState(null);
  const [userSearch, setUserSearch] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [lengthNotification, setLengthNotification] = useState(null);
  const [dropdown, setDropdown] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigator = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("access-token")) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/user/getDataUser`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem(
                  "access-token"
                )}`,
              },
            }
          );
          dispatch(userRegister(response.data.user));
          const notification = response.data.user.notification;

          const notLen = notification.filter((no) => !no.read);

          setLengthNotification(notLen.length);
        } catch (e) {
          const error = e.response.data.message;
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error,
            confirmButtonText: "ok",
          }).then((result) => {
            if (result.isConfirmed) {
              sessionStorage.removeItem("access-token");
              navigator("/login");
            }
          });
        }
      };
      fetchData();
    } else {
      navigator("/login");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".notification")) {
        setShowNotification(false);
      }
    };

    const handleClickOutSideDropList = (e) => {
      if (!e.target.closest(".dropdown-list")) {
        setDropdown(false);
      }
    };

    const fetchDataToNotificationRead = (e) => {
      setTimeout(async () => {
        if (e.target.closest(".notification")) {
          const response = await axios.put(
            `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/readNotification`,
            {},
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem(
                  "access-token"
                )}`,
              },
            }
          );

          console.log(response.data.user);
          setLengthNotification(0);
          dispatch(userRegister(response.data.user));
        }
      }, 2000);
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("click", handleClickOutSideDropList);
    document.addEventListener("click", fetchDataToNotificationRead);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("click", handleClickOutSideDropList);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (search) {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/user?keyword=${search}`
        );
        setUserSearch(response.data.users);
      } else {
        setUserSearch([]);
      }
    };

    fetchData();
  }, [search]);

const clickLogout = () => {
    sessionStorage.removeItem("access-token");
    navigator("/login");
  };

  return (
    <div className="navbar flex items-center justify-between p-4 shadow-lg">
      {sessionStorage.getItem("access-token") && (
        <>
          <div
            onClick={() => navigator("/")}
            className="logo flex items-center cursor-pointer"
          >
            <img src={img_log} className="lg:w-[50px] md:w-[50px] w-9" />
            <div className="flex flex-col font-bold pl-2 border-l ml-2 border-gray-400 leading-4.5">
              <span>Online</span>
              <span>Communication</span>
            </div>
          </div>
          <div className="search lg:block md:block hidden">
            <div className="relative w-80 lg:w-2xl md:w-96">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="search"
                className="w-full rounded-2xl py-3 px-12 outline-none bg-gray-200 placeholder:text-lg"
              />

              {userSearch.length > 0 && (
                <span
                  onClick={() => setSearch("")}
                  className="absolute top-[50%] translate-y-[-50%] right-5 cursor-pointer"
                >
                  <IoCloseSharp size={"20px"} />
                </span>
              )}

              <span className="absolute top-[50%] left-7 translate-[-50%] text-gray-600">
                <GoSearch size={"21px"} />
              </span>

              {userSearch.length > 0 && (
                <div className="absolute top-13 left-0 w-full  bg-white shadow-2xl rounded-2xl flex flex-col gap-2 z-40">
                  {userSearch.map((u, index) => {
                    if (user._id !== u._id) {
                      return (
                        <Link
                          to={`/user/${u._id}`}
                          onClick={() => setUserSearch([])}
                          key={index}
                          className="w-full p-3 font-medium hover:bg-blue-500 hover:text-white block rounded-2xl cursor-pointer transform duration-75"
                        >
                          {u.name}
                        </Link>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          </div>
          {!sessionStorage.getItem("access-token") ? (
            <div className="flex items-center gap-3">
              <Link
                to={"/login"}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 cursor-pointer focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="flex items-center lg:gap-5 md:gap-5 gap-3">
              {
                <div className="relative dropdown-list">
                  <span
                    onClick={() => setDropdown(true)}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 cursor-pointer lg:hidden md:hidden"
                  >
                    <PiListBold size={"22px"} />
                  </span>
                  {dropdown && (
                    <div className="absolute top-12 right-0 z-50 px-2 bg-white shadow-2xl w-56 rounded-lg flex flex-col">
                      <Link
                        to="/profile"
                        onClick={() => setDropdown(false)}
                        className="flex items-center justify-between w-full h-[56px] px-2 cursor-pointer rounded-2xl transform duration-100 hover:bg-gray-100"
                      >
                        <img
                          className="w-8 h-8 rounded-full"
                          src={
                            user.profileImage
                              ? user.profileImage
                              : img_blank_profile
                          }
                          alt="Profile"
                        />
                        <span className="font-medium">{user.name}</span>
                      </Link>
                      <Link
                        to="/followers"
                        onClick={() => setDropdown(false)}
                        className="flex items-center gap-5 w-full h-[56px] px-2 cursor-pointer rounded-2xl transform duration-100 hover:bg-gray-100"
                      >
                        <img
                          className="w-9 h-9 rounded-full"
                          src={img_friends}
                          alt="Followers"
                        />
                        <span className="font-medium">Followers</span>
                      </Link>
                      <Link
                        to="/save-posts"
                        onClick={() => setDropdown(false)}
                        className="flex items-center gap-5 w-full h-[56px] px-2 cursor-pointer rounded-2xl transform duration-100 hover:bg-gray-100"
                      >
                        <img
                          className="w-8 h-8 rounded-full"
                          src={img_save}
                          alt="Save Posts"
                        />
                        <span className="font-medium">Posts Save</span>
                      </Link>
                      <Link
                        to="/setting"
                        onClick={() => setDropdown(false)}
                        className="flex items-center gap-5 w-full h-[56px] px-2 cursor-pointer rounded-2xl transform duration-100 hover:bg-gray-100"
                      >
                        <img
                          className="w-7 h-7 rounded-full"
                          src={img_setting}
                          alt="Setting"
                        />
                        <span className="font-medium">Setting</span>
                      </Link>
                      <li
                        onClick={clickLogout}
                        className="flex items-center gap-5 w-full h-[56px] px-2 cursor-pointer rounded-2xl transform duration-100 hover:bg-gray-100"
                      >
                        <img
                          className="w-7 h-7 rounded-full"
                          src={img_logout}
                          alt="Logout"
                        />
                        <span className="font-medium">Logout</span>
                      </li>
                    </div>
                  )}
                </div>
              }
              <div
                onClick={() => setShowNotification(!showNotification)}
                className="notification relative w-10 h-10 rounded-full flex items-center justify-center bg-gray-200"
              >
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-white bg-red-500 flex items-center justify-center">
                  {lengthNotification}
                </span>
                <IoNotificationsSharp size={"22px"} />
                {showNotification && (
                  <div className="absolute z-40 top-15 right-0 p-2 shadow-2xl bg-white rounded-lg">
                    <ul className="flex flex-col w-96 gap-2">
                      {user?.notification?.map((not, index) => {
                        return (
                          <li
                            onClick={
                              not.type === "follow"
                                ? () => navigator(`/user/${not.user_id}`)
                                : () => navigator(`/post/${not.post_id}`)
                            }
                            className={`flex items-center gap-2 p-3 transform duration-100 ${
                              not.read ? "bg-white" : "bg-gray-200"
                            } font-medium rounded-md hover:bg-gray-100 cursor-pointer`}
                            key={index}
                          >
                            {not.type === "comment" ? (
                              <FcComments className="mt-1" size={"19px"} />
                            ) : not.type === "like" ? (
                              <img src={img_like} className="w-5" />
                            ) : not.type === "follow" ? (
                              <RiUserFollowFill
                                className="mt-1 text-blue-500"
                                size={"19px"}
                              />
                            ) : (
                              <IoPricetagsSharp
                                className="mt-1 text-blue-500"
                                size={"19px"}
                              />
                            )}
                            <p className=" text-gray-700 ">{not.message}</p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
              <div onClick={() => navigator("/profile")} className="profile">
                {user.profileImage ? (
                  <img
                    className="w-10 h-10 rounded-full"
                    src={user.profileImage}
                  />
                ) : (
                  <img
                    className="w-10 h-10 rounded-full"
                    src={img_black_profile}
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Navbar;

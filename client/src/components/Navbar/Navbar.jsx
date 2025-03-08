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
import img_like from "../../assets/interactions/like.png";
import Swal from "sweetalert2";

function Navbar() {
  const [search, setSearch] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [lengthNotification, setLengthNotification] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigator = useNavigate();

  // console.log(user);

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
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".notification")) {
        setShowNotification(false);
      }
    };

    const fetchDataToNotificationRead = async (e) => {
      if (e.target.closest(".notification")) {
        const response = await axios.put(
          `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/readNotification`,
          {},
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
            },
          }
        );

        console.log(response.data.user);
        dispatch(userRegister(response.data.user));
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("click", fetchDataToNotificationRead);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar flex items-center justify-between p-4 shadow-lg">
      {sessionStorage.getItem("access-token") && (
        <>
          <div
            onClick={() => navigator("/")}
            className="logo flex items-center cursor-pointer"
          >
            <img src={img_log} width={"50px"} />
            <div className="flex flex-col font-bold pl-2 border-l ml-2 border-gray-400 leading-4.5">
              <span>Online</span>
              <span>Communication</span>
            </div>
          </div>
          <div className="search">
            <div className="relative w-2xl">
              <input
                type="text"
                placeholder="search"
                className="w-full rounded-2xl py-3 px-12 outline-none bg-gray-200 placeholder:text-lg"
              />

              <span className="absolute top-[50%] left-7 translate-[-50%] text-gray-600">
                <GoSearch size={"21px"} />
              </span>
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
            <div className="flex items-center gap-5">
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
                            ) : (
                              <RiUserFollowFill
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
              <div className="profile">
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

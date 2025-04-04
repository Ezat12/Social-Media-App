import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import img_blank from "../../assets/blank profile.webp";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaUserCheck } from "react-icons/fa6";
import { userRegister } from "../../ReduxTK/UserSlice/userSlice";
import { toast } from "react-toastify";

function Followers() {
  const user = useSelector((state) => state.user);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/user/follow`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
          },
        }
      );
      setLoading(false);
      setFollowers(response.data.user.followers);
      setFollowing(response.data.user.following);
    };
    fetchData();
  }, [user]);

  const addFollow = async (id) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/user/follow`,
        { idUser: id },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
          },
        }
      );

      dispatch(userRegister(response.data.user));
    } catch (e) {
      console.log(e);
      toast.error("something error");
    }
  };

  const deleteFollow = async (id) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/user/follow`,
        { idUser: id },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
          },
        }
      );

      console.log(response.data);

      dispatch(userRegister(response.data.user));
    } catch (e) {
      console.log(e);
      toast.error("something error");
    }
  };

  return (
    <div className="home p-5">
      <div className="grid md:grid-cols-7 lg:grid-cols-5 gap-4">
        <Sidebar />
        <div className="lg:col-span-4 md:col-span-5 p-4 bg-gray-100 min-h-[calc(100vh-125px)]">
          <div className="flex lg:flex-row md:flex-row flex-col">
            <div className="followers w-70 lg:w-80 md:w-80">
              <h2 className="text-lg font-semibold lg:mb-8 md:mb-8 mb-2">
                Followers:
              </h2>
              <div className="flex flex-col gap-1 lg:gap-3 md:gap-3">
                {followers.length > 0 ? (
                  followers.map((u, i) => {
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={u.profileImage ? u.profileImage : img_blank}
                            className="w-10 h-10 rounded-full"
                          />
                          <p className="font-medium">{u.name}</p>
                        </div>
                        {!user.following.includes(u._id) ? (
                          <button
                            onClick={() => addFollow(u._id)}
                            className="text-blue-500 font-medium cursor-pointer"
                          >
                            Follow+
                          </button>
                        ) : (
                          <button>
                            <FaUserCheck
                              className="text-blue-500"
                              size={"20px"}
                            />
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center font-semibold">
                    {!loading ? <p> You Have No Followers</p> : <p>loading</p>}
                  </div>
                )}
              </div>
            </div>
            <div className="following w-70 lg:w-80 md:w-80 lg:pl-6 md:pl-6 lg:border-l-1 md:border-l-1 border-gray-400 lg:ml-3 md:ml-3 lg:mt-0 md:mt-0 mt-10">
              <h2 className="text-lg font-semibold lg:mb-8 md:mb-8 mb-2">
                Following:
              </h2>
              <div className="flex flex-col lg:gap-3 md:gap-3">
                {following.length > 0 ? (
                  following.map((u, i) => {
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-200"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={u.profileImage ? u.profileImage : img_blank}
                            className="w-10 h-10 rounded-full"
                          />
                          <p className="font-medium">{u.name}</p>
                        </div>
                        <button
                          onClick={() => deleteFollow(u._id)}
                          className="text-blue-500 font-medium cursor-pointer"
                        >
                          unFollow
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center font-semibold">
                    {!loading ? (
                      <p>You are not following anyone</p>
                    ) : (
                      <p>loading</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Followers;

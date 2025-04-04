import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { useParams } from "react-router";
import Item from "../Item/Item";
import img_blank from "../../assets/blank profile.webp";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../../ReduxTK/UserSlice/userSlice";
import { toast } from "react-toastify";

function ProfilePeople() {
  const { userId } = useParams();
  const yourUser = useSelector((state) => state.user);

  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const responseGetUser = await axios.get(
        `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/user/${userId}`
      );
      const responseGetPosts = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL_DEV
        }/api/v1/post/getPostsUserUnLogged/${userId}`
      );

      setUser(responseGetUser.data.user);
      setPosts(responseGetPosts.data.data);
    };
    fetchData();
  }, [userId, yourUser]);

  const addFollow = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/user/follow`,
        { idUser: user._id },
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

  const deleteFollow = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/user/follow`,
        { idUser: user._id },
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
    <div className="profile-people p-5">
      <div className="grid md:grid-cols-7 lg:grid-cols-5 gap-4">
        <Sidebar />
        <div className="lg:col-span-4 md:col-span-5 lg:px-5 md:px-5 px-2  lg:pt-5 md:pt-5 pt-2 bg-gray-100 min-h-[calc(100vh-125px)]">
          <div className="bg-white shadow-2xs">
            <div className="container m-auto">
              <div className="image-cover w-full">
                {user?.coverImage ? (
                  <img
                    className="lg:h-64 h-56 w-full"
                    src={user.coverImage ? user.coverImage : ""}
                  />
                ) : (
                  <div className="w-full h-60 bg-gray-200"></div>
                )}
              </div>
              <div className="flex justify-around flex-wrap gap-5 items-center pb-8">
                <div className="flex gap-4">
                  <div className="img-profile lg:w-28 lg:h-28 md:w-24 md:h-24 h-20 w-20 lg:-mt-4 md:-mt-3 -mt-1">
                    {!user?.profileImage ? (
                      <img
                        className="rounded-full border-white border-6"
                        src={img_blank}
                      />
                    ) : (
                      <img
                        className="rounded-full w-full h-full border-white border-6"
                        src={user.profileImage}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col lg:mt-5 md:mt-3 mt-2">
                      <p className="text-2xl font-medium">{user?.name}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-2 font-medium text-sm text-gray-600">
                          Followers
                          <span className="font-semibold text-black">
                            {user?.followers?.length}
                          </span>
                        </span>
                        <span className="flex items-center gap-2 font-medium text-sm text-gray-600">
                          Following{" "}
                          <span className="font-semibold text-black">
                            {user?.following?.length}
                          </span>
                        </span>
                      </div>
                    </div>

                    {yourUser?.followers?.includes(user?._id) && (
                      <p className="text-blue-400 text-sm font-medium">
                        Following you
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 lg:hidden">
                  <h3 className="text-lg font-medium">Brief summary</h3>
                  <div>
                    {
                      <div>
                        {user?.bio ? (
                          <div className="font-medium text-center my-5">
                            {user.bio}
                          </div>
                        ) : (
                          <div className="font-medium my-5 text-center text-gray-600">
                            Nothing
                          </div>
                        )}
                      </div>
                    }
                  </div>
                </div>
                {user?.followers?.includes(yourUser._id) ? (
                  <button
                    onClick={deleteFollow}
                    className="py-2 px-5 rounded-lg bg-blue-500 text-white font-medium cursor-pointer"
                  >
                    unFollow
                  </button>
                ) : (
                  <button
                    onClick={addFollow}
                    className="py-2 px-5 rounded-lg bg-blue-500 text-white font-medium cursor-pointer"
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-100">
            <div className="container mx-auto">
              <div className="grid grid-cols-4 gap-5">
                <div className="lg:col-span-3 col-span-4  flex flex-col gap-4 py-5">
                  {posts?.map((post, index) => {
                    return <Item key={index} post={post} />;
                  })}
                </div>
                <div className="mt-5 lg:block hidden">
                  <div className="bg-white rounded-lg p-4">
                    <h3 className="text-lg font-medium">Brief summary</h3>
                    <div>
                      {
                        <div>
                          {user?.bio ? (
                            <div className="font-medium text-center my-5">
                              {user.bio}
                            </div>
                          ) : (
                            <div className="font-medium my-5 text-center text-gray-600">
                              Nothing
                            </div>
                          )}
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePeople;

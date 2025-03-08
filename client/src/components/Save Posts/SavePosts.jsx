import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import Item from "../Item/Item";
import { useSelector } from "react-redux";
import { RotateLoader } from "react-spinners";

function SavePosts() {
  const [savePosts, setSavePosts] = useState([]);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/user/savePost`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
          },
        }
      );
      setLoading(false);
      setSavePosts(response.data.postSave);
    };
    fetchData();
  }, [user]);

  return (
    <div className="home p-5">
      <div className="grid grid-cols-5 gap-4">
        <Sidebar />
        <div className="col-span-4 px-5 pt-5 bg-gray-100 min-h-[calc(100vh-125px)]">
          <div className="flex flex-col gap-5 h-full">
            {savePosts.length > 0 ? (
              savePosts.map((post) => {
                return <Item key={post._id} post={post} />;
              })
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                {!loading ? (
                  <p className="text-3xl font-medium">
                    You have no saved posts.
                  </p>
                ) : (
                  <p className="text-4xl">
                    <RotateLoader />
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavePosts;

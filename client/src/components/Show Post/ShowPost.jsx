import "react";
import Sidebar from "../Sidebar/Sidebar";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import Item from "../Item/Item";

function ShowPost() {
  const { postId } = useParams();

  const [post, setPost] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/post/${postId}`
      );

      setPost(response.data.data);
    };

    fetchData();
  }, []);

  return (
    <div className="profile-people p-5">
      <div className="grid grid-cols-5 gap-4">
        <Sidebar />
        <div className="col-span-4 px-5 pt-5 bg-gray-100 min-h-[calc(100vh-125px)]">
          {Object.keys(post).length > 0 && <Item post={post} />}
        </div>
      </div>
    </div>
  );
}

export default ShowPost;

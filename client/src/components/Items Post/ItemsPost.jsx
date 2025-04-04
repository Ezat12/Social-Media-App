import "react";
import { SlLike } from "react-icons/sl";
import { FaRegComment } from "react-icons/fa6";
import { useEffect, useState } from "react";
import axios from "axios";
import Item from "../Item/Item";

function ItemsPost() {
  const [posts, setPosts] = useState([]);
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 10
      ) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/post`
      );

      setPosts(response.data.data);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-4 md:p-5 lg:p-5 p-3">
      {posts.map((post, index) => {
        return <Item key={index} id={index} post={post} />;
      })}
    </div>
  );
}

export default ItemsPost;

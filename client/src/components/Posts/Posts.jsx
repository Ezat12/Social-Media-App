import "react";
import axios from "axios";
import "./Post.css";
import ItemsPost from "../Items Post/ItemsPost";
import AddPost from "../Add Post/AddPost";

function Posts() {
  return (
    <div className="p-2 md:p-6 lg:p-6">
      <div className="grid grid-cols-5">
        <div className="lg:col-span-3 col-span-5  overflow-auto bg-gray-100 ">
          <ItemsPost />
        </div>
        {window.innerWidth > 1024 && <AddPost />}
      </div>
    </div>
  );
}

export default Posts;

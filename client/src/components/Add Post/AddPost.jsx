import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import img_blank_profile from "../../assets/blank profile.webp";
import { useNavigate } from "react-router";
import { RiImageAddFill } from "react-icons/ri";
import { BsX } from "react-icons/bs";
import { FaArrowLeftLong, FaUserTag } from "react-icons/fa6";
import { BeatLoader, ScaleLoader } from "react-spinners";
import axios from "axios";
import { toast } from "react-toastify";

function AddPost() {
  const user = useSelector((state) => state.user);
  const [showTag, setShowTag] = useState(false);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [image, setImage] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [description, setDescription] = useState("");
  const [loadingCreatePost, setLoadingCreatePost] = useState(false);

  const [users, setUsers] = useState([]);
  const modalRef = useRef();
  const navigator = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL_DEV
        }/api/v1/user/?limit=6&keyword=${search}`
      );
      setUsers(response.data.users);
    };

    fetchData();
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowTag(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddTag = (element) => {
    let copyTags = [...tags];
    copyTags.push({ id: element._id, name: element.name });
    setTags(copyTags);
  };

  const handleRemoveTag = (element) => {
    let copyTags = [...tags];
    const resultTag = copyTags.filter((tag) => tag.id !== element.id);
    setTags(resultTag);
  };

  const handleChangeImage = async (e) => {
    if (e.target.files) {
      setLoadingImage(true);
      const formData = new FormData();
      formData.append("images", e.target.files[0]);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/upload/upload-file`,
        formData
      );
      setImage(response.data.data[0].url);
      setLoadingImage(false);
    }
  };

  const handleCreatePost = async () => {
    if (!image && !description) {
      return;
    } else if (!sessionStorage.getItem("access-token")) {
      toast.warn("you are not login, please login");
      navigator("/login");
    } else {
      setLoadingCreatePost(true);
      try {
        const getTags = [];
        tags.map((tag) => getTags.push(tag.id));
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/post`,
          { description, images: image, tags: getTags },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
            },
          }
        );

        setLoadingCreatePost(false);
        location.reload();
      } catch (e) {
        setLoadingCreatePost(false);
        const error = e?.response?.data?.errors[0].msg;
        toast.error(error);
      }
    }
  };

  return (
    <div className="col-span-2 p-3 relative ">
      <h2 className="text-center font-semibold text-xl border-b pb-3 border-gray-300">
        Create Post
      </h2>
      <div dir="rtl" className="flex items-center gap-2 mt-4">
        <img
          className="w-9 h-9 rounded-full"
          src={user.profileImage ? user.profileImage : img_blank_profile}
        />
        <span className="font-medium">{user.name}</span>
      </div>
      <div className="mt-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none"
          placeholder="What are you thinking, Ezat?"
        />
      </div>
      <div className="relative image p-2 border border-gray-300 rounded-lg h-40 mt-3">
        {!image ? (
          <label
            htmlFor="image"
            className="flex flex-col items-center justify-center transform duration-100 cursor-pointer bg-gray-100 w-full h-full hover:bg-gray-200"
          >
            <div className="flex items-center justify-center bg-gray-300 w-10 h-10 rounded-full">
              <RiImageAddFill />
            </div>
            <span className="font-medium">Add Image</span>
          </label>
        ) : (
          <label
            htmlFor="image"
            className="relative flex flex-col items-center justify-center transform duration-100 cursor-pointer bg-gray-100 w-full h-full hover:bg-gray-200"
          >
            <img src={image} className="w-full h-full" />
          </label>
        )}
        {image && (
          <span
            onClick={() => setImage("")}
            className="absolute cursor-pointer z-30 top-2 left-2 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <BsX size={"22px"} />
          </span>
        )}
        {loadingImage && (
          <div className="absolute z-30 w-full h-full bg-[#00000066] top-0 left-0 flex items-center justify-center">
            <ScaleLoader color="white" />
          </div>
        )}
        <input onChange={handleChangeImage} id="image" type="file" hidden />
      </div>
      <div className="tags flex items-center justify-between border border-gray-300 rounded-lg p-4 mt-3">
        <span className="font-medium ">Tag To People</span>
        <FaUserTag
          onClick={() => setShowTag(true)}
          className="cursor-pointer"
          size={"20px"}
        />
      </div>
      {showTag && (
        <div
          ref={modalRef}
          className="absolute z-50 top-0 left-0 w-full h-full overflow-auto p-5 bg-white scroll-smooth custom-scrollbar"
        >
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div
              onClick={() => setShowTag(false)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 cursor-pointer"
            >
              <FaArrowLeftLong />
            </div>
            <p className="font-medium">Tag To People</p>
          </div>
          <div className="flex gap-6 items-center mt-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="flex-auto py-2 px-4 bg-gray-100 border outline-none border-gray-200 rounded-lg"
              placeholder="search"
            />
            <button
              onClick={() => setShowTag(false)}
              className="font-bold text-lg text-blue-500"
            >
              Ok
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-4 my-3">
            {tags.map((tag, index) => {
              return (
                <div
                  key={index}
                  className="bg-[#ebf5ff] text-blue-600 flex items-center gap-3 font-medium  py-2 px-4 rounded-lg"
                >
                  <span>{tag.name}</span>
                  <BsX
                    onClick={() => handleRemoveTag(tag)}
                    size={"23px"}
                    className="mt-1 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
          <p className="text-sm font-semibold mt-3 text-gray-600">
            Suggestions
          </p>

          <div className="flex flex-col gap-3 mt-5">
            {users.map((u, i) => {
              return !tags.some((t) => t.id == u._id) ? (
                <div
                  onClick={() => handleAddTag(u)}
                  key={i}
                  className="flex items-center p-2 rounded-lg gap-4 transform duration-75 hover:bg-gray-100"
                >
                  <img
                    src={u.profileImage ? u.profileImage : img_blank_profile}
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="font-medium">{u.name}</p>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
      <button
        onClick={handleCreatePost}
        className={`font-semibold text-xl text-white w-full text-center rounded-lg  ${
          image && description
            ? "bg-blue-600 cursor-pointer"
            : "bg-gray-200 cursor-not-allowed"
        } mt-4 py-3`}
      >
        {loadingCreatePost ? <BeatLoader color="#fff" /> : "Create"}
      </button>
    </div>
  );
}

export default AddPost;

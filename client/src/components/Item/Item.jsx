/* eslint-disable react/prop-types */
import img_blank from "../../assets/blank profile.webp";
import { SlLike } from "react-icons/sl";
import { FaRegComment } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiMoreHorizontal } from "react-icons/fi";
import { BsFillSaveFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router";
import img_like from "../../assets/interactions/like.png";
import { IoSend } from "react-icons/io5";
import { BsX } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { BsBookmark } from "react-icons/bs";
import { BsBookmarkFill } from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa6";
import axios from "axios";
import { userRegister } from "../../ReduxTK/UserSlice/userSlice";
import AddPost from "../Add Post/AddPost";

function Item(props) {
  const [post, setPost] = useState(props.post);

  const user = useSelector((state) => state.user);
  const [like, setLike] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [target, setTarget] = useState(null);
  const [save, setSave] = useState(false);
  const [follow, setFollow] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const dispatch = useDispatch();

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPostMe, setDropdownPostMe] = useState(false);

  const toggleDropdown = (commentId) => {
    setOpenDropdownId(openDropdownId === commentId ? null : commentId);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(".dropdown")) {
      setOpenDropdownId(null);
    }
  };
  const handleClickOutSideToPost = (e) => {
    if (!e.target.closest(".dropdown-post")) {
      setDropdownPostMe(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("click", handleClickOutSideToPost);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("click", handleClickOutSideToPost);
    };
  }, []);

  useEffect(() => {
    const checkLike = post.like.some((l) => l._id === user._id);
    if (checkLike) {
      setLike(true);
    } else {
      setLike(false);
    }

    const checkSave = user?.savePost?.some((id) => id === post._id);
    if (checkSave) {
      setSave(true);
    } else {
      setSave(false);
    }

    const checkFollow = user?.following?.some((id) => id === post.userId._id);
    if (checkFollow) {
      setFollow(true);
    } else {
      setFollow(false);
    }
  }, [post, user._id, user.savePost]);

  const navigator = useNavigate();

  const givenDate = new Date(post.createdAt);
  const now = new Date();

  const differenceInMs = now - givenDate;

  const seconds = Math.floor(differenceInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const time =
    seconds < 60
      ? `${seconds}s`
      : minutes < 60
      ? `${minutes}m`
      : hours <= 24
      ? `${hours}h`
      : `${days}d`;

  // const

  const checkLogin = () => {
    if (!sessionStorage.getItem("access-token")) {
      toast.warn("you are not login, please login");
      navigator("/login");
      return false;
    }
    return true;
  };

  const addLike = async () => {
    if (!checkLogin()) {
      return;
    }

    setLike(true);
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/like/${post._id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
        },
      }
    );
    setPost(response.data.post);
    // setLengthLike(like + 1);
  };

  const removeLike = async () => {
    if (!checkLogin()) {
      return;
    }
    setLike(false);
    const response = await axios.delete(
      `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/like/${post._id}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
        },
      }
    );
    setPost(response.data.post);

    // setLengthLike(like - 1);
  };

  const handleClickComment = () => {
    if (!checkLogin() && comment.length <= 0) {
      return;
    }
    setShowComments(true);
  };

  const addComment = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/comment/${post._id}`,
      { message: comment },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
        },
      }
    );
    setComment("");
    setPost(response.data.post);
  };

  const removeComment = async (id) => {
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/comment/${post._id}`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
        },
      }
    );
    setPost(response.data.post);
  };

  const resetUpdate = async (id, message) => {
    setComment(message);
    setTarget(id);
  };

  const updateComment = async () => {
    if (!comment) {
      return;
    }

    const response = await axios.patch(
      `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/comment/${post._id}`,
      { id: target, message: comment },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
        },
      }
    );
    setTarget(null);
    setComment("");
    setPost(response.data.post);
  };

  const handleSavePost = async () => {
    if (!checkLogin()) {
      return;
    }
    setSave(true);

    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/user/savePost`,
      { postId: post._id },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
        },
      }
    );
    dispatch(userRegister(response.data.user));
  };

  const handleDeletePostSave = async () => {
    setSave(false);

    const response = await axios.delete(
      `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/user/deleteSavePost/${
        post._id
      }`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
        },
      }
    );
    dispatch(userRegister(response.data.user));
  };

  const handleDeletePost = async () => {
    const response = axios
      .delete(
        `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/post/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
          },
        }
      )
      .catch((e) => {
        console.log(e);
        toast.error("some thing error");
      });

    toast.promise(response, {
      pending: "Waiting...",
      success: {
        render() {
          setTimeout(() => {
            location.reload();
          }, 500);
          return "Deleted Successfully";
        },
      },
      error: "something error",
    });
  };

  const addFollowing = async () => {
    if (!checkLogin()) {
      return;
    }
    setFollow(true);
    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/user/follow`,
      { idUser: post.userId._id },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
        },
      }
    );
    dispatch(userRegister(response.data.user));
  };

  return (
    <>
      {props.id === 0 && (
        <div
          onClick={() => setShowCreatePost(true)}
          className="p-4 cursor-pointer lg:hidden bg-white shadow-2xl rounded-lg"
        >
          <div className="flex gap-3 items-center">
            <div>
              <img
                className="w-10 h-10 rounded-full "
                src={user.profileImage ? user.profileImage : img_blank}
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                readOnly
                placeholder="What are you thinking?"
                className="rounded-3xl w-full bg-gray-100 p-3 outline-none"
              />
            </div>
          </div>
        </div>
      )}
      {showCreatePost && (
        <div className="absolute w-full h-full bg-[#ebe6e78f] left-0 top-0 flex items-center justify-center">
          <div className="w-xl bg-white shadow-2xl rounded-xl relative">
            <span
              onClick={() => setShowCreatePost(false)}
              className="absolute cursor-pointer z-50 top-2 left-2 w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center"
            >
              <BsX size={"22px"} />
            </span>
            <AddPost />
          </div>
        </div>
      )}
      <div className="item bg-white rounded-lg">
        <div className="flex items-center p-5 justify-between">
          <Link
            to={
              post?.userId?._id === user?._id
                ? "profile"
                : `/user/${post?.userId?._id}`
            }
            className="flex items-center gap-2"
          >
            <img
              className="w-12 h-12 rounded-full"
              src={
                post?.userId?.profileImage
                  ? post?.userId?.profileImage
                  : img_blank
              }
            />
            <div className="flex flex-col">
              <p className="font-medium">{post.userId.name}</p>
              <p className="text-sm text-gray-600">{time}</p>
            </div>
          </Link>
          {post?.userId?._id !== user?._id ? (
            <div className="flex  items-center gap-4">
              {!follow ? (
                <button
                  onClick={addFollowing}
                  className="font-medium text-blue-500 cursor-pointer"
                >
                  Follow +
                </button>
              ) : (
                <button className="font-medium text-blue-500">
                  <FaUserCheck size={"23px"} />
                </button>
              )}
              {!save ? (
                <a
                  onClick={handleSavePost}
                  title="save post"
                  className="cursor-pointer"
                >
                  <BsBookmark size={"25px"} />
                </a>
              ) : (
                <a onClick={handleDeletePostSave} className="cursor-pointer">
                  <BsBookmarkFill size={"25px"} />
                </a>
              )}
            </div>
          ) : (
            <div className="relative dropdown-post">
              <button
                onClick={() => setDropdownPostMe(!dropdownPostMe)}
                className="font-medium cursor-pointer px-3 py-2 bg-gray-200 rounded-lg"
              >
                <FiMoreHorizontal />
              </button>

              {dropdownPostMe && (
                <div className="absolute p-2 rounded-lg bg-gray-200 right-0 flex flex-col mt-2 z-10 w-48 font-medium">
                  <button
                    onClick={handleDeletePost}
                    className="flex-1 flex items-center gap-2 py-3 px-6 text-center cursor-pointer hover:bg-gray-100 rounded-md"
                  >
                    <MdDelete size={"20px"} />
                    Delete Post
                  </button>
                  {!save ? (
                    <button
                      onClick={handleSavePost}
                      className="flex-1 flex items-center gap-2 py-3 px-6 text-center cursor-pointer hover:bg-gray-100 rounded-md"
                    >
                      <BsBookmark size={"20px"} />
                      Save Post
                    </button>
                  ) : (
                    <button
                      onClick={handleDeletePostSave}
                      className="flex-1 flex items-center gap-2 py-3 px-6 text-center cursor-pointer hover:bg-gray-100 rounded-md"
                    >
                      <BsBookmarkFill size={"20px"} />
                      UnSave Post
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <p className="font-medium mt-2 pl-3">{post.description} </p>
        <div className="flex items-center flex-wrap px-2 gap-3">
          {post.tags.map((name, index) => {
            return (
              <Link
                to={user._id === name._id ? `/profile` : `/user/${name._id}`}
                key={index}
                className="font-medium text-blue-500"
              >
                @{name.name}
              </Link>
            );
          })}
        </div>
        <div className="image">
          <img className="w-full mt-3" src={post.images[0]} />
        </div>
        <div className="p-4 flex items-center justify-between border-b border-gray-300">
          <div className="flex items-center gap-1 font-medium">
            <span>{post.like.length}</span>
            <span className="text-gray-600">Like</span>
          </div>
          <div className="flex items-center gap-1 font-medium">
            <span>{post.comments.length}</span>
            <span className="text-gray-600">Comment</span>
          </div>
        </div>
        <div className="flex items-center justify-around m-3 font-medium">
          {!like ? (
            <div
              onClick={addLike}
              className="py-2 px-5 rounded-lg flex items-center justify-center gap-2 transform duration-100 cursor-pointer hover:bg-gray-200 w-32"
            >
              <span>Like</span>
              {<SlLike />}
            </div>
          ) : (
            <div
              onClick={removeLike}
              className="py-2 px-5 rounded-lg flex items-center justify-center gap-2 transform duration-100 cursor-pointer hover:bg-gray-200 w-32"
            >
              <span className="text-sky-600">Like</span>

              {<img className="w-6" src={img_like} />}
            </div>
          )}
          <div
            onClick={handleClickComment}
            className="py-2 px-5 rounded-lg flex items-center justify-center gap-2 transform duration-100 cursor-pointer hover:bg-gray-200 min-w-32"
          >
            <span>Comment</span>
            <FaRegComment />
          </div>
        </div>
        {showComments && (
          <div className="fixed top-0 left-0 w-full h-full bg-[#6a72829e] z-40"></div>
        )}
        {showComments && (
          <div className="fixed rounded-lg overflow-hidden z-50 bg-gray-100 top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] w-[90%] max-w-[600px] h-[90%] max-h-[800px] flex flex-col">
            <div className="p-4 border-b border-gray-300 flex items-center justify-between bg-white sticky top-0 z-10">
              <button
                onClick={() => setShowComments(false)}
                x
                className="text-gray-600 hover:text-gray-900 cursor-pointer w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full"
              >
                <BsX size={"24px"} />
              </button>

              <h3 className="font-semibold text-xl">
                Post by {post.userId.name}
              </h3>

              <div className="w-6"></div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    className="w-12 h-12 rounded-full"
                    src={post?.userId?.profileImage || img_blank}
                    alt="Profile"
                  />
                  <div className="flex flex-col">
                    <p className="font-medium">{post.userId.name}</p>
                    <p className="text-sm text-gray-600">{time}</p>
                  </div>
                </div>
              </div>

              <p className="font-medium mt-2">{post.description}</p>

              <div className="image mt-3">
                <img className="w-full" src={post.images[0]} alt="Post" />
              </div>

              <div className="p-4 flex items-center justify-between border-b border-gray-300">
                <div className="flex items-center gap-1 font-medium">
                  <span>{post.like.length}</span>
                  <span className="text-gray-600">Like</span>
                </div>
                <div className="flex items-center gap-1 font-medium">
                  <span>{post.comments.length}</span>
                  <span className="text-gray-600">Comment</span>
                </div>
              </div>

              <div className="mt-4">
                {post.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex items-center justify-between mb-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={comment.user_id.profileImage || img_blank}
                        alt="Commenter"
                      />
                      <div className="flex flex-col">
                        <p className="font-medium">{comment.user_id.name}</p>
                        <p className="text-sm text-gray-600">
                          {comment.message}
                        </p>
                      </div>
                    </div>

                    {comment.user_id._id === user._id && (
                      <div className="relative">
                        <div
                          className="p-2 cursor-pointer rounded-lg bg-gray-200 flex items-center justify-center dropdown"
                          onClick={() => toggleDropdown(comment._id)}
                        >
                          <FiMoreHorizontal />
                        </div>

                        {openDropdownId === comment._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <ul className="font-medium">
                              <li
                                onClick={() => removeComment(comment._id)}
                                className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-1"
                              >
                                Delete Comment
                              </li>
                              <li
                                onClick={() =>
                                  resetUpdate(comment._id, comment.message)
                                }
                                className="p-3 hover:bg-gray-50 cursor-pointer"
                              >
                                Update Comment
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 w-full bg-white p-4 border-t border-gray-300">
              <div className="flex items-center gap-5">
                <img
                  className="w-10 h-10 rounded-full"
                  src={img_blank}
                  alt="User"
                />
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-auto p-3 outline-none bg-gray-200 rounded-lg"
                  type="text"
                  placeholder="Add Comment"
                />
                <button
                  onClick={!target ? addComment : updateComment}
                  className={
                    comment
                      ? "text-blue-500 cursor-pointer"
                      : "text-gray-300 cursor-not-allowed"
                  }
                >
                  <IoSend size={"20px"} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Item;

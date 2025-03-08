import "react";
import { useDispatch, useSelector } from "react-redux";
import img_cover from "../assets/cover image 2.png";
import img_blank from "../assets/blank profile.webp";
import { useEffect, useState } from "react";
import axios from "axios";
import Item from "../components/Item/Item";
import { BsX } from "react-icons/bs";
import { RiImageAddFill } from "react-icons/ri";
import { userRegister } from "../ReduxTK/UserSlice/userSlice";
import { FaCheck } from "react-icons/fa6";
import { PulseLoader } from "react-spinners";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

function Profile() {
  const user = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const [showEditSummary, setShowEditSummary] = useState(false);
  const [showEditBio, setShowEditBio] = useState(false);
  const [following, setFollowing] = useState(false);
  const [idFollowing, setIdFollowing] = useState(null);

  const [imgProfile, setImageProfile] = useState(user.profileImage);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false);
  const [imgCover, setImgCover] = useState(user.coverImage);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL_DEV
          }/api/v1/post/getPostsUserLogged`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
            },
          }
        );
        setPosts(response.data.data);
      } catch (e) {
        console.log(e);
        toast.error("something error");
      }

      try {
        const responseGetUser = await axios.get(
          `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/user/?limit=${6}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
            },
          }
        );
        setUsers(responseGetUser.data.users);
      } catch (e) {
        console.log(e);
        toast.error("something error");
      }
    };
    fetchData();
  }, []);

  const addFollowing = async (id) => {
    setIdFollowing(id);
    setFollowing(true);
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
  };

  const handleChangeImageProfile = async (e) => {
    if (e.target.files) {
      setLoadingProfile(true);
      const formData = new FormData();
      formData.append("images", e.target.files[0]);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/upload/upload-file`,
        formData
      );
      setImageProfile(response.data.data[0].url);
      setLoadingProfile(false);
    }
  };
  const handleChangeImageCover = async (e) => {
    if (e.target.files) {
      setLoadingCover(true);
      const formData = new FormData();
      formData.append("images", e.target.files[0]);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/upload/upload-file`,
        formData
      );
      setImgCover(response.data.data[0].url);
      setLoadingCover(false);
    }
  };

  const updateDataUser = async (e) => {
    const name = e.target.name;
    let data;
    if (name === "bio") {
      data = { bio };
      if (!bio || bio === user.bio) {
        setShowEditBio(false);
        return;
      }
    } else if (name === "imageProfile") {
      data = { profileImage: imgProfile };
    } else if (name === "imageCover") {
      data = { coverImage: imgCover };
    } else {
      data = { bio, profileImage: imgProfile, coverImage: imgCover };
    }

    const response = await axios.put(
      `${import.meta.env.VITE_SERVER_URL_DEV}/api/v1/user/updateDataUser`,
      data,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
        },
      }
    );
    setShowEdit(false);
    setShowEditBio(false);
    setShowEditSummary(false);
    setImageProfile(user.profileImage);
    setImgCover(user.coverImage);
    setImgCover(response.data.user.coverImage);
    setImageProfile(response.data.user.profileImage);
    dispatch(userRegister(response.data.user));
    toast.success("update success");
  };

  return (
    <div className="profile">
      <div className="bg-white shadow-2xs">
        <div className="container m-auto">
          <div className="image-cover w-full">
            {user.coverImage ? (
              <img
                className="h-64 w-full"
                src={user.coverImage ? user.coverImage : img_cover}
              />
            ) : (
              <div className="w-full h-60 bg-gray-200"></div>
            )}
          </div>
          <div className="flex justify-around items-center pb-8">
            <div className="flex gap-4">
              <div className="img-profile w-28 h-28 -mt-4">
                {!user.profileImage ? (
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
              <div className="flex flex-col mt-5">
                <p className="text-2xl font-medium">{user.name}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="font-medium text-sm text-gray-600">
                    Followers
                    <span className="font-semibold text-black">
                      {user.followers.length}
                    </span>
                  </span>
                  <span className="font-medium text-sm text-gray-600">
                    Following{" "}
                    <span className="font-semibold text-black">
                      {user.following.length}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowEdit(true)}
              className="w-52 py-3 h-fit text-lg font-medium rounded-lg bg-gray-200 cursor-pointer"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gray-100">
        <div className="container mx-auto">
          <div className="grid grid-cols-4 gap-5">
            <div className="col-span-3 flex flex-col gap-4 py-5">
              {posts.map((post, index) => {
                return <Item key={index} post={post} />;
              })}
            </div>
            <div className="mt-5">
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-medium">Brief summary</h3>
                <div>
                  {!showEditSummary && (
                    <div>
                      {user.bio ? (
                        <div className="font-medium text-center my-5">
                          {user.bio}
                        </div>
                      ) : (
                        <div className="font-medium my-5 text-center text-gray-600">
                          Nothing
                        </div>
                      )}
                    </div>
                  )}
                  {showEditSummary && (
                    <div className="w-full text-center my-6">
                      <input
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        type="text"
                        className="border p-4 rounded-lg outline-none "
                      />
                    </div>
                  )}
                </div>

                <div className="w-full">
                  {showEditSummary ? (
                    <button
                      onClick={updateDataUser}
                      name="bio"
                      className="p-2 rounded-xl text-center bg-blue-500 text-white w-full font-medium cursor-pointer mt-3"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowEditSummary(true)}
                      className="p-2 rounded-xl text-center bg-gray-200 w-full font-medium cursor-pointer mt-3"
                    >
                      Edit Resume
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-5 rounded-lg bg-white p-4">
                <h3 className="text-lg font-medium mb-4">Peoples</h3>
                <div className="flex flex-col gap-2 ">
                  {users.map((us, index) => {
                    if (
                      user._id !== us._id &&
                      !user.following.includes(us._id)
                    ) {
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              className="w-10 h-10 rounded-full "
                              src={
                                us.profileImage ? us.profileImage : img_blank
                              }
                            />
                            <p className="text-gray-700 font-medium">
                              {us.name}
                            </p>
                          </div>
                          <button
                            onClick={() => addFollowing(us._id)}
                            className="text-blue-500 font-medium cursor-pointer"
                          >
                            {following && idFollowing === us._id ? (
                              <FaCheck />
                            ) : (
                              "Follow +"
                            )}
                          </button>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showEdit && (
        <div className="fixed w-full h-full bg-[#ebe6e7a3] top-0 left-0 flex items-center justify-center edit">
          <div className="bg-white rounded-lg p-4 shadow-2xl relative w-2xl ">
            <button
              onClick={() => setShowEdit(false)}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full absolute top-4 left-4 cursor-pointer transform duration-150 hover:bg-gray-100"
            >
              <BsX size={"20px"} />
            </button>
            <h2 className="text-2xl font-semibold border-b border-gray-200 pb-5 text-center">
              Edit Profile
            </h2>
            <div className="edit-image-profile">
              <div className="flex items-center justify-between mt-5 text-xl font-medium">
                <p>Profile Image</p>
                {!loadingProfile ? (
                  <div>
                    {imgProfile && imgProfile !== user.profileImage ? (
                      <button
                        onClick={updateDataUser}
                        name="imageProfile"
                        className="text-blue-500 cursor-pointer"
                      >
                        Save
                      </button>
                    ) : (
                      <label htmlFor="imageProfile">
                        <p className="text-blue-500 cursor-pointer">Edit</p>
                      </label>
                    )}
                  </div>
                ) : (
                  <span>
                    <PulseLoader color="#2b7fff" />
                  </span>
                )}
                <input
                  onChange={handleChangeImageProfile}
                  id="imageProfile"
                  accept="image/*"
                  type="file"
                  hidden
                />
              </div>
              <div className="image flex items-center justify-center mt-5">
                <div className="relative">
                  <img
                    className="w-28 h-28 rounded-full"
                    src={imgProfile ? imgProfile : img_blank}
                  />
                  {user.profileImage !== imgProfile && (
                    <span
                      onClick={() => setImageProfile(user.profileImage)}
                      className="absolute -top-1 -right-2 cursor-pointer"
                    >
                      <MdDelete color="#b91c1c" size={"20px"} />
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="edit-image-cover">
              <div className="flex items-center justify-between mt-10 text-xl font-medium">
                <p>Cover Image</p>
                {!loadingCover ? (
                  <div>
                    {imgCover && imgCover !== user.coverImage ? (
                      <button
                        onClick={updateDataUser}
                        name="imageCover"
                        className="text-blue-500 cursor-pointer"
                      >
                        Save
                      </button>
                    ) : (
                      <label htmlFor="imageCover">
                        <p className="text-blue-500 cursor-pointer">Edit</p>
                      </label>
                    )}
                  </div>
                ) : (
                  <span>
                    <PulseLoader color="#2b7fff" />
                  </span>
                )}
                <input
                  onChange={handleChangeImageCover}
                  id="imageCover"
                  type="file"
                  hidden
                />
              </div>
              <div className="image flex items-center justify-center mt-5">
                {!imgCover ? (
                  <div className="w-full h-52 bg-gray-300 flex items-center justify-center">
                    <RiImageAddFill size={"50px"} />
                  </div>
                ) : (
                  <div className="w-full h-52">
                    <img className="h-full w-full" src={imgCover} />
                  </div>
                )}
              </div>
            </div>
            <div className="edit-image-cover">
              <div className="flex items-center justify-between mt-10 text-xl font-medium">
                <p>Bio</p>
                {!showEditBio ? (
                  <button
                    onClick={() => setShowEditBio(true)}
                    className="text-blue-500 cursor-pointer"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={updateDataUser}
                    name="bio"
                    className="text-blue-500 cursor-pointer"
                  >
                    Save
                  </button>
                )}
              </div>
              {!showEditBio && (
                <div>
                  {user.bio ? (
                    <div className="text-center my-4 text-lg">{bio}</div>
                  ) : (
                    <div className="text-center my-4 text-lg">Nothing</div>
                  )}
                </div>
              )}
              {showEditBio && (
                <div className="text-center">
                  <input
                    value={bio}
                    name="bio"
                    onChange={(e) => setBio(e.target.value)}
                    type="text"
                    className="p-3 border border-gray-300 rounded-lg outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;

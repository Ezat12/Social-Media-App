import React from "react";
// import { Link } from "react-router-dom";
import img_blank_profile from "../../assets/blank profile.webp";
import img_friends from "../../assets/Icons/friends.png";
import img_save from "../../assets/Icons/Save.png";
import img_setting from "../../assets/Icons/setting.svg";
import img_logout from "../../assets/Icons/Logout.png";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";

function Sidebar() {
  const user = useSelector((state) => state.user);
  const navigator = useNavigate();

  const clickLogout = () => {
    sessionStorage.removeItem("access-token");
    navigator("/login");
  };

  return (
    <div className="lg:col-span-1 md:col-span-2 lg:block md:block hidden">
      <ul className="flex flex-col gap-6 w-full">
        <Link
          to="/profile"
          className="flex items-center justify-between w-full h-[56px] px-5 py-2 cursor-pointer rounded-2xl transform duration-100 hover:bg-gray-100"
        >
          <img
            className="w-10 h-10 rounded-full"
            src={user.profileImage ? user.profileImage : img_blank_profile}
            alt="Profile"
          />
          <span className="font-medium">{user.name}</span>
        </Link>
        <Link
          to="/followers"
          className="flex items-center gap-5 w-full h-[56px] px-5 py-2 cursor-pointer rounded-2xl transform duration-100 hover:bg-gray-100"
        >
          <img
            className="w-10 h-10 rounded-full"
            src={img_friends}
            alt="Followers"
          />
          <span className="font-medium">Followers</span>
        </Link>
        <Link
          to="/save-posts"
          className="flex items-center gap-5 w-full h-[56px] px-5 py-2 cursor-pointer rounded-2xl transform duration-100 hover:bg-gray-100"
        >
          <img
            className="w-10 h-10 rounded-full"
            src={img_save}
            alt="Save Posts"
          />
          <span className="font-medium">Posts Save</span>
        </Link>
        <Link
          to="/setting"
          className="flex items-center gap-5 w-full h-[56px] px-5 py-2 cursor-pointer rounded-2xl transform duration-100 hover:bg-gray-100"
        >
          <img
            className="w-9 h-9 rounded-full"
            src={img_setting}
            alt="Setting"
          />
          <span className="font-medium">Setting</span>
        </Link>
        <li
          onClick={clickLogout}
          className="flex items-center gap-5 w-full h-[56px] px-5 py-2 cursor-pointer rounded-2xl transform duration-100 hover:bg-gray-100"
        >
          <img className="w-9 h-9 rounded-full" src={img_logout} alt="Logout" />
          <span className="font-medium">Logout</span>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;

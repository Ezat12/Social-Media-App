import "react";
import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import Home from "./components/Home/Home";
import Followers from "./components/Followers/Followers";
import SavePosts from "./components/Save Posts/SavePosts";
import Setting from "./components/Setting/Setting";
import Profile from "./pages/Profile";
import ProfilePeople from "./components/ProfilePeople/ProfilePeople";
import ShowPost from "./components/Show Post/ShowPost";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element=<Home /> />
        <Route path="/followers" element={<Followers />} />
        <Route path="/save-posts" element={<SavePosts />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/login" element=<Login /> />
        <Route path="/profile" element=<Profile /> />
        <Route path="/user/:userId" element=<ProfilePeople /> />
        <Route path="post/:postId" element=<ShowPost /> />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;

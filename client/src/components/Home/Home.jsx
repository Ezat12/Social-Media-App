import "react";
import Sidebar from "../Sidebar/Sidebar";
import Posts from "../Posts/Posts";


function Home() {
  return (
    <div className="home p-5">
      <div className="grid grid-cols-5 gap-4">
        <Sidebar />
        <div className="col-span-4">
          <Posts />
        </div>
      </div>
    </div>
  );
}

export default Home;

import "react";
import Sidebar from "../Sidebar/Sidebar";
import Posts from "../Posts/Posts";


function Home() {
  return (
    <div className="home p-1 lg:p-5 md:p-5">
      <div className="grid md:grid-cols-7 lg:grid-cols-5 gap-4">
        <Sidebar />
        <div className="md:col-span-5 lg:col-span-4">
          <Posts />
        </div>
      </div>
    </div>
  );
}

export default Home;

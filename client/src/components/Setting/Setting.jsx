import React from 'react'
import Sidebar from '../Sidebar/Sidebar';

function Setting() {
  return (
    <div className="home p-5">
      <div className="grid grid-cols-5 gap-4">
        <Sidebar />
        <div className="col-span-4">
          <span>Setting</span>
        </div>
      </div>
    </div>
  );
}

export default Setting
import React from "react";
import { Outlet } from "react-router-dom";
import Alert from "./Alert";
import Footer from "./Footer";

const Base = () => {
  return (
    <>
      <div className="fixed-bottom ml-auto md:w-1/2 md:mr-6">
        <Alert />
      </div>
      {/* isShown && */}
      <Outlet />
      <Footer />
    </>
  );
};

export default Base;

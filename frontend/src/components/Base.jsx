import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Alert from "./Alert";

const selectAlert = state => state.alert;

const Base = () => {
  const dispatch = useDispatch();
  //   DEBUG use title
  const { color, title, text, isShown } = useSelector(selectAlert);
  return (
    <>
      <div className="fixed-bottom ml-auto md:w-1/2 md:mr-6">
        <Alert isShown={isShown} title={title} text={text} color={color} />
      </div>
      {/* isShown && */}
      <Outlet />
    </>
  );
};

export default Base;

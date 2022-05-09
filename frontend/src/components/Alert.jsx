import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeMessage } from "../slices/alertSlice";

const Alert = ({ isShown, title, text, color }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let closeTimeout;
    if (isShown) {
      if (closeTimeout) clearTimeout(closeTimeout);
      closeTimeout = setTimeout(() => {
        dispatch(removeMessage());
      }, 6900);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShown]);

  return (
    // <div
    //   className={`text-white px-6 py-4 border-0 rounded relative mb-4 bg-${color}-500`}
    // >
    <div
      className={`text-white mx-4 md:mx-0 px-3 md:px-6 py-4 md:py-5 border-0 rounded relative ease-in-out transition-all duration-500 ${
        isShown ? "mb-4" : "-mb-24"
      } bg-green-500`}
    >
      <span className="inline-block align-middle mr-8">
        <b>{title}</b> {text}
      </span>
      <button
        className="hover:text-gray-200 absolute bg-transparent text-2xl font-semibold leading-none right-0 mr-6 outline-none focus:outline-none"
        onClick={() => isShown && dispatch(removeMessage())}
      >
        <span>&times;</span>
      </button>
    </div>
  );
};

export default Alert;

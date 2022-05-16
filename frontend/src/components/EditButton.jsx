import React from "react";
import { Pencil, X } from "react-bootstrap-icons";

const EditButton = ({
  showText,
  isClose,
  disabled,
  purple,
  text,
  className,
  ...rest
}) => {
  return (
    <button
      disabled={disabled}
      className={`flex items-center ${
        showText ? "rounded-xl py-2 px-4" : "rounded-full"
      } p-3 border ${
        purple
          ? "text-white border-none disabled:bg-purple-400 bg-purple-500 hover:bg-purple-600 active:bg-purple-700"
          : "bg-white disabled:bg-gray-50 hover:bg-gray-100 active:bg-gray-200"
      } transition-colors ${className || ""} ${
        disabled ? "cursor-not-allowed" : ""
      }`}
      {...rest}
    >
      {isClose ? <X /> : <Pencil />}
      {showText && (
        <span className="ml-1">
          {text || (isClose ? "Chiudi" : "Modifica")}
        </span>
      )}
    </button>
  );
};

export default EditButton;

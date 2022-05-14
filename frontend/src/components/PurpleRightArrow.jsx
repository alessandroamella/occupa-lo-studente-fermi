import React from "react";
import { ArrowRight } from "react-bootstrap-icons";

const PurpleRightArrow = ({ active, isFocused, isHovered }) => {
  return (
    <div className="float-right flex text-4xl items-center ml-4">
      <ArrowRight
        className={`p-2 rounded-full transition-all ${
          isHovered || isFocused || active
            ? `${
                active === undefined || !active
                  ? "bg-gray-300"
                  : "bg-purple-500 text-white"
              } `
            : ""
        }`}
      />
    </div>
  );
};

export default PurpleRightArrow;

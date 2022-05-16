import React from "react";
import { ArrowLeft } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const BackButton = ({ path }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path || -1)}
      className="p-2 rounded-lg border flex items-center transition-colors hover:bg-gray-100 active:bg-gray-200"
    >
      <ArrowLeft />
      <span className="ml-1">Indietro</span>
    </button>
  );
};

export default BackButton;

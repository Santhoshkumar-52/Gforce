import React from "react";

const LoadButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors duration-200`}
    >
      Load
    </button>
  );
};

export default LoadButton;

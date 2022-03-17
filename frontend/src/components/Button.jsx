import React from "react";

const Button = ({ text, onClick, className, ...props }) => {
    return (
        <div
            className="w-screen h-screen flex justify-center items-center bg-gray-100"
            {...props}
        >
            <button
                className={`rounded bg-lime-500 text-white p-3 focus:outline-none hover:bg-lime-600 active:bg-lime-700 transition-colors ${className}`}
            >
                {text || "Inserisci testo"}
            </button>
        </div>
    );
};

export default Button;

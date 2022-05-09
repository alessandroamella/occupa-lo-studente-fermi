import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import { removeMessage } from "./slices/alertSlice";
import { CSSTransition } from "react-transition-group";
import { useState } from "react";

const selectAlert = state => state.alert;

function App() {
  const dispatch = useDispatch();
  const { type, title, text, isShown } = useSelector(selectAlert);
  return (
    <div className="App">
      {isShown && (
        <CSSTransition in={isShown} timeout={3000} unmountOnExit>
          <div
            className={`text-black py-3 rounded-lg absolute w-[90vw] md:w-1/2 mx-auto left-0 right-0 top-3 text-center ${
              type === "success"
                ? "bg-green-200 border-green-300 border-2"
                : type === "danger"
                ? "bg-red-200"
                : "bg-blue-200"
            }`}
          >
            {text}
            <button
              onClick={() => dispatch(removeMessage())}
              className="float-right mr-3 transition-colors rounded"
            >
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                fill-rule="evenodd"
                clip-rule="evenodd"
                className="scale-75"
              >
                <path
                  className="fill-gray-600 hover:fill-black"
                  d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z"
                />
              </svg>
            </button>
          </div>
        </CSSTransition>

        // <Alert
        //   variant={type}
        //   onClose={() => dispatch(removeMessage())}
        //   dismissible
        //   className="absolute w-[90vw] md:w-1/2 mx-auto left-0 right-0 top-3 text-center"
        // >
        //   {title && <Alert.Heading>{title}</Alert.Heading>}

        //   <p>{text}</p>
        // </Alert>
      )}
      <Outlet />
    </div>
  );
}

export default App;

import Middle from "./Middle";
import { Outlet } from "react-router-dom";

function Homepage() {
    return (
        <div>
            <Middle />
            <Outlet />
        </div>
    );
}

export default Homepage;

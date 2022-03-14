import Upheader from "./components/Upheader";
import Test from "./components/Test";
import axios from "axios";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
    const [student, setStudent] = useState(null);
    const [loginLoaded, setLoginLoaded] = useState(false);
    const { state } = useLocation();

    async function logout() {
        setLoginLoaded(false);
        try {
            await axios.get("/api/student/auth/logout");
            // DEBUG
            console.log("Student logged out");
            setStudent(null);
        } catch (err) {
            console.log("Student not logged out");
        } finally {
            setLoginLoaded(true);
        }
    }

    useEffect(() => {
        async function fetchStudent() {
            setLoginLoaded(false);
            try {
                const { data } = await axios.get("/api/student/current");
                // DEBUG
                console.log("Student logged in", data);
                setStudent(data);
            } catch (err) {
                console.log("Student not logged in");
                setStudent(null);
            } finally {
                setLoginLoaded(true);
            }
        }
        if (!state?.student) return fetchStudent();
        console.log("state.student", state.student);
        setStudent(state.student);
        setLoginLoaded(true);

        // Clear state
        window.history.replaceState(null, "");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(state)]);

    return (
        <div className="App" >
            <Upheader
                loginLoaded={loginLoaded}
                student={student}
                logout={logout}
            />
            <Outlet />
            <Test></Test>
        </div>
    );
}

export default App;

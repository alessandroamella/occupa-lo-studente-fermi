import Upheader from "./components/Upheader";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
    const [student, setStudent] = useState(null);
    const [loginLoaded, setLoginLoaded] = useState(false);

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
        fetchStudent();
    }, []);

    return (
        <div className="App">
            <Upheader
                loginLoaded={loginLoaded}
                student={student}
                logout={logout}
            />
            <Outlet />
        </div>
    );
}

export default App;

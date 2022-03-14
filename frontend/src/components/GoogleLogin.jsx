import React, { useState } from "react";
import GoogleButton from "react-google-button";
import axios from "axios";

const GoogleLogin = () => {
    const [disabled, setDisabled] = useState(false);

    async function getLoginURL() {
        setDisabled(true);
        try {
            const { data } = await axios.get("/api/student/auth/google", {
                params: { redirectTo: window.location.href }
            });
            if (!data.url) throw new Error("No data.url");
            window.open(data.url, "_self");
        } catch (err) {
            // DEBUG - don't use alert
            alert("Error while loading Google auth URL");
            console.trace(err);
            setDisabled(false);
        }
    }

    return (
        <GoogleButton disabled={disabled} type="dark" onClick={getLoginURL} />
    );
};

export default GoogleLogin;

import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

import envs from "./_envs";

/*******************/
/** CONFIGURATION **/
/*******************/

const googleConfig = {
    clientId: envs.GOOGLE_CLIENT_ID, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
    clientSecret: envs.GOOGLE_CLIENT_SECRET, // e.g. _ASDFA%DFASDFASDFASD#FAD-
    redirect: envs.GOOGLE_REDIRECT_URL // this must match your google api settings
};

const defaultScope = [
    "https://www.googleapis.com/auth/plus.me",
    "https://www.googleapis.com/auth/userinfo.email"
];

/*************/
/** HELPERS **/
/*************/

function createConnection() {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

function getConnectionUrl(auth: OAuth2Client) {
    return auth.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: defaultScope
    });
}

import { OAuth2Client } from "google-auth-library";
import { google, oauth2_v2 } from "googleapis";
import jwt from "jsonwebtoken";

import { Envs } from "@config";

import { logger } from "@shared";

logger.info("Loading Google config...");

export class GoogleAuthService {
    public static oauth2 = google.oauth2("v2");

    public static clientId: string = null as unknown as string;
    public static clientSecret: string = null as unknown as string;
    public static redirect: string = null as unknown as string;

    private static defaultScope = [
        "https://www.googleapis.com/auth/plus.me",
        "https://www.googleapis.com/auth/userinfo.email"
    ];

    private static _staticConstructor = (() => {
        GoogleAuthService.clientId = Envs.env.GOOGLE_CLIENT_ID;
        GoogleAuthService.clientSecret = Envs.env.GOOGLE_CLIENT_SECRET;
        GoogleAuthService.redirect = Envs.env.GOOGLE_REDIRECT_URL;

        logger.info("Google config envs loaded");
    })();

    public static async createConnection() {
        return new google.auth.OAuth2(
            GoogleAuthService.clientId,
            GoogleAuthService.clientSecret,
            GoogleAuthService.redirect
        );
    }

    public static async getConnectionUrl(auth: OAuth2Client) {
        return auth.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            include_granted_scopes: true,
            scope: GoogleAuthService.defaultScope
        });
    }

    /**
     * Extract the email and id of the google account from the "code" parameter.
     */
    public static async getGoogleAccountFromCode(
        code: string
    ): Promise<oauth2_v2.Schema$Userinfo> {
        const auth = await GoogleAuthService.createConnection();

        // get the auth "tokens" from the request
        const data = await auth.getToken(code);
        const tokens = data.tokens;

        // add the tokens to the google api so we have access to the account
        auth.setCredentials(tokens);

        const userInfo = await GoogleAuthService.oauth2.userinfo.get({
            auth: auth
        });

        // return so we can login or sign up the user
        return userInfo.data;
    }

    // Create cookie containing Google data
    public static async createTempAuthDataCookie(
        tempData: oauth2_v2.Schema$Userinfo
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(tempData, Envs.env.JWT_SECRET, {}, (err, cookie) => {
                if (err) return reject(err);
                else if (!cookie)
                    return reject(
                        "createTempAuthDataCookie returned no cookie"
                    );
                else return resolve(cookie);
            });
        });
    }

    // Parse cookie containing Google data
    public static async parseTempAuthDataCookie(
        tempDataJWT: string
    ): Promise<oauth2_v2.Schema$Userinfo> {
        return new Promise((resolve, reject) => {
            jwt.verify(tempDataJWT, Envs.env.JWT_SECRET, {}, (err, payload) => {
                if (err) return reject(err);
                else if (!payload)
                    return reject("parseTempAuthDataCookie empty payload");
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                else return resolve(payload as any);
            });
        });
        // return jwt.(tempData, Envs.env.JWT_SECRET);
    }

    public static getRedirectUrlFromTempData(
        tempData: oauth2_v2.Schema$Userinfo
    ) {
        const url = new URL(Envs.env.SIGNUP_URL);
        for (const [key, entry] of Object.entries(tempData)) {
            url.searchParams.append(key, entry);
        }
        return url.toString();
    }
}

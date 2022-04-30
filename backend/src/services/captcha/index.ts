import axios from "axios";

import { Envs } from "@config";

import { logger } from "@shared";

interface CaptchaResponse {
    success: boolean;
    challenge_ts: string; // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
    hostname: string; // the hostname of the site where the reCAPTCHA was solved
    "error-codes"?: string[]; // optional
}

class CaptchaService {
    /**
     * Checks whether Google ReCAPTCHA token is valid
     * Throws an error if an error occurs during the API call
     * @param  {string} token ReCAPTCHA token generated from the client
     * @returns {boolean} whether it's valid or not
     */
    public static async verify(token: string): Promise<boolean> {
        let data: CaptchaResponse;

        try {
            const res = await axios.post(
                "https://www.google.com/recaptcha/api/siteverify",
                {},
                {
                    params: {
                        secret: Envs.env.GOOGLE_RECAPTCHA_SECRET_KEY,
                        response: token
                    }
                }
            );
            data = res.data;
        } catch (err) {
            logger.error("Error while fetching Google Captcha API");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            logger.error(((err as any) || {}).response?.data || err);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            throw new Error(
                (axios.isAxiosError(err) && (err.response?.data as string)) ||
                    (err as string)
            );
        }
        return data.success;
    }
}

export default CaptchaService;

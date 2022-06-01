import { Schema } from "express-validator";

export const addViewSchema: Schema = {
    jobOffer: {
        in: "body",
        errorMessage: "JobOffer ObjectId not specified",
        isMongoId: {
            errorMessage: "JobOffer ObjectId is not a valid ObjectId"
        }
    },
    captcha: {
        in: "body",
        errorMessage: "ReCAPTCHA token not specified",
        isString: {
            errorMessage: "ReCAPTCHA token must be string"
        }
    }
};

export default addViewSchema;

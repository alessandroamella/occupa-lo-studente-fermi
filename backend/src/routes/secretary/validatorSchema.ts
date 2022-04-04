import { Schema } from "express-validator";

export const validatorSchema: Schema = {
    username: {
        in: "query",
        errorMessage: "Secretary username not specified",
        isLength: {
            errorMessage: "Secretary username must be 5-64 characters long",
            options: { min: 5, max: 64 }
        }
    },
    password: {
        in: "query",
        errorMessage: "Secretary password not specified",
        isLength: {
            options: { min: 16, max: 16 },
            errorMessage: "Secretary password must be 16 characters long"
        }
    }
};

export default validatorSchema;

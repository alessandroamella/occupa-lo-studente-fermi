import { Schema } from "express-validator";

/**
 * @openapi
 *
 *  components:
 *    schemas:
 *      AgencyLoginParams:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *            description: Email of the agency
 *          password:
 *            type: string
 *            format: password
 *            description: Password used for login
 */

export const loginSchema: Schema = {
    email: {
        in: "body",
        errorMessage: "Email not specified",
        isEmail: {
            errorMessage: "Invalid email"
        },
        trim: {}
    },
    password: {
        in: "body",
        errorMessage: "Password not specified",
        trim: {}
    }
};

export default loginSchema;

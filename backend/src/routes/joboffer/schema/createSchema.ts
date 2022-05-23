import { Schema } from "express-validator";
import moment from "moment";
import sanitizeHtml from "sanitize-html";

// Same as validatorSchema but without agency
// (isLoggedIn middleware, no need to check)
export const validatorSchema: Schema = {
    title: {
        in: "body",
        errorMessage: "Title not specified",
        isLength: {
            errorMessage: "Title must be 5-32 characters long",
            options: { min: 5, max: 32 }
        }
    },
    description: {
        in: "body",
        errorMessage: "Description not specified",
        isLength: {
            errorMessage: "Description must be 50-3000 characters long",
            options: { min: 50, max: 3000 }
        },
        customSanitizer: {
            options: html => sanitizeHtml(html)
        }
    },
    fieldOfStudy: {
        in: "body",
        errorMessage: "Field of study not specified",
        isIn: {
            options: [["any", "it", "electronics", "chemistry"]],
            errorMessage: "Invalid field of study"
        }
    },
    expiryDate: {
        in: "body",
        errorMessage: "Expiry date not specified",
        isISO8601: {
            errorMessage: "Expiry date is not a valid date"
        },
        custom: {
            errorMessage: "Expiry date must be at most 1 year from now",
            options: (v: Date) =>
                !!v &&
                moment(v).isValid() &&
                moment(v).diff(moment(), "months") <= 12
        },
        optional: true
    },
    mustHaveDiploma: {
        in: "body",
        errorMessage: "Must have diploma not specified",
        isBoolean: {
            errorMessage: "Must have diploma must be a boolean"
        }
    },
    numberOfPositions: {
        in: "body",
        errorMessage: "Number of positions not specified",
        isInt: {
            errorMessage: "Number of positions must be between 1 and 10",
            options: { min: 1, max: 10 }
        }
    }
};

export default validatorSchema;

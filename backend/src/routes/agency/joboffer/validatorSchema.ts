import CodiceFiscale from "codice-fiscale-js";
import { Schema } from "express-validator";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import moment from "moment";

import { logger, urlExists } from "@shared";

export const validatorSchema: Schema = {
    agency: {
        in: "body",
        errorMessage: "Agency ObjectId not specified",
        isMongoId: {
            errorMessage: "Agency ObjectId is not a valid ObjectId"
        }
    },
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
        isDate: {
            errorMessage: "Expiry date is not a valid date"
        },
        custom: {
            errorMessage: "Expiry date must be at most 1 year from now",
            options: (v: Date) =>
                !!v &&
                moment(v).isValid() &&
                moment(v).diff(moment(), "months") <= 12
        }
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
            errorMessage: "Number of positions must be an integer >= 1",
            options: { min: 1 }
        }
    }
};

export default validatorSchema;

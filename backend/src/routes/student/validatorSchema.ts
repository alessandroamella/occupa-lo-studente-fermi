import CodiceFiscale from "codice-fiscale-js";
import { Schema } from "express-validator";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import moment from "moment";

import { logger } from "@shared";

// Don't validate data given by Google
export const studentValidatorSchema: Schema = {
    firstName: {
        in: "body",
        errorMessage: "First name not specified",
        isString: {
            errorMessage: "firstName must be string"
        },
        trim: {}
    },
    lastName: {
        in: "body",
        errorMessage: "Last name not specified",
        isString: {
            errorMessage: "lastName must be string"
        },
        trim: {}
    },
    fiscalNumber: {
        in: "body",
        errorMessage: "Fiscal number not specified",
        isString: {
            errorMessage: "fiscalNumber must be string"
        },
        custom: {
            // errorMessage: "Invalid fiscal number",
            options: value => {
                if (!CodiceFiscale.check(value)) {
                    logger.debug("Student fiscal number is invalid");
                    throw new Error("Invalid fiscal number");
                }

                const cf = new CodiceFiscale(value);
                // only 16 year olds and older
                if (moment().diff(moment(cf.birthday), "years") < 16) {
                    logger.debug("Student is not old enough (< 16)");
                    throw new Error("Student must be at least 16");
                }
                return true;
            }
        },
        trim: {}
    },
    curriculumLink: {
        in: "body",
        errorMessage: "Curriculum link not specified",
        optional: true,
        isURL: {
            errorMessage: "curriculumLink must be a valid URL"
        },
        trim: {}
    },
    phoneNumber: {
        in: "body",
        errorMessage: "Phone number not specified",
        isString: {
            bail: true,
            errorMessage: "Phone number must be a string"
        },
        custom: {
            options: value => {
                if (!isValidPhoneNumber(value, "IT")) {
                    throw new Error("Invalid phone number");
                }
                return true;
            }
        },
        customSanitizer: {
            options: value => {
                return parsePhoneNumber(value, "IT").format("E.164");
            }
        },
        trim: {}
    },
    fieldOfStudy: {
        in: "body",
        errorMessage: "Field of study not specified",
        isIn: {
            options: [["any", "it", "electronics", "chemistry"]],
            errorMessage: "Invalid field of study"
        }
    }
};

export default studentValidatorSchema;

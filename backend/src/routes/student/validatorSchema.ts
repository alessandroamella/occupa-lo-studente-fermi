import CodiceFiscale from "codice-fiscale-js";
import { Schema } from "express-validator";
import { isValidPhoneNumber } from "libphonenumber-js";
import moment from "moment";

// import { Envs } from "@config";

// Don't validate data given by Google
export const studentValidatorSchema: Schema = {
    // googleId: {
    //     in: "body",
    //     errorMessage: "Invalid Google ID",
    //     isString: {
    //         errorMessage: "googleId must be string"
    //     }
    // },
    // firstName: {
    //     in: "body",
    //     errorMessage: "Invalid first name",
    //     isString: {
    //         errorMessage: "firstName must be string"
    //     }
    // },
    // lastName: {
    //     in: "body",
    //     errorMessage: "Invalid last name",
    //     isString: {
    //         errorMessage: "lastName must be string"
    //     }
    // },
    fiscalNumber: {
        in: "body",
        errorMessage: "Invalid fiscal number",
        isString: {
            errorMessage: "fiscalNumber must be string"
        },
        custom: {
            errorMessage: "Invalid fiscal number",
            options: value => {
                if (!CodiceFiscale.check(value)) {
                    throw new Error("Invalid fiscal code");
                }

                const cf = new CodiceFiscale(value);
                // only 16 year olds and older
                if (moment().diff(moment(cf.birthday), "years") < 16) {
                    throw new Error("Student must be at least 16");
                }
                return true;
            }
        }
    },
    curriculumLink: {
        in: "body",
        errorMessage: "Invalid curriculum link",
        optional: true,
        isURL: {
            errorMessage: "curriculumLink must be a valid URL"
        }
    },
    // email: {
    //     in: "body",
    //     errorMessage: "Invalid email",
    //     isEmail: {
    //         errorMessage: "Invalid email"
    //     },
    //     custom: {
    //         options: (value: string) => {
    //             if (!value.endsWith(Envs.env.EMAIL_SUFFIX)) {
    //                 throw new Error(
    //                     `Email doesn't end with specified suffix "${Envs.env.EMAIL_SUFFIX}"`
    //                 );
    //             }
    //             return true;
    //         }
    //     }
    // },
    phoneNumber: {
        in: "body",
        errorMessage: "Invalid phone number",
        custom: {
            options: value => {
                if (!isValidPhoneNumber(value, "IT")) {
                    throw new Error("Invalid phone number");
                }
                return true;
            }
        }
    }
};

export default studentValidatorSchema;

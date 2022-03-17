import CodiceFiscale from "codice-fiscale-js";
import { Schema } from "express-validator";
import { isValidPhoneNumber } from "libphonenumber-js";
import moment from "moment";

import { logger } from "@shared";

export const validatorSchema: Schema = {
    responsibleFirstName: {
        in: "body",
        errorMessage: "Invalid agency's responsible first name",
        isLength: {
            errorMessage:
                "Agency's responsible first name must be 1-100 characters long",
            options: { min: 1, max: 100 }
        }
    },
    responsibleLastName: {
        in: "body",
        errorMessage: "Invalid agency's responsible first name",
        isLength: {
            errorMessage:
                "Agency's responsible first name must be 1-100 characters long",
            options: { min: 1, max: 100 }
        }
    },
    responsibleFiscalNumber: {
        in: "body",
        errorMessage: "Invalid fiscal number",
        isString: {
            errorMessage: "fiscalNumber must be string"
        },
        custom: {
            // errorMessage: "Invalid fiscal number",
            options: value => {
                if (!CodiceFiscale.check(value)) {
                    logger.debug("Invalid fiscal number");
                    throw new Error("Invalid fiscal number");
                }

                const cf = new CodiceFiscale(value);
                // only 18 year olds and older
                if (moment().diff(moment(cf.birthday), "years") < 18) {
                    logger.debug(
                        "Agency's responsible is not old enough (< 18)"
                    );
                    throw new Error("Agency's responsible must be at least 18");
                }
                return true;
            }
        }
    },
    email: {
        in: "body",
        errorMessage: "Invalid email",
        isEmail: {
            errorMessage: "Invalid email"
        }
    },
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
    },
    agencyName: {
        in: "body",
        errorMessage: "Invalid agency name",
        isLength: {
            errorMessage: "Invalid agency name length",
            options: { min: 1, max: 100 }
        }
    },
    agencyDescription: {
        in: "body",
        errorMessage: "Invalid agency description",
        isLength: {
            errorMessage: "Description must be 16-1000 characters long",
            options: { min: 16, max: 1000 }
        }
    },
    agencyAddress: {
        in: "body",
        errorMessage: "Invalid agency address",
        isLength: {
            errorMessage: "Agency address must be at least 3 characters long",
            options: { min: 3 }
        }
    },
    vatCode: {
        in: "body",
        errorMessage: "Invalid agency VAT code"
    },
    logoUrl: {
        in: "body",
        errorMessage: "Invalid logo URL",
        isURL: {
            errorMessage: "Logo URL must be an URL"
        },
        optional: true
    }
};

export default validatorSchema;

import { Schema } from "express-validator";

import { AgencyService, JobOfferService, StudentService } from "@services";
import { logger } from "@shared";

// Many fields are already validated from student
export const studentValidatorSchema: Schema = {
    fromStudent: {
        in: "body",
        errorMessage: "Student ObjectId not specified",
        isMongoId: {
            errorMessage: "Student ObjectId is not a valid ObjectId"
        },
        custom: {
            errorMessage: "Student not found",
            options: async _id => {
                try {
                    return await StudentService.findOne({ _id });
                } catch (err) {
                    logger.error(
                        "Error while finding student in jobApplication validator schema"
                    );
                    logger.error(err);
                    return false;
                }
            }
        }
    },
    forAgency: {
        in: "body",
        errorMessage: "Agency ObjectId not specified",
        isMongoId: {
            errorMessage: "Agency ObjectId is not a valid ObjectId"
        },
        custom: {
            errorMessage: "Agency must be approved",
            options: async _id => {
                try {
                    const doc = await AgencyService.findOne({ _id });
                    return doc?.approvalStatus === "approved";
                } catch (err) {
                    logger.error(
                        "Error while finding agency in jobApplication validator schema"
                    );
                    logger.error(err);
                    return false;
                }
            }
        }
    },
    forJobOffer: {
        in: "body",
        errorMessage: "JobOffer ObjectId not specified",
        isMongoId: {
            errorMessage: "Agency ObjectId is not a valid ObjectId"
        },
        custom: {
            errorMessage: "Job offer doesn't exist",
            options: async _id => {
                try {
                    return await JobOfferService.findOne({ _id });
                } catch (err) {
                    logger.error(
                        "Error while finding jobOffer in jobApplication validator schema"
                    );
                    logger.error(err);
                    return false;
                }
            }
        },
        optional: true
    },
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
        trim: {}
    },
    curriculum: {
        in: "body",
        errorMessage: "Curriculum not specified",
        optional: true,
        isString: {
            errorMessage: "Curriculum must be a string"
        }
    },
    message: {
        in: "body",
        errorMessage: "Message not specified",
        optional: true,
        isString: {
            errorMessage: "Message must be a string"
        },
        isLength: {
            errorMessage: "Message must be between 1-3000 characters long",
            options: { min: 1, max: 3000 }
        },
        trim: {}
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
        errorMessage: "Phone number not specified",
        isString: {
            bail: true,
            errorMessage: "Phone number must be a string"
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
    hasDrivingLicense: {
        in: "body",
        errorMessage: "Has driving license not specified",
        isBoolean: {
            errorMessage: "Has driving license must be a boolean"
        },
        toBoolean: {}
    },
    canTravel: {
        in: "body",
        errorMessage: "Can travel not specified",
        isBoolean: {
            errorMessage: "Can travel must be a boolean"
        },
        toBoolean: {}
    }
};

export default studentValidatorSchema;

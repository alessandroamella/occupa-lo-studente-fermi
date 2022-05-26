import { Schema } from "express-validator";

import { AgencyService, JobOfferService } from "@services";
import { logger } from "@shared";

// Many fields are already validated from student
export const jobApplicationValidatorSchema: Schema = {
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
            errorMessage: "JobOffer ObjectId is not a valid ObjectId"
        },
        custom: {
            errorMessage: "JobOffer doesn't exist",
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
    }
};

export default jobApplicationValidatorSchema;

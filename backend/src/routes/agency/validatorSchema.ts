import { Schema } from "express-validator";

import { Employer } from "@models";

export const validatorSchema: Schema = {
    name: {
        in: "body",
        errorMessage: "Invalid agency name",
        isLength: {
            errorMessage: "Invalid agency name length",
            options: { min: 1, max: 100 }
        }
    },
    description: {
        in: "body",
        errorMessage: "Invalid agency description",
        isLength: {
            errorMessage: "Invalid agency description length",
            options: { min: 16, max: 1000 }
        }
    },
    address: {
        in: "body",
        errorMessage: "Invalid agency name",
        isLength: {
            errorMessage: "Invalid agency name length",
            options: { min: 3 }
        }
    },
    logoUrl: {
        in: "body",
        errorMessage: "Invalid agency logo URL",
        isURL: {
            errorMessage: "Invalid agency logo URL"
        },
        optional: { options: { nullable: true } }
    },
    employer: {
        in: "body",
        errorMessage: "Invalid agency employer",
        isMongoId: {
            errorMessage: "Invalid agency employer ObjectId",
            bail: true
        },
        custom: {
            errorMessage: "Agency employer ObjectId doesn't exist",
            options: async value => {
                return (await Employer.exists({ _id: value }).exec())
                    ? true
                    : new Error("Employer ObjectId not found");
            }
        }
    }
};

export default validatorSchema;

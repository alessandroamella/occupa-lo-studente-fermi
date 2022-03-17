import { Schema } from "express-validator";

export const validatorSchema: Schema = {
    name: {
        in: "body",
        errorMessage: "Invalid name",
        isLength: {
            errorMessage: "Invalid name length",
            options: { min: 1, max: 100 }
        }
    },
    description: {
        in: "body",
        errorMessage: "Invalid description",
        isLength: {
            errorMessage: "Invalid description length",
            options: { min: 16, max: 1000 }
        }
    },
    address: {
        in: "body",
        errorMessage: "Invalid address",
        isLength: {
            errorMessage: "Invalid address length",
            options: { min: 3 }
        }
    },
    logoUrl: {
        in: "body",
        errorMessage: "Invalid logo URL",
        isURL: {
            errorMessage: "Invalid logo URL"
        },
        optional: { options: { nullable: true } }
    }
};

export default validatorSchema;

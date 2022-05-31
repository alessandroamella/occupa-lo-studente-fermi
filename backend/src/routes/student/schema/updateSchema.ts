import { Schema } from "express-validator";

import schema from "./createSchema";

const allowedKeys = [
    "curriculum",
    "phoneNumber",
    "fieldOfStudy",
    "hasDrivingLicense",
    "canTravel"
] as const;

const updateSchema = { ...schema };
for (const key in updateSchema) {
    if (!allowedKeys.find(k => k === key)) {
        delete updateSchema[key];
    } else updateSchema[key].optional = true;
}

export default updateSchema as Schema;

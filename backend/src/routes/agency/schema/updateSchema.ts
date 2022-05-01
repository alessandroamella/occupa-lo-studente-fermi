import { Schema } from "express-validator";

import schema from "./createSchema";

const updateSchema = { ...schema };
for (const key in updateSchema) {
    updateSchema[key].optional = true;
}

export default updateSchema as Schema;

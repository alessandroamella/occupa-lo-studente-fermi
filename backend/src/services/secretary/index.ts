import { FilterQuery } from "mongoose";

import { Secretary, SecretaryClass } from "@models";
import { logger } from "@shared";
import { DocumentType } from "@typegoose/typegoose";

export class SecretaryService {
    /**
     * Finds a secretary account
     */
    public static async findOne(
        fields: FilterQuery<DocumentType<SecretaryClass>>
    ): Promise<DocumentType<SecretaryClass> | null> {
        logger.debug("Finding secretary...");
        return await Secretary.findOne(fields).exec();
    }
}

// async function createTestSecretary() {
//     logger.warn("Creating test secretary");

//     const s = new Secretary({ username: "fermi" });
//     const p = await s.generatePassword();
//     // eslint-disable-next-line no-console
//     console.log("\n\n\n\nPASSWORD", { p });
// }

// createTestSecretary();

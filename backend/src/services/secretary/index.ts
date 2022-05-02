import { FilterQuery } from "mongoose";

import { Secretary, SecretaryDoc } from "@models";
import { logger } from "@shared";

export class SecretaryService {
    /**
     * Finds a secretary account
     */
    public static async findOne(
        fields: FilterQuery<SecretaryDoc>
    ): Promise<SecretaryDoc | null> {
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

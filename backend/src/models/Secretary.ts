import bcrypt from "bcrypt";

import { logger } from "@shared";
import {
    DocumentType,
    ReturnModelType,
    getModelForClass,
    modelOptions,
    prop
} from "@typegoose/typegoose";

/**
 * @openapi
 *
 *  components:
 *    schemas:
 *      Secretary:
 *        type: object
 *        required:
 *          - username
 *          - hashedPassword
 *        properties:
 *          username:
 *            type: string
 *            minLength: 5
 *            maxLength: 64
 *            description: Username of this school secretary
 *          hashedPassword:
 *            type: string
 *            description: Hash of the password needed to login to this school secretary account (plaintext must be 16 characters long)
 *          loginIpAddresses:
 *            type: array
 *            description: IP addresses that logged in
 *            items:
 *              type: string
 *          lastLoginDate:
 *            type: string
 *            format: date-time
 *            description: Last login date of this account
 */

@modelOptions({ schemaOptions: { collection: "Secretary", timestamps: true } })
export class SecretaryClass {
    @prop({ required: true, minlength: 5, maxlength: 64 })
    public username!: string;

    @prop({ required: true })
    public hashedPassword!: string;

    @prop({ required: true, type: () => [String], default: [] })
    public loginIpAddresses!: string[];

    @prop({ required: true, default: new Date() })
    public lastLoginDate!: Date;

    public async isValidPassword(
        this: DocumentType<SecretaryClass>,
        plainPw: string
    ): Promise<boolean> {
        return await bcrypt.compare(plainPw, this.hashedPassword);
    }

    public static async createNewAccount(
        this: ReturnModelType<typeof SecretaryClass>,
        username: string,
        pw: string
    ) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pw, salt);
        logger.info(`Creating new secretary account "${username}"`);
        return await Secretary.create({ username, hashedPassword });
    }

    public async saveNewLogin(this: SecretaryDoc, ipAddress: string) {
        this.loginIpAddresses.push(ipAddress);
        this.lastLoginDate = new Date();
        await this.save();
    }
}

export type SecretaryDoc = DocumentType<SecretaryClass>;

export const Secretary = getModelForClass(SecretaryClass);

// DEBUG
// Secretary.createNewAccount("fermi", "fermi");

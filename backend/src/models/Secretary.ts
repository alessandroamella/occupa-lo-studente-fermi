import bcrypt from "bcrypt";
import randomString from "randomstring";

import {
    DocumentType,
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
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainPw, this.hashedPassword, (err, valid) => {
                if (err) reject(err);
                return resolve(valid);
            });
        });
    }

    public async generatePassword(
        this: DocumentType<SecretaryClass>
    ): Promise<string> {
        const p = randomString.generate({
            length: 16,
            readable: true
        });
        const salt = await bcrypt.genSalt(10);
        this.hashedPassword = await bcrypt.hash(p, salt);
        await this.save();
        return p;
    }

    public async saveNewLogin(
        this: DocumentType<SecretaryClass>,
        ipAddress: string
    ) {
        this.loginIpAddresses.push(ipAddress);
        this.lastLoginDate = new Date();
        await this.save();
    }
}

export const Secretary = getModelForClass(SecretaryClass);

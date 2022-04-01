import {
    DocumentType,
    getModelForClass,
    modelOptions,
    prop,
} from "@typegoose/typegoose";
import bcrypt from "bcrypt"
import cryptoRandomString from "crypto-random-string";

/**
 * @openapi
 *
 *  components:
 *    schemas:
 *      Secretary:
 *        type: object
 *        required:
 *          - hashedAuthCode
 *        properties:
 *          hashedAuthCode:
 *            type: string
 *            description: Hash of the authCode needed to login to the school secretary panel
 *          loginIpAddresses:
 *            type: array
 *            description: IP addresses that logged in
 *            items:
 *              type: string
 *          lastLoginDate:
 *            type: string
 *            format: date-time
 *            description: Last login date
 */

@modelOptions({ schemaOptions: { collection: "Secretary", timestamps: true } })
export class SecretaryClass {
    @prop({ required: true })
    public hashedAuthCode!: string;

    @prop({ required: true, default: [] })
    public loginIpAddresses!: string[];
 
    @prop({ required: true, default: new Date })
    public lastLoginDate!: Date;
 
    public async isValidAuthCode(this: DocumentType<SecretaryClass>, plainAuthCode: string): Promise<boolean> {
        return await bcrypt.compare(plainAuthCode, this.hashedAuthCode)
    }
 
    public async generateAuthCode(this: DocumentType<SecretaryClass>): Promise<string> {
        this.hashedAuthCode = cryptoRandomString({length: 16, type: "distinguishable"});
        await this.save();
        return this.hashedAuthCode;
    }

    public async saveNewLogin(this: DocumentType<SecretaryClass>, ipAddress: string) {
        this.loginIpAddresses.push(ipAddress);
        this.lastLoginDate = new Date();
        await this.save();
    }
}

export const Secretary = getModelForClass(SecretaryClass);

import {
    DocumentType,
    getModelForClass,
    modelOptions,
    prop,
} from "@typegoose/typegoose";
import bcrypt from "bcrypt"
import randomString from "randomstring"

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
 *            description: Hash of the password needed to login to this school secretary account
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

    @prop({ required: true, minlength: 16, maxlength: 16 })
    public hashedPassword!: string;

    @prop({ required: true, default: [] })
    public loginIpAddresses!: string[];
 
    @prop({ required: true, default: new Date })
    public lastLoginDate!: Date;
 
    public async isValidPassword(this: DocumentType<SecretaryClass>, plainPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, this.hashedPassword)
    }
 
    public async generatePassword(this: DocumentType<SecretaryClass>): Promise<string> {
        this.hashedPassword = randomString.generate({length: 16, readable: true});
        await this.save();
        return this.hashedPassword;
    }

    public async saveNewLogin(this: DocumentType<SecretaryClass>, ipAddress: string) {
        this.loginIpAddresses.push(ipAddress);
        this.lastLoginDate = new Date();
        await this.save();
    }
}

export const Secretary = getModelForClass(SecretaryClass);

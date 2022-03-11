import {
    getModelForClass,
    modelOptions,
    prop,
    Ref
} from "@typegoose/typegoose";
import { AgencyClass } from "./Agency";

/**
 * @openapi
 *
 *  components:
 *    schemas:
 *      Employer:
 *        type: object
 *        description: Employer data as fetched from SPID authentication
 *        required:
 *          - firstName
 *          - lastName
 *          - fiscalNumber
 *          - email
 *          - mobilePhone
 *          - agency
 *        properties:
 *          firstName:
 *            type: string
 *            description: Name
 *          lastName:
 *            type: string
 *            description: Family name
 *          fiscalNumber:
 *            type: string
 *            description: Fiscal number
 *          email:
 *            type: string
 *            format: email
 *            description: Email
 *          mobilePhone:
 *            type: string
 *            description: Phone number validated with phone.js
 *          agency:
 *            type: string
 *            description: ObjectId of the agency that the Employer owns
 */

@modelOptions({ schemaOptions: { collection: "Employer", timestamps: true } })
export class EmployerClass {
    @prop({ required: true })
    public firstName!: string;

    @prop({ required: true })
    public lastName!: string;

    @prop({ required: true })
    public fiscalNumber!: string;

    @prop({ required: true })
    public email!: string;

    @prop({ required: true })
    public phoneNumber!: string;

    @prop({ required: true, ref: "Agency", default: [] })
    public agency!: Ref<AgencyClass>;
}

export const Employer = getModelForClass(EmployerClass);

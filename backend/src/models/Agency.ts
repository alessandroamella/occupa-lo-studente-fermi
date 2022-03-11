import {
    getModelForClass,
    modelOptions,
    prop,
    Ref
} from "@typegoose/typegoose";
import { EmployerClass } from "./Employer";

/**
 * @openapi
 *
 *  components:
 *    schemas:
 *      Agency:
 *        type: object
 *        required:
 *          - name
 *          - description
 *          - address
 *          - vatCode
 *          - employer
 *        properties:
 *          name:
 *            type: string
 *            minLength: 1
 *            maxLength: 100
 *            description: Name of the agency
 *          description:
 *            type: string
 *            minLength: 16
 *            maxLength: 1000
 *            description: Exhaustive description of the agency
 *          address:
 *            type: string
 *            minLength: 3
 *            description: Address of the agency, should be validated
 *          vatCode:
 *            type: string
 *            minLength: 2
 *            maxLength: 32
 *            description: VAT Code of the agency
 *            example: 02201090368
 *          logoUrl:
 *            type: string
 *            description: URL of the agency's logo
 *          employer:
 *            type: string
 *            description: ObjectId of the Employer that owns this agency
 */

@modelOptions({ schemaOptions: { collection: "Agency", timestamps: true } })
export class AgencyClass {
    @prop({ required: true, minlength: 1, maxlength: 100 })
    public name!: string;

    @prop({ required: true, minlength: 16, maxlength: 1000 })
    public description!: string;

    @prop({ required: true, minlength: 3 })
    public address!: string;

    @prop({ required: true, minlength: 2, maxlength: 32 })
    public vatCode!: string;

    @prop({ required: false })
    public logoUrl?: string;

    @prop({ required: true, ref: "Employer" })
    public employer: Ref<EmployerClass>;
}

export const Agency = getModelForClass(AgencyClass);

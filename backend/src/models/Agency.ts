import {
    getModelForClass,
    modelOptions,
    prop
} from "@typegoose/typegoose";

/**
 * @openapi
 *
 *  components:
 *    schemas:
 *      Agency:
 *        type: object
 *        required:
 *          - responsibleFirstName
 *          - responsibleLastName
 *          - responsibleFiscalNumber
 *          - email
 *          - phoneNumber
 *          - description
 *          - address
 *          - vatCode
 *          - employer
 *        properties:
 *          responsibleFirstName:
 *            type: string
 *            minLength: 1
 *            description: Name of the agency's responsible
 *          responsibleLastName:
 *            type: string
 *            minLength: 1
 *            maxLength: 100
 *            description: Surname of the agency's responsible
 *          responsibleFiscalNumber:
 *            type: string
 *            minLength: 1
 *            description: Fiscal number of the agency's responsible
 *          email:
 *            type: string
 *            format: email
 *            minLength: 1
 *            description: Email that students can contact
 *          phoneNumber:
 *            type: string
 *            minLength: 1
 *            maxLength: 100
 *            description: Phone number that students can contact
 *          agencyDescription:
 *            type: string
 *            minLength: 16
 *            maxLength: 1000
 *            description: Exhaustive description of the agency
 *          agencyAddress:
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
    @prop({ required: true, minlength: 1 })
    public responsibleFirstName!: string;

    @prop({ required: true, minlength: 1 })
    public responsibleLastName!: string;

    @prop({ required: true, minlength: 1 })
    public responsibleFiscalNumber!: string;

    @prop({ required: true })
    public email!: string;

    @prop({ required: true })
    public phoneNumber!: string;

    @prop({ required: true, minlength: 1, maxlength: 100 })
    public agencyName!: string;

    @prop({ required: true, minlength: 16, maxlength: 1000 })
    public agencyDescription!: string;

    @prop({ required: true, minlength: 3 })
    public agencyAddress!: string;

    @prop({ required: true, minlength: 2, maxlength: 32 })
    public vatCode!: string;

    @prop({ required: false })
    public logoUrl?: string;
}

export const Agency = getModelForClass(AgencyClass);

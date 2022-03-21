import { urlExists } from "@shared";
import {
    getModelForClass,
    modelOptions,
    prop,
    Ref
} from "@typegoose/typegoose";
import IsEmail from "isemail";
import { isValidPhoneNumber } from "libphonenumber-js";
import { JobOfferClass } from "./JobOffer";

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
 *          - websiteURL
 *          - phoneNumber
 *          - agencyName
 *          - agencyDescription
 *          - agencyAddress
 *          - vatCode
 *          - jobOffers
 *        properties:
 *          responsibleFirstName:
 *            type: string
 *            minLength: 1
 *            maxLength: 100
 *            description: Name of the agency's responsible
 *          responsibleLastName:
 *            type: string
 *            minLength: 1
 *            maxLength: 100
 *            description: Surname of the agency's responsible
 *          responsibleFiscalNumber:
 *            type: string
 *            minLength: 1
 *            maxLength: 100
 *            description: Fiscal number of the agency's responsible
 *          email:
 *            type: string
 *            format: email
 *            minLength: 1
 *            description: Email that students can contact
 *          websiteURL:
 *            type: string
 *            description: URL of the agency's website
 *          phoneNumber:
 *            type: string
 *            minLength: 1
 *            maxLength: 100
 *            description: Phone number that students can contact
 *          agencyName:
 *            type: string
 *            minLength: 1
 *            maxLength: 100
 *            description: Name of the agency
 *          agencyDescription:
 *            type: string
 *            minLength: 16
 *            maxLength: 1000
 *            description: Exhaustive description of the agency
 *          agencyAddress:
 *            type: string
 *            minLength: 3
 *            description: Address of the agency, should be selected using a visual map and validated
 *          vatCode:
 *            type: string
 *            minLength: 2
 *            maxLength: 32
 *            description: VAT Code of the agency
 *            example: 02201090368
 *          logoUrl:
 *            type: string
 *            description: URL of the agency's logo
 *          jobOffers:
 *            type: array
 *            description: ObjectIds of the job offers for this agency
 *            items:
 *              type: string
 */

@modelOptions({ schemaOptions: { collection: "Agency", timestamps: true } })
export class AgencyClass {
    @prop({ required: true, minlength: 1, maxlength: 100 })
    public responsibleFirstName!: string;

    @prop({ required: true, minlength: 1, maxlength: 100 })
    public responsibleLastName!: string;

    @prop({ required: true, minlength: 1, maxlength: 100 })
    public responsibleFiscalNumber!: string;

    @prop({ required: true, validate: [IsEmail.validate, "Invalid email"] })
    public email!: string;

    @prop({ required: true, validate: async (v: string) => await urlExists(v) })
    public websiteURL!: string;

    @prop({ required: true, validate: [(v: string) => isValidPhoneNumber(v, "IT"), "Invalid phone number"] })
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
    
    @prop({ required: true, ref: "JobOffer" })
    public jobOffers!: Ref<JobOfferClass>[];
}

export const Agency = getModelForClass(AgencyClass);

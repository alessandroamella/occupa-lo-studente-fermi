import bcrypt from "bcrypt";
import IsEmail from "isemail";
import { isValidPhoneNumber } from "libphonenumber-js";

import { logger, urlExists } from "@shared";
import {
    DocumentType,
    Ref,
    getModelForClass,
    modelOptions,
    prop
} from "@typegoose/typegoose";

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
 *          - hashedPassword
 *          - websiteUrl
 *          - phoneNumber
 *          - agencyName
 *          - agencyDescription
 *          - agencyAddress
 *          - vatCode
 *          - approvalStatus
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
 *          hashedPassword:
 *            type: string
 *            description: Hashed password of the agency
 *          websiteUrl:
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
 *          approvalStatus:
 *            type: string
 *            enum:
 *              - waiting
 *              - approved
 *              - rejected
 *            description: Approval status
 *          approvalDate:
 *            type: string
 *            format: date-time
 *            description: When this agency got approved (or rejected), undefined or null if not approved yet
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

    @prop({ required: true })
    public hashedPassword!: string;

    @prop({ required: true, validate: async (v: string) => await urlExists(v) })
    public websiteUrl!: string;

    @prop({
        required: true,
        validate: [
            (v: string) => isValidPhoneNumber(v, "IT"),
            "Invalid phone number"
        ]
    })
    public phoneNumber!: string;

    @prop({ required: true, minlength: 1, maxlength: 100 })
    public agencyName!: string;

    @prop({ required: true, minlength: 16, maxlength: 1000 })
    public agencyDescription!: string;

    @prop({ required: true, minlength: 3 })
    public agencyAddress!: string;

    @prop({ required: true, minlength: 2, maxlength: 32 })
    public vatCode!: string;

    @prop({ required: true, enum: ["waiting", "approved", "rejected"] })
    public approvalStatus!: string;

    @prop({ required: false, default: null })
    public approvalDate?: Date;

    @prop({ required: false })
    public logoUrl?: string;

    @prop({ required: true, ref: "JobOfferClass" })
    public jobOffers!: Ref<JobOfferClass>[];

    private async _changeApprovedStatus(
        this: AgencyDoc,
        approve: "approve" | "reject"
    ) {
        this.approvalStatus = approve === "approve" ? "approved" : "rejected";
        this.approvalDate = new Date();
        await this.save();
    }

    public async approveAgency(this: AgencyDoc) {
        logger.info("Approving agency " + this._id);
        return await this._changeApprovedStatus("approve");
    }

    public async rejectAgency(this: AgencyDoc) {
        logger.info("Rejecting agency " + this._id);
        return await this._changeApprovedStatus("reject");
    }

    public async isValidPassword(
        this: DocumentType<AgencyClass>,
        plainPw: string
    ): Promise<boolean> {
        return await bcrypt.compare(plainPw, this.hashedPassword);
    }
}

export type AgencyDoc = DocumentType<AgencyClass>;

export const Agency = getModelForClass(AgencyClass);

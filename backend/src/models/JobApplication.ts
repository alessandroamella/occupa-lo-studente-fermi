import IsEmail from "isemail";
import { isValidPhoneNumber } from "libphonenumber-js";

import {
    DocumentType,
    Ref,
    getModelForClass,
    modelOptions,
    prop
} from "@typegoose/typegoose";

import { AgencyClass } from "./Agency";
import { JobOfferClass } from "./JobOffer";
import { StudentClass } from "./Student";

/**
 * @openapi
 *
 *  components:
 *    schemas:
 *      JobApplication:
 *        type: object
 *        description: JobApplication data as fetched from SPID authentication
 *        required:
 *          - fromStudent
 *          - forAgency
 *          - forJobOffer
 *          - firstName
 *          - lastName
 *          - fiscalNumber
 *          - email
 *          - pictureUrl
 *          - phoneNumber
 *          - fieldOfStudy
 *          - hasDrivingLicense
 *          - canTravel
 *        properties:
 *          fromStudent:
 *            type: string
 *            description: ObjectId of the student who sent the job application
 *          forJobOffer:
 *            type: string
 *            description: ObjectId of the agency for this job application
 *          forAgency:
 *            type: string
 *            description: ObjectId of the job offer for this job application
 *          firstName:
 *            type: string
 *            description: Name
 *          lastName:
 *            type: string
 *            description: Surname
 *          fiscalNumber:
 *            type: string
 *            description: Fiscal number
 *          curriculum:
 *            type: string
 *            description: JobApplication curriculum with markdown
 *          email:
 *            type: string
 *            format: email
 *            description: Email (must be @fermi.mo.it)
 *          pictureUrl:
 *            type: string
 *            description: URL of the profile picture
 *          phoneNumber:
 *            type: string
 *            description: Phone number validated with phone.js
 *          fieldOfStudy:
 *            type: string
 *            enum:
 *              - it
 *              - electronics
 *              - chemistry
 *            description: Field of study of this student
 *          hasDrivingLicense:
 *            type: boolean
 *            description: Whether the student has a driving license
 *          canTravel:
 *            type: boolean
 *            description: Whether the student can travel independently
 */

@modelOptions({
    schemaOptions: { collection: "JobApplication", timestamps: true }
})
export class JobApplicationClass {
    @prop({ required: true, ref: "StudentClass" })
    public fromStudent!: Ref<StudentClass>;

    @prop({ required: true, ref: "AgencyClass" })
    public forAgency!: Ref<AgencyClass>;

    @prop({ required: false, ref: "JobOfferClass" })
    public forJobOffer?: Ref<JobOfferClass>;

    @prop({ required: true })
    public firstName!: string;

    @prop({ required: true })
    public lastName!: string;

    @prop({ required: true })
    public fiscalNumber!: string;

    @prop({ required: false })
    public curriculum?: string;

    @prop({ required: true, validate: [IsEmail.validate, "Invalid email"] })
    public email!: string;

    @prop({ required: true })
    public pictureUrl!: string;

    @prop({
        required: true,
        validate: [
            (v: string) => isValidPhoneNumber(v, "IT"),
            "Invalid phone number"
        ]
    })
    public phoneNumber!: string;

    @prop({ required: true, enum: ["it", "electronics", "chemistry"] })
    public fieldOfStudy!: string;

    @prop({ required: true, default: false })
    public hasDrivingLicense!: boolean;

    @prop({ required: true, default: false })
    public canTravel!: boolean;
}

export type JobApplicationDoc = DocumentType<JobApplicationClass>;

export const JobApplication = getModelForClass(JobApplicationClass);

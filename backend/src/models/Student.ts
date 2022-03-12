import {
    getModelForClass,
    modelOptions,
    prop,
    Ref
} from "@typegoose/typegoose";
import { JobApplicationClass } from "./JobApplication";

/**
 * @openapi
 *
 *  components:
 *    schemas:
 *      Student:
 *        type: object
 *        description: Student data as fetched from SPID authentication
 *        required:
 *          - googleId
 *          - firstName
 *          - lastName
 *          - fiscalNumber
 *          - email
 *          - pictureURL
 *          - phoneNumber
 *          - spidVerified
 *        properties:
 *          googleId:
 *            type: string
 *            description: Google ID for OAuth 2.0 authentication
 *          firstName:
 *            type: string
 *            description: Name
 *          lastName:
 *            type: string
 *            description: Surname
 *          fiscalNumber:
 *            type: string
 *            description: Fiscal number
 *          curriculumLink:
 *            type: string
 *            description: Link to the student's curriculum, like Europass
 *          email:
 *            type: string
 *            format: email
 *            description: Email (must be @fermi.mo.it)
 *          pictureURL:
 *            type: string
 *            description: URL of the profile picture
 *          phoneNumber:
 *            type: string
 *            description: Phone number validated with phone.js
 *          spidVerified:
 *            type: boolean
 *            description: Whether the student has authenticated with SPID
 *          jobApplications:
 *            type: array
 *            description: Job applications from the student
 *            items:
 *              type: string
 */

@modelOptions({ schemaOptions: { collection: "Student", timestamps: true } })
export class StudentClass {
    @prop({ required: true })
    public googleId!: string;

    @prop({ required: true })
    public firstName!: string;

    @prop({ required: true })
    public lastName!: string;

    @prop({ required: true })
    public fiscalNumber!: string;

    @prop({ required: false })
    public curriculumLink?: string;

    @prop({ required: true })
    public email!: string;
    
    @prop({ required: true })
    public pictureURL!: string;

    @prop({ required: true })
    public phoneNumber!: string;

    @prop({ required: true })
    public spidVerified!: boolean;

    @prop({ required: true, ref: "JobApplication", default: [] })
    public jobApplications!: Ref<JobApplicationClass>[];
}

export const Student = getModelForClass(StudentClass);

export interface StudentTempData {
    googleId: string;
    firstName: string;
    lastName: string;
    email: string;
    pictureURL: string;
} 

export interface CreateStudentData {
    googleId: string;
    firstName: string;
    lastName: string;
    fiscalNumber: string;
    curriculumLink?: string;
    email: string;
    pictureURL: string;
    phoneNumber: string;
    spidVerified?: boolean;
} 
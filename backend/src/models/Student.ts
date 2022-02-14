import {
    getModelForClass,
    modelOptions,
    prop,
    Ref
} from "@typegoose/typegoose";
import { AgencyClass } from "./Agency";
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
 *          - firstName
 *          - lastName
 *          - fiscalNumber
 *          - email
 *          - phoneNumber
 *          - spidVerified
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
 *          curriculumLink:
 *            type: string
 *            description: Link to the student's curriculum, like Europass
 *          email:
 *            type: string
 *            format: email
 *            description: Email (must be @fermi.mo.it)
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
    public phoneNumber!: string;

    @prop({ required: true })
    public spidVerified!: boolean;

    @prop({ required: true, ref: "JobApplication", default: [] })
    public jobApplications!: Ref<JobApplicationClass>[];
}

const Student = getModelForClass(StudentClass);
export default Student;

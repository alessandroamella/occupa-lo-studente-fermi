import {
    getModelForClass,
    modelOptions,
    prop,
    Ref
} from "@typegoose/typegoose";
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
 *          - forJobOffer
 *          - fiscalNumber
 *          - email
 *          - mobilePhone
 *        properties:
 *          fromStudent:
 *            type: string
 *            description: ObjectId of the Student
 *          forJobOffer:
 *            type: string
 *            description: ObjectId of the JobOffer
 *          fiscalNumber:
 *            type: string
 *            description: Fiscal number
 *          description:
 *            type: string
 *            description: Long description of the student's job application
 */

@modelOptions({
    schemaOptions: { collection: "JobApplication", timestamps: true }
})
export class JobApplicationClass {
    @prop({ required: true, ref: "Student" })
    public fromStudent!: Ref<StudentClass>;

    @prop({ required: true, ref: "JobOffer" })
    public forJobOffer!: Ref<JobOfferClass>;

    @prop({ required: true, minlength: 30 })
    public description!: string;
}

const JobApplication = getModelForClass(JobApplicationClass);
export default JobApplication;

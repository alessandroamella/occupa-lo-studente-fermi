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
 *          - description
 *        properties:
 *          fromStudent:
 *            type: string
 *            description: ObjectId of the Student
 *          forJobOffer:
 *            type: string
 *            description: ObjectId of the JobOffer
 *          status:
 *            type: string
 *            enum:
 *              - open
 *              - accepted
 *              - rejected
 *            description: Description of this job offer
 *          description:
 *            type: string
 *            description: Long description of the student's job application
 */

@modelOptions({
    schemaOptions: { collection: "JobApplication", timestamps: true }
})
export class JobApplicationClass {
    @prop({ required: true, ref: "StudentClass" })
    public fromStudent!: Ref<StudentClass>;

    @prop({ required: true, ref: "JobOfferClass" })
    public forJobOffer!: Ref<JobOfferClass>;

    @prop({ required: true, enum: ["open", "accepted", "rejected"] })
    public status!: string;

    @prop({ required: true, minlength: 30 })
    public description!: string;
}

export const JobApplication = getModelForClass(JobApplicationClass);

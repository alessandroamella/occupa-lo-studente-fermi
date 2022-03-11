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
 *      JobOffer:
 *        type: object
 *        description: JobOffer data as fetched from SPID authentication
 *        required:
 *          - agency
 *          - title
 *          - description
 *          - status
 *          - jobApplications
 *        properties:
 *          agency:
 *            type: string
 *            description: ObjectId of the agency
 *          title:
 *            type: string
 *            description: Title of this job offer
 *          description:
 *            type: string
 *            description: Description of this job offer
 *          jobApplications:
 *            type: array
 *            description: ObjectIds of the job applications for this offer
 *            items:
 *              type: string
 */

// MODEL: ADD MORE THINGS TO THIS MODEL
@modelOptions({ schemaOptions: { collection: "JobOffer", timestamps: true } })
export class JobOfferClass {
    @prop({ required: true, ref: "Agency" })
    public agency!: Ref<AgencyClass>;

    @prop({ required: true, minlength: 5, maxlength: 32 })
    public title!: string;

    @prop({ required: true, minlength: 50, maxlength: 3000 })
    public description!: string;

    @prop({ required: true, ref: "JobApplication", default: [] })
    public jobApplications!: Ref<JobApplicationClass>[];
}

export const JobOffer = getModelForClass(JobOfferClass);
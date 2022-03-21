import {
    getModelForClass,
    modelOptions,
    prop,
    Ref
} from "@typegoose/typegoose";
import moment from "moment";
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
 *          - fieldOfStudy
 *          - expiryDate
 *          - mustHaveDiploma
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
 *          fieldOfStudy:
 *            type: string
 *            enum:
 *              - it
 *              - electronics
 *              - chemistry
 *            description: Field of study that this offer is designated for
 *          expiryDate:
 *            type: string
 *            format: date-time
 *            description: When this job offer will expire. Max 1 year from now!
 *          mustHaveDiploma:
 *            type: boolean
 *            description: Whether the student must have a diploma. Defaults to false.
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

    @prop({required: true, enum: ["any", "it", "electronics", "chemistry"]})
    public fieldOfStudy!: string;

    @prop({required: true, default: () => moment().add(3, "months"), validate:[(v: Date) => !!v && moment(v).isValid() && moment(v).diff(moment(), "months") <= 12, "Expiry date must be at most 1 year from now"] })
    public expiryDate!: Date;

    @prop({required: true, default: false })
    public mustHaveDiploma!: boolean;

    @prop({ required: true, ref: "JobApplication", default: [] })
    public jobApplications!: Ref<JobApplicationClass>[];
}

export const JobOffer = getModelForClass(JobOfferClass);
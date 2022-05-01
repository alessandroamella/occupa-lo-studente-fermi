import moment from "moment";

import {
    Ref,
    getModelForClass,
    modelOptions,
    prop
} from "@typegoose/typegoose";

import { AgencyClass } from "./Agency";

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
 *          - numberOfPositions
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
 *            format: date
 *            description: When this job offer will expire. Max 1 year from now! Format is YYYY-MM-DD (inclusive)
 *          mustHaveDiploma:
 *            type: boolean
 *            description: Whether the student must have a diploma. Defaults to false
 *          numberOfPositions:
 *            type: integer
 *            description: Number of this position available. Defaults to 1
 */

// MODEL: ADD MORE THINGS TO THIS MODEL
@modelOptions({ schemaOptions: { collection: "JobOffer", timestamps: true } })
export class JobOfferClass {
    @prop({ required: true, ref: "AgencyClass" })
    public agency!: Ref<AgencyClass>;

    @prop({ required: true, minlength: 5, maxlength: 32 })
    public title!: string;

    @prop({ required: true, minlength: 50, maxlength: 3000 })
    public description!: string;

    @prop({ required: true, enum: ["any", "it", "electronics", "chemistry"] })
    public fieldOfStudy!: string;

    @prop({
        required: true,
        default: () => moment().add(3, "months"),
        validate: [
            (v: Date) =>
                !!v &&
                moment(v).isValid() &&
                moment(v).diff(moment(), "months") <= 12,
            "Expiry date must be at most 1 year from now"
        ]
    })
    public expiryDate!: Date;

    @prop({ required: true, default: false })
    public mustHaveDiploma!: boolean;

    @prop({ required: true, default: 1 })
    public numberOfPositions!: number;
}

export const JobOffer = getModelForClass(JobOfferClass);

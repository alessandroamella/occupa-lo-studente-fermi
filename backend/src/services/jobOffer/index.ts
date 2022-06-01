import { FilterQuery, LeanDocument, Types } from "mongoose";

import { JobApplication, JobOffer, JobOfferClass, JobOfferDoc } from "@models";
import { logger } from "@shared";
import { DocumentType, isDocument, mongoose } from "@typegoose/typegoose";

export class JobOfferService {
    /**
     * Finds many job offers
     * @param  {FilterQuery<DocumentType<JobOfferClass>|null>} fields
     * @param  {boolean} [populateAgency=false] - whether to populate agency field
     * @param  {number} [limit=100] - defaults to 100
     * @param  {number} [skip=0] - defaults to 0
     * @param  {boolean} [lean=false]
     */
    public static async find(params: {
        fields: FilterQuery<DocumentType<JobOfferClass>>;
        populateAgency?: boolean;
        skip?: number;
        limit?: number;
        lean?: boolean;
    }): Promise<JobOfferDoc[]> {
        logger.debug("Finding jobOffers...");
        const query = JobOffer.find(params.fields);

        if (params.skip) query.skip(params.skip);
        if (params.limit) query.limit(params.limit);
        if (params.populateAgency) query.populate("agency");
        if (params.lean) query.lean();

        return await query.exec();
    }

    /**
     * Finds one job offer
     * @param  {FilterQuery<DocumentType<JobOfferClass>|null>} fields
     * @param  {boolean} [populateAgency=false] - whether to populate agency field
     */
    public static async findOne(
        fields: FilterQuery<DocumentType<JobOfferClass>>,
        populateAgency = false
    ): Promise<DocumentType<JobOfferClass> | null> {
        logger.debug("Finding jobOffer...");
        const query = JobOffer.findOne(fields);
        if (populateAgency) {
            query.populate("agency");
        }
        return await query.exec();
    }
    /**
     * Creates new job offer.
     * Make sure student is logged in and job offer exists.
     * @param  {JobOfferDoc} jobOffer
     */
    public static async create(jobOffer: JobOfferDoc) {
        logger.info(
            `Create job offer "${jobOffer.title}" from agency ${
                isDocument(jobOffer.agency)
                    ? jobOffer.agency._id
                    : jobOffer.agency
            }`
        );
        await JobOffer.create(jobOffer);

        await jobOffer.populate("agency");
        if (!isDocument(jobOffer.agency)) {
            throw new Error("Error while populating agency in jobOffer create");
        }

        jobOffer.agency.jobOffers.push(jobOffer._id);
        await jobOffer.agency.save();

        logger.debug(
            `Updated agency ${jobOffer.agency._id} with new jobOffer ${jobOffer._id}`
        );
    }
    /**
     * Updates existing job offer.
     * Make sure student is logged in and job offer is his.
     * @param  {JobOfferDoc} jobOffer - Updated jobOffer object
     */
    public static async update(jobOffer: JobOfferDoc) {
        logger.debug("Updating jobOffer with _id " + jobOffer._id);
        return await jobOffer.save();
    }
    /**
     * Deletes job offer
     * @param  {JobOfferDoc} jobOffer - job offer to delete
     */
    public static async delete(jobOffer: JobOfferDoc) {
        await jobOffer.populate("agency");

        if (!isDocument(jobOffer.agency)) {
            throw new Error(
                "Error while populating jobOffer in jobOffer delete"
            );
        }

        // Delete jobOffer from agency
        logger.debug(
            `Deleting jobOffer ref in agency ${jobOffer.agency._id} for jobOffer ${jobOffer._id}`
        );
        (jobOffer.agency.jobOffers as mongoose.Types.Array<JobOfferDoc>).pull(
            jobOffer._id
        );
        await jobOffer.agency.save();

        logger.debug(
            `Updated jobOffer ${jobOffer.agency._id} with removed jobOffer ${jobOffer._id}`
        );

        logger.debug(`Updating jobApplications for jobOffer ${jobOffer._id}`);
        await JobApplication.updateMany(
            { forJobOffer: jobOffer._id },
            { $unset: { forJobOffer: 1 } }
        );

        logger.debug(`Deleting job offer with _id ${jobOffer._id}...`);
        await jobOffer.deleteOne();
    }
    /**
     * Query job offers
     */
    public static async searchQuery(params: {
        fieldOfStudy?: string;
        searchQuery?: string;
        firstQuery?: boolean;
        idsIn?: Types.ObjectId[];
    }): Promise<LeanDocument<JobOfferDoc>[]> {
        const obj: Parameters<typeof JobOffer.find>[0] = {
            expiryDate: { $gt: new Date() }
        };

        if (params.idsIn) {
            logger.debug("searchQuery idsIn=" + params.idsIn);
            obj._id = { $in: params.idsIn };
        }
        if (params.searchQuery && params.firstQuery) {
            logger.debug(`searchQuery $search="${params.searchQuery}"`);
            obj.$text = { $search: params.searchQuery };
        }
        if (params.fieldOfStudy) {
            logger.debug("searchQuery fieldOfStudy=" + params.fieldOfStudy);
            obj.fieldOfStudy = { $in: [params.fieldOfStudy, "any"] };
        }

        const query = JobOffer.find(
            obj,
            params.searchQuery ? { score: { $meta: "textScore" } } : undefined
        );
        return await query
            .lean()
            .sort(
                params.searchQuery
                    ? { score: { $meta: "textScore" } }
                    : { views: -1 }
            )
            .exec();
    }
}

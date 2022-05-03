import { FilterQuery } from "mongoose";

import { JobOffer, JobOfferClass, JobOfferDoc } from "@models";
import { logger } from "@shared";
import { DocumentType, isDocument, mongoose } from "@typegoose/typegoose";

export class JobOfferService {
    /**
     * Finds many job offers
     * @param  {FilterQuery<DocumentType<JobOfferClass>|null>} fields
     * @param  {boolean} [populateAgency=false] - whether to populate agency field
     * @param  {number} [limit=100] - defaults to 100
     * @param  {number} [skip=0] - defaults to 0
     */
    public static async find(
        fields: FilterQuery<DocumentType<JobOfferClass>>,
        populateAgency = false,
        skip = 0,
        limit = 100
    ): Promise<JobOfferDoc[] | null> {
        logger.debug("Finding jobOffers...");
        const query = JobOffer.find(fields).skip(skip).limit(limit);
        if (populateAgency) {
            query.populate("agency");
        }
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
        logger.debug(`Creating job offer from agency ${jobOffer.agency}...`);
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

        logger.debug(`Deleting job offer with _id ${jobOffer._id}...`);
        await jobOffer.deleteOne();
    }
}

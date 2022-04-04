import { FilterQuery } from "mongoose";

import { JobApplication, JobOffer, JobOfferClass } from "@models";
import { logger } from "@shared";
import { DocumentType, isDocument, mongoose } from "@typegoose/typegoose";

export class JobOfferService {
    /**
     * Finds many job offers
     * @param  {FilterQuery<DocumentType<JobOfferClass>|null>} fields
     * @param  {number} [limit=100] - defaults to 100
     * @param  {number} [skip=0] - defaults to 0
     */
    public static async find(
        fields: FilterQuery<DocumentType<JobOfferClass>>,
        skip = 0,
        limit = 100
    ): Promise<DocumentType<JobOfferClass>[] | null> {
        logger.debug("Finding jobOffers...");
        return await JobOffer.find(fields)
            .populate("agency")
            .skip(skip)
            .limit(limit)
            .exec();
    }

    /**
     * Finds one job offer
     * @param  {FilterQuery<DocumentType<JobOfferClass>|null>} fields
     */
    public static async findOne(
        fields: FilterQuery<DocumentType<JobOfferClass>>
    ): Promise<DocumentType<JobOfferClass> | null> {
        logger.debug("Finding jobOffer...");
        return await JobOffer.findOne(fields).populate("agency").exec();
    }
    /**
     * Creates new job offer.
     * Make sure student is logged in and job offer exists.
     * @param  {DocumentType<JobOfferClass>} jobOffer
     */
    public static async create(jobOffer: DocumentType<JobOfferClass>) {
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
     * @param  {DocumentType<JobOfferClass>} jobOffer - Updated jobOffer object
     */
    public static async update(jobOffer: DocumentType<JobOfferClass>) {
        logger.debug(`Updating jobOffer with _id ${jobOffer._id}...`);
        return await jobOffer.save();
    }
    /**
     * Deletes job offer
     * @param  {DocumentType<JobOfferClass>} jobOffer - job offer to delete
     */
    public static async delete(jobOffer: DocumentType<JobOfferClass>) {
        await jobOffer.populate("agency");

        if (!isDocument(jobOffer.agency)) {
            throw new Error(
                "Error while populating jobOffer in jobOffer delete"
            );
        }

        // Delete jobApplications related to offer
        logger.debug(
            `Deleting jobApplications for jobOffer ${
                jobOffer._id
            }: ${jobOffer.jobApplications.join(", ")}`
        );
        await JobApplication.deleteMany({
            _id: { $in: jobOffer.jobApplications }
        }).exec();
        logger.debug(
            `Deleted all jobApplications for jobOffer ${jobOffer._id}`
        );

        // Delete jobOffer from agency
        logger.debug(
            `Deleting jobOffer ref in agency ${jobOffer.agency._id} for jobOffer ${jobOffer._id}`
        );
        (
            jobOffer.agency.jobOffers as mongoose.Types.Array<
                DocumentType<JobOfferClass>
            >
        ).pull(jobOffer._id);
        await jobOffer.agency.save();

        logger.debug(
            `Updated jobOffer ${jobOffer.agency._id} with removed jobOffer ${jobOffer._id}`
        );

        logger.debug(`Deleting job offer with _id ${jobOffer._id}...`);
        await jobOffer.deleteOne();
    }
}

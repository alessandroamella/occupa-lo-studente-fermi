import { FilterQuery } from "mongoose";

import { JobApplication, JobApplicationClass } from "@models";
import { logger } from "@shared";
import { DocumentType, isDocument, mongoose } from "@typegoose/typegoose";

export class JobApplicationService {
    /**
     * Finds a job application
     */
    public static async find(
        fields: FilterQuery<DocumentType<JobApplicationClass> | null>,
        skip = 0,
        limit = 100
    ): Promise<DocumentType<JobApplicationClass> | null> {
        logger.debug("Finding jobApplication...");
        return await JobApplication.findOne(fields)
            .skip(skip)
            .limit(limit)
            .exec();
    }
    /**
     * Creates new job application.
     * Make sure student is logged in and job offer exists.
     * @param  {DocumentType<JobApplicationClass>} jobApplication
     */
    public static async create(
        jobApplication: DocumentType<JobApplicationClass>
    ) {
        logger.debug(
            `Creating job application from student ${jobApplication.fromStudent} for job offer ${jobApplication.forJobOffer}...`
        );
        await JobApplication.create(jobApplication);

        await jobApplication.populate("forJobOffer");
        if (!isDocument(jobApplication.forJobOffer)) {
            throw new Error(
                "Error while populating jobOffer in jobApplication create"
            );
        }

        jobApplication.forJobOffer.jobApplications.push(jobApplication._id);
        await jobApplication.forJobOffer.save();

        logger.debug(
            `Updated jobOffer ${jobApplication.forJobOffer._id} with new jobApplication ${jobApplication._id}`
        );
    }
    /**
     * Updates existing job application.
     * Make sure student is logged in and job application is his.
     * @param  {DocumentType<JobApplicationClass>} jobApplication - updated jobApplication object
     */
    public static async update(
        jobApplication: DocumentType<JobApplicationClass>
    ) {
        logger.debug(
            `Updating jobApplication with _id ${jobApplication._id}...`
        );
        return await jobApplication.save();
    }
    /**
     * Deletes job application
     * @param  {DocumentType<JobApplicationClass>} jobApplication - job application to delete
     */
    public static async delete(
        jobApplication: DocumentType<JobApplicationClass>
    ) {
        await jobApplication.populate("forJobOffer");

        if (!isDocument(jobApplication.forJobOffer)) {
            throw new Error(
                "Error while populating jobOffer in jobApplication delete"
            );
        }

        (
            jobApplication.forJobOffer.jobApplications as mongoose.Types.Array<
                DocumentType<JobApplicationClass>
            >
        ).pull(jobApplication._id);
        await jobApplication.forJobOffer.save();

        logger.debug(
            `Updated jobOffer ${jobApplication.forJobOffer._id} with removed jobApplication ${jobApplication._id}`
        );

        logger.debug(
            `Deleting job application with _id ${jobApplication._id}...`
        );
        await jobApplication.deleteOne();
    }
}

import { FilterQuery } from "mongoose";

import {
    JobApplication,
    JobApplicationClass,
    JobApplicationDoc
} from "@models";
import { logger } from "@shared";
import { DocumentType, isDocument, mongoose } from "@typegoose/typegoose";

export class JobApplicationService {
    /**
     * Finds many job applications
     * @param  {FilterQuery<DocumentType<JobApplicationClass>|null>} fields
     * @param  {number} [limit=100] - defaults to 100
     * @param  {number} [skip=0] - defaults to 0
     * @param  {boolean} [lean=false]
     */
    public static async find(params: {
        fields: FilterQuery<DocumentType<JobApplicationClass>>;
        skip?: number;
        limit?: number;
        lean?: boolean;
    }): Promise<JobApplicationDoc[]> {
        logger.debug("Finding jobApplications...");
        const query = JobApplication.find(params.fields);

        if (params.skip) query.skip(params.skip);
        if (params.limit) query.limit(params.limit);
        if (params.lean) query.lean();

        return await query.exec();
    }

    /**
     * Finds one job application
     * @param  {FilterQuery<DocumentType<JobApplicationClass>|null>} fields
     * @param  {boolean} [populateAgency=false] - whether to populate agency field
     */
    public static async findOne(
        fields: FilterQuery<DocumentType<JobApplicationClass>>
    ): Promise<DocumentType<JobApplicationClass> | null> {
        logger.debug("Finding jobApplication...");
        const query = JobApplication.findOne(fields);
        return await query.exec();
    }
    /**
     * Creates new job application.
     * Make sure student is logged in and job application exists.
     * @param  {JobApplicationDoc} jobApplication
     */
    public static async create(jobApplication: JobApplicationDoc) {
        logger.info(
            `Create job application from student "${jobApplication.fromStudent}" for agency ${jobApplication.forAgency}`
        );
        await JobApplication.create(jobApplication);

        // Update agency
        await jobApplication.populate("forAgency");
        if (!isDocument(jobApplication.forAgency)) {
            throw new Error(
                "Error while populating agency in jobApplication create"
            );
        }

        jobApplication.forAgency.jobApplications.push(jobApplication._id);
        await jobApplication.forAgency.save();

        logger.debug(
            `Updated agency ${jobApplication.forAgency._id} with new jobApplication ${jobApplication._id}`
        );

        // Update student
        await jobApplication.populate("fromStudent");
        if (!isDocument(jobApplication.fromStudent)) {
            throw new Error(
                "Error while populating agency in jobApplication create"
            );
        }

        jobApplication.fromStudent.jobApplications.push(jobApplication._id);
        await jobApplication.fromStudent.save();

        logger.debug(
            `Updated student ${jobApplication.fromStudent._id} with new jobApplication ${jobApplication._id}`
        );
    }
    /**
     * Updates existing job application.
     * Make sure student is logged in and job application is his.
     * @param  {JobApplicationDoc} jobApplication - Updated jobApplication object
     */
    public static async update(jobApplication: JobApplicationDoc) {
        logger.debug("Updating jobApplication with _id " + jobApplication._id);
        return await jobApplication.save();
    }
    /**
     * Deletes job application
     * @param  {JobApplicationDoc} jobApplication - job application to delete
     */
    public static async delete(jobApplication: JobApplicationDoc) {
        // Update agency
        await jobApplication.populate("forAgency");

        if (!isDocument(jobApplication.forAgency)) {
            throw new Error(
                "Error while populating jobApplication in jobApplication delete"
            );
        }

        // Delete jobApplication from agency
        logger.debug(
            `Deleting jobApplication ref in agency ${jobApplication.forAgency._id} for jobApplication ${jobApplication._id}`
        );
        (
            jobApplication.forAgency
                .jobApplications as mongoose.Types.Array<JobApplicationDoc>
        ).pull(jobApplication._id);
        await jobApplication.forAgency.save();

        logger.debug(
            `Updated agency ${jobApplication.forAgency._id} with removed jobApplication ${jobApplication._id}`
        );

        // Update student
        await jobApplication.populate("fromStudent");

        if (!isDocument(jobApplication.fromStudent)) {
            throw new Error(
                "Error while populating fromStudent in jobApplication delete"
            );
        }

        // Delete jobApplication from agency
        logger.debug(
            `Deleting jobApplication ref in student ${jobApplication.fromStudent._id} for jobApplication ${jobApplication._id}`
        );
        (
            jobApplication.fromStudent
                .jobApplications as mongoose.Types.Array<JobApplicationDoc>
        ).pull(jobApplication._id);
        await jobApplication.fromStudent.save();

        logger.debug(
            `Updated student ${jobApplication.fromStudent._id} with removed jobApplication ${jobApplication._id}`
        );

        logger.debug(
            `Deleting job application with _id ${jobApplication._id}...`
        );
        await jobApplication.deleteOne();
    }
}

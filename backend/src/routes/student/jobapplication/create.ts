import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import { isValidObjectId } from "mongoose";
import Mail from "nodemailer/lib/mailer";

import { Envs } from "@config";

import { isLoggedIn } from "@middlewares";
import { JobApplication, JobOfferDoc } from "@models";
import { ResErr } from "@routes";
import {
    AgencyService,
    EmailService,
    JobApplicationService,
    agencyNewJobApplication
} from "@services";
import { logger } from "@shared";
import { mongoose } from "@typegoose/typegoose";

import schema from "../../jobapplication/schema/createSchema";

/**
 * @openapi
 * /api/student/jobapplication:
 *  post:
 *    summary: Create a new job application
 *    tags:
 *      - student
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - forAgency
 *            properties:
 *              forAgency:
 *                type: string
 *                description: ObjectId of the agency this jobApplication is for
 *              forJobOffer:
 *                type: string
 *                description: ObjectId of the student who is making this jobApplication
 *              message:
 *                type: string
 *                description: Additional message for this jobApplication
 *    responses:
 *      '200':
 *        description: Created job application
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/JobApplication'
 *      '400':
 *        description: Data validation failed
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 *      '401':
 *        description: Not logged in
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 *      '500':
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 */

const router = Router();

router.post(
    "/",
    isLoggedIn.isStudentLoggedIn,
    checkSchema(schema),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                err: errors
                    .array()
                    .map(e => e.msg)
                    .join(", ")
            });
        }

        if (!req.student) {
            logger.error(
                "Student not logged in in create jobApplication route"
            );
            return res.status(401).json({
                err: "You need to be logged in (as a student) to create a job application"
            });
        }

        const { forAgency, forJobOffer, message } = req.body;

        let agency;
        // Get agency details
        if (!isValidObjectId(forAgency)) {
            logger.error("JobApplication create unvalidated ObjectId");
            return res
                .status(400)
                .json({ err: "Invalid agency ObjectId" } as ResErr);
        }
        try {
            const agencies = await AgencyService.find({
                fields: { _id: forAgency },
                lean: true, // hydration needed
                populateJobApplications: false,
                populateJobOffers: true, // for job offer title
                showHashedPassword: false,
                showPersonalData: true // for approval status
            });
            if (agencies.length === 0) {
                logger.debug(
                    "Agency doesn't exist in jobApplication create route"
                );
                return res
                    .status(400)
                    .json({ err: "Agency not found" } as ResErr);
            }

            agency = agencies[0];
        } catch (err) {
            logger.error(
                "Error while finding agency in jobApplication create route"
            );
            logger.error(err);

            return res
                .status(500)
                .json({ err: "Error while finding agency" } as ResErr);
        }

        if (agency.approvalStatus !== "approved") {
            logger.error("JobApplication create unapproved agency");
            return res
                .status(401)
                .json({ err: "Agency is not approved" } as ResErr);
        }

        let jobOffer;
        if (forJobOffer) {
            const j = (agency.jobOffers as JobOfferDoc[]).find(
                j => j._id.toString() === forJobOffer
            );

            if (!j) {
                logger.debug("JobApplication create JobOffer not included");
                return res.status(400).json({
                    err: "Job offer doesn't exist for specified agency"
                });
            }

            jobOffer = j as JobOfferDoc;
            logger.debug(
                "Found job offer " +
                    jobOffer.title +
                    " for jobApplication create"
            );
        }

        const {
            firstName,
            lastName,
            fiscalNumber,
            curriculum,
            email,
            pictureUrl,
            phoneNumber,
            fieldOfStudy,
            hasDrivingLicense,
            canTravel
        } = req.student;

        const jobApplicationDoc = new JobApplication({
            fromStudent: req.student._id,
            forAgency,
            forJobOffer,
            jobOfferTitle: undefined,
            agencyName: agency.agencyName,
            firstName,
            lastName,
            fiscalNumber,
            curriculum,
            message,
            email,
            pictureUrl,
            phoneNumber,
            fieldOfStudy,
            hasDrivingLicense,
            canTravel
        });

        if (jobOffer) {
            jobApplicationDoc.jobOfferTitle = jobOffer.title;
        } else delete jobApplicationDoc.jobOfferTitle;

        try {
            await JobApplicationService.create(jobApplicationDoc);
        } catch (err) {
            if (err instanceof mongoose.Error.ValidationError) {
                logger.debug("JobApplication create validation error");
                logger.debug(err.message);
                return res.status(400).json({ err: err.message } as ResErr);
            }
            logger.error("Error while creating job application");
            logger.error(err);
            return res.status(500).json({
                err: "Error while creating job application"
            } as ResErr);
        }

        logger.info(`Created new jobApplication "${jobApplicationDoc._id}"`);

        const agencyEmail: Mail.Options = {
            from: `"Occupa lo Studente" ${Envs.env.SEND_EMAIL_FROM}`,
            to: agency.email,
            subject: `Nuova candidatura per "${agency.agencyName}" su Occupa lo studente`,
            html: agencyNewJobApplication(
                agency,
                req.student,
                jobApplicationDoc,
                jobOffer
            )
        };

        try {
            await EmailService.sendMail(agencyEmail);
            logger.info(
                `Email sent to agency for new job application "${jobApplicationDoc._id}"`
            );
        } catch (err) {
            logger.error("Error while sending email");
            logger.error(err);
        }

        return res.json(jobApplicationDoc.toObject());
    }
);

export default router;

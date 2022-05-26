import { Router } from "express";
import { param, query, validationResult } from "express-validator";
import Mail from "nodemailer/lib/mailer";
import { agencyElimination } from "services/email/emails";

import { Envs } from "@config";

import { secretaryAuth } from "@middlewares";
import { ResErr } from "@routes";
import { AgencyService, EmailService } from "@services";
import { logger } from "@shared";

/**
 * @openapi
 * /api/secretary/agency/{agencyId}:
 *  delete:
 *    summary: Delete an agency along with all its jobOffers
 *    parameters:
 *      - in: query
 *        name: username
 *        schema:
 *          type: string
 *        required: true
 *        description: Secretary username
 *      - in: query
 *        name: password
 *        schema:
 *          type: string
 *        required: true
 *        description: Secretary password
 *      - in: path
 *        name: agencyId
 *        schema:
 *          type: string
 *        required: true
 *        description: ObjectId of the agency to delete
 *      - in: query
 *        name: notifyAgency
 *        schema:
 *          type: string
 *          enum:
 *            - yes
 *            - no
 *        required: false
 *        description: Whether to send an email to this agency notifying the deletion
 *    tags:
 *      - secretary
 *    responses:
 *      '200':
 *        description: Agency deleted
 *      '400':
 *        description: Invalid agencyId
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 *      '401':
 *        description: Invalid password
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 *      '404':
 *        description: Agency not found
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

router.delete(
    "/:agencyId",
    param("agencyId").isMongoId(),
    query("notifyAgency").optional().isIn(["yes", "no"]),
    secretaryAuth,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                err: errors
                    .array()
                    .map(e => e.msg)
                    .join(", ")
            } as ResErr);
        }

        const { agencyId } = req.params;
        const { notifyAgency } = req.query;

        const agency = await AgencyService.findOne({ _id: agencyId });
        if (!agency) {
            logger.debug(`Agency to delete "${agencyId}" not found`);
            return res.status(404).json({ err: "Agency not found" } as ResErr);
        }

        const email: Mail.Options = {
            from: `"Occupa lo Studente" ${Envs.env.SEND_EMAIL_FROM}`,
            to: agency.email,
            subject: `Eliminazione di "${agency.agencyName}" su Occupa lo studente`,
            html: agencyElimination(agency)
        };

        logger.debug("deleteAgency notifyAgency=" + notifyAgency);
        if (notifyAgency !== "no") {
            try {
                await EmailService.sendMail(email);
                logger.info(
                    `Email sent to agency for delete agency "${agency.agencyName}"`
                );
            } catch (err) {
                logger.error("Error while sending email");
                logger.error(err);
            }

            // DEBUG to be implemented
            logger.warn("DEBUG notifyAgency for Agency deletion!");
        }

        await AgencyService.delete(agency);

        return res.sendStatus(200);
    }
);

export default router;

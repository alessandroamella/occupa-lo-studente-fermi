import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";

import { Agency } from "@models";
import { ResErr } from "@routes";
import { AgencyService } from "@services";
import { logger } from "@shared";

import { validatorSchema } from "./validatorSchema";

// DEBUG
// import faker from "@faker-js/faker"
// import CodiceFiscale from "codice-fiscale-js";

/**
 * @openapi
 * /api/agency:
 *  post:
 *    summary: Create a new agency
 *    tags:
 *      - agency
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/AgencyReq'
 *    responses:
 *      '200':
 *        description: Agency
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Agency'
 *      '400':
 *        description: Data validation failed
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
    checkSchema(validatorSchema),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                err: errors
                    .array()
                    .map(e => e.msg)
                    .join(", ")
            } as ResErr);
        }

        const {
            responsibleFirstName,
            responsibleLastName,
            responsibleFiscalNumber,
            email,
            password,
            websiteUrl,
            phoneNumber,
            agencyName,
            agencyDescription,
            agencyAddress,
            vatCode
            // approvalStatus,
            // jobOffers
        } = req.body;

        let existingAgency;
        try {
            existingAgency = await AgencyService.findOne({
                $or: [{ agencyName }, { email }, { vatCode }]
            });
        } catch (err) {
            logger.error("Error while finding existing agency");
            logger.error(err);
            return res
                .status(500)
                .json({ err: "Error while creating agency" } as ResErr);
        }

        if (existingAgency) {
            return res.status(400).json({
                err: "Agency with the same data (name, email or VAT code) already exists"
            } as ResErr);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const agencyDoc = new Agency({
            responsibleFirstName,
            responsibleLastName,
            responsibleFiscalNumber,
            email,
            hashedPassword,
            websiteUrl,
            phoneNumber,
            agencyName,
            agencyDescription,
            agencyAddress,
            vatCode,
            approvalStatus: "waiting",
            jobOffers: []
        });
        res.json(await AgencyService.create(agencyDoc));

        // DEBUG
        logger.warn("DEBUG new agency: send email");
    }
);

// DEBUG
// async function generateRandom() {
//     const name = faker.name.firstName();
//     const surname = faker.name.lastName();

//     const cf = new CodiceFiscale({birthplace: "Modena", birthplaceProvincia: "MO", day: faker.datatype.number({min: 1, max: 30}), gender: "M", month: faker.datatype.number({min: 1, max: 12}), name, surname, year: faker.datatype.number({min: 1990, max: 2003})})
//     const agencyDoc = new Agency({
//         responsibleFirstName: name,
//         responsibleLastName: surname,
//         responsibleFiscalNumber: cf,
//         email: faker.internet.email(name, surname),
//         websiteUrl: "https://www.google.com",
//         phoneNumber: "3924133359",
//         agencyName: faker.company.companyName(),
//         agencyDescription: faker.lorem.paragraphs(3),
//         agencyAddress: faker.address.city() + " " + faker.address.secondaryAddress(),
//         vatCode: faker.datatype.string(10),
//         approvalStatus: faker.random.arrayElement(["waiting", "approved", "rejected"]),
//         jobOffers: []
//     });
//     await AgencyService.create(agencyDoc);
// }

// for (let i = 0; i < 10; i++) {
//     generateRandom();
// }

export default router;

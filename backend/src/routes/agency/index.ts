import { Router } from "express";

import createRoute from "./create";
import deleteRoute from "./delete";
import jobOfferRoutes from "./joboffer";
import listRoute from "./list";
import showRoute from "./show";
import updateRoute from "./update";

/**
 * @openapi
 *
 *  components:
 *    schemas:
 *      AgencyReq:
 *        type: object
 *        required:
 *          - responsibleFirstName
 *          - responsibleLastName
 *          - responsibleFiscalNumber
 *          - email
 *          - password
 *          - websiteUrl
 *          - phoneNumber
 *          - agencyName
 *          - agencyDescription
 *          - agencyAddress
 *          - vatCode
 *        properties:
 *          responsibleFirstName:
 *            type: string
 *            minLength: 1
 *            maxLength: 100
 *            description: Name of the agency's responsible
 *          responsibleLastName:
 *            type: string
 *            minLength: 1
 *            maxLength: 100
 *            description: Surname of the agency's responsible
 *          responsibleFiscalNumber:
 *            type: string
 *            minLength: 1
 *            maxLength: 100
 *            description: Fiscal number of the agency's responsible
 *          email:
 *            type: string
 *            format: email
 *            minLength: 1
 *            description: Email that students can contact
 *          password:
 *            type: string
 *            minLength: 8
 *            maxLength: 64
 *            description: Password of the agency
 *          websiteUrl:
 *            type: string
 *            description: URL of the agency's website
 *          phoneNumber:
 *            type: string
 *            minLength: 1
 *            maxLength: 100
 *            description: Phone number that students can contact
 *          agencyName:
 *            type: string
 *            minLength: 1
 *            maxLength: 100
 *            description: Name of the agency
 *          agencyDescription:
 *            type: string
 *            minLength: 16
 *            maxLength: 1000
 *            description: Exhaustive description of the agency
 *          agencyAddress:
 *            type: string
 *            minLength: 3
 *            description: Address of the agency, should be selected using a visual map and validated
 *          vatCode:
 *            type: string
 *            minLength: 2
 *            maxLength: 32
 *            description: VAT Code of the agency
 *          logoUrl:
 *            type: string
 *            description: URL of the agency's logo
 */

const router = Router();

router.use("/", showRoute);
router.use("/", listRoute);
router.use("/", createRoute);
router.use("/", updateRoute);
router.use("/", deleteRoute);

router.use("/joboffer", jobOfferRoutes);

export default router;

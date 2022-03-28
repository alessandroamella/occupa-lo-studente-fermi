import CodiceFiscale from "codice-fiscale-js";
import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import { oauth2_v2 } from "googleapis";

import { Envs } from "@config";

import { GoogleAuthUrl } from "@models";
import { ResErr } from "@routes";
import { GoogleAuthService, StudentService } from "@services";
import { logger } from "@shared";
import { mongoose } from "@typegoose/typegoose";

import studentValidatorSchema from "../validatorSchema";
import { StudentAuthCookieManager } from "./StudentAuthCookieManager";

const router = Router();

/**
 * @openapi
 * /api/student/auth/signup:
 *  post:
 *    summary: >
 *      If a student has logged in with Google but is not
 *      saved in the DB, he will need to signup.
 *      Some of his data is parsed from the temp data
 *      cookie (containing all the information that Google gave)
 *      and the rest of it (phone number etc.) is what the student
 *      just sent in this request, so it will be contained in
 *      the request body
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Student'
 *    tags:
 *      - student
 *    responses:
 *      '200':
 *        description: Student successfully registered
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Student'
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
 *      '510':
 *        description: Missing temp data cookie, client needs to navigate to response URL in order to login again with Google
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GoogleAuthUrl'
 */

// To not repeat code
function _clearTempCookie(res: Response) {
    // Bad temp data cookie, clear it
    res.clearCookie(Envs.env.TEMP_AUTH_DATA_COOKIE_NAME, {
        httpOnly: true,
        signed: true
    });
}

router.post(
    "/",
    checkSchema(studentValidatorSchema),
    async (req: Request, res: Response) => {
        if (req.student) {
            logger.debug("Student is already logged in");
            return res.json(req.student.toObject());
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.debug("/signup validation error:");
            logger.debug(
                errors
                    .array()
                    .map(e => e.msg)
                    .join(", ")
            );
            return res.status(400).json({
                err: errors
                    .array()
                    .map(e => e.msg)
                    .join(", ")
            } as ResErr);
        }

        logger.debug("/signup passed student schema verification");

        const tempDataCookie =
            req.signedCookies[Envs.env.TEMP_AUTH_DATA_COOKIE_NAME];
        if (!tempDataCookie) {
            // return res
            //     .status(400)
            //     .json({ err: "No Google temp data cookie" } as ResErr);

            const auth = await GoogleAuthService.createConnection(); // this is from previous step
            const url = await GoogleAuthService.getConnectionUrl(auth);

            logger.debug(
                "No Google temp data cookie, generated new URL " + url
            );
            return res.status(510).json({ url } as GoogleAuthUrl);
        }

        // Load Google data from cookie
        let googleTempData: oauth2_v2.Schema$Userinfo;

        try {
            googleTempData = await GoogleAuthService.parseTempAuthDataCookie(
                tempDataCookie
            );
        } catch (err) {
            logger.error("Error while parsing Google temp data JWT");
            logger.error(err);

            _clearTempCookie(res);

            return res
                .status(500)
                .json({ err: "Error while loading Google data" } as ResErr);
        }

        const { email, hd, id, picture } = googleTempData;

        logger.debug(`Loaded temp data cookie, email is "${email}"`);

        if (!hd || !Envs.env.EMAIL_SUFFIX.includes(hd)) {
            _clearTempCookie(res);

            return res.status(400).json({
                err: `You're not part of the ${Envs.env.EMAIL_SUFFIX} organization`
            } as ResErr);
        }

        try {
            // user already exists, just login
            const existingStudent = await StudentService.findOne({
                email
            });
            if (existingStudent) {
                logger.debug("Student already exists, logging in");
                await StudentAuthCookieManager.saveStudentAuthCookie(
                    res,
                    existingStudent
                );

                return res.json(existingStudent.toObject());
            }
        } catch (err) {
            logger.error("Error while finding student in StudentService");
            logger.error(err);
            return res
                .status(500)
                .json({ err: "Error while loading database" } as ResErr);
        }

        let student;

        const {
            firstName,
            lastName,
            fiscalNumber,
            phoneNumber,
            curriculumLink,
            fieldOfStudy
        } = req.body;

        const cf = new CodiceFiscale(fiscalNumber);
        logger.debug(`Cf name: "${cf.name}", surname: "${cf.surname}"`);
        if (
            !cf.name
                .toLowerCase()
                .split("")
                .every(c => (firstName as string).toLowerCase().includes(c))
        ) {
            logger.debug("Fiscal number doesn't correspond to name");
            return res.status(400).json({
                err: "Fiscal number doesn't correspond to name"
            } as ResErr);
        } else if (
            !cf.surname
                .toLowerCase()
                .split("")
                .every(c => (lastName as string).toLowerCase().includes(c))
        ) {
            logger.debug("Fiscal number doesn't correspond to surname");
            return res.status(400).json({
                err: "Fiscal number doesn't correspond to name"
            } as ResErr);
        }

        try {
            student = await StudentService.create({
                email: email as string,
                firstName,
                lastName,
                fiscalNumber,
                googleId: id as string,
                phoneNumber,
                fieldOfStudy,
                pictureURL: picture as string,
                curriculumLink,
                spidVerified: false
            });
        } catch (err) {
            if (err instanceof mongoose.Error.ValidationError) {
                logger.debug("Validation error while creating student");
                logger.debug(err);
                return res.status(400).json({ err: err.message } as ResErr);
            }

            logger.error("Error while creating student");
            logger.error(err);
            return res
                .status(500)
                .json({ err: "Error while creating student" } as ResErr);
        }

        logger.debug(`New student "${firstName} ${lastName}" saved in DB`);

        _clearTempCookie(res);
        await StudentAuthCookieManager.saveStudentAuthCookie(res, student);

        res.json(student.toObject());
    }
);

export default router;

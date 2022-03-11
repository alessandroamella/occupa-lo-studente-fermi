import { Request, Response, Router } from "express";
import { checkSchema } from "express-validator";
import { oauth2_v2 } from "googleapis";

import { Envs } from "@config";

import { ResErr } from "@routes";
import { GoogleAuthService, StudentAuthService } from "@services";
import { logger } from "@shared";
import { mongoose } from "@typegoose/typegoose";

import studentValidatorSchema from "../validatorSchema";

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
 *      - auth
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
 */

router.post(
    "/",
    checkSchema(studentValidatorSchema),
    async (req: Request, res: Response) => {
        const tempDataCookie =
            req.signedCookies[Envs.env.TEMP_AUTH_DATA_COOKIE_NAME];
        if (!tempDataCookie) {
            return res
                .status(400)
                .json({ err: "No Google temp data cookie" } as ResErr);
        }

        let googleTempData: oauth2_v2.Schema$Userinfo;

        try {
            googleTempData = await GoogleAuthService.parseTempAuthDataCookie(
                tempDataCookie
            );
        } catch (err) {
            logger.error("Error while parsing Google temp data JWT");
            logger.error(err);
            return res
                .status(500)
                .json({ err: "Error while loading Google data" });
        }

        const { email, family_name, given_name, hd, id, picture } =
            googleTempData;

        if (!hd || !Envs.env.EMAIL_SUFFIX.includes(hd)) {
            return res.status(400).json({
                err: `You're not part of the ${Envs.env.EMAIL_SUFFIX} organization`
            } as ResErr);
        }

        let student;

        try {
            student = await StudentAuthService.createStudent({
                email: email as string,
                firstName: given_name as string,
                lastName: family_name as string,
                fiscalNumber: req.body.fiscalNumber,
                googleId: id as string,
                phoneNumber: req.body.phoneNumber,
                pictureURL: picture as string,
                curriculumLink: req.body.curriculumLink
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

        res.json(student.toObject());
    }
);

export default router;

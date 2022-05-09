import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";

import { ResErr } from "@routes";
import { StudentService } from "@services";
import { logger } from "@shared";
import { mongoose } from "@typegoose/typegoose";

import { StudentAuthCookieManager } from "../helpers";
import schema from "../schema/validatorSchema";

const router = Router();

/**
 * @openapi
 * /api/student/auth/testauth:
 *  post:
 *    summary: Login route used in testing environment
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Student'
 *    tags:
 *      - student
 *    responses:
 *      '200':
 *        description: Auth successful, new student object is returned
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Student'
 *      '400':
 *        description: Invalid body
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

router.post("/", checkSchema(schema), async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.debug("/testauth validation error:");
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

    logger.warn("Creating test student");

    let student;
    try {
        student = await StudentService.create(req.body);
    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            logger.debug("Validation error while creating test student");
            logger.debug(err);
            return res.status(400).json({ err: err.message } as ResErr);
        }

        logger.debug("Error while creating test student");
        logger.debug(err);
        return res
            .status(500)
            .json({ err: "Error while creating student" } as ResErr);
    }

    logger.debug(
        `New TEST student "${student.firstName} ${student.lastName}" saved in DB`
    );

    await StudentAuthCookieManager.saveStudentAuthCookie(res, student);
    res.json(student.toObject());
});

export default router;

import { Request, Response, Router } from "express";
import { checkSchema, validationResult } from "express-validator";

import { isLoggedIn } from "@middlewares";
import { ResErr } from "@routes";
import { StudentService } from "@services";
import { logger } from "@shared";
import { mongoose } from "@typegoose/typegoose";

import schema from "./schema/updateSchema";

/**
 * @openapi
 * /api/student:
 *  put:
 *    summary: Update the currently logged in student
 *    security:
 *      - studentAuth: []
 *    tags:
 *      - student
 *    responses:
 *      '200':
 *        description: Student
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

router.put(
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
        } else if (!req.student) {
            logger.error("req.student false in update route");
            return res.status(500).json({ err: "Error while loading student" });
        }

        const {
            curriculum,
            phoneNumber,
            fieldOfStudy,
            hasDrivingLicense,
            canTravel
        } = req.body;

        for (const prop in {
            curriculum,
            phoneNumber,
            fieldOfStudy,
            hasDrivingLicense,
            canTravel
        }) {
            if (req.body[prop] !== undefined && req.body[prop] !== null) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (req.student as any)[prop] = req.body[prop];
            }
        }

        try {
            await StudentService.update(req.student);
        } catch (err) {
            if (err instanceof mongoose.Error.ValidationError) {
                logger.debug("Student update validation error");
                logger.debug(err.message);
                return res.status(400).json({ err: err.message } as ResErr);
            }
            logger.error("Error while updating student " + req.student._id);
            logger.error(err);
            return res
                .status(500)
                .json({ err: "Error while updating student" } as ResErr);
        }

        return res.json(req.student.toObject());
    }
);

export default router;

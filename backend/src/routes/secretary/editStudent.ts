import { Request, Response, Router } from "express";
import { checkSchema, param, validationResult } from "express-validator";

import { secretaryAuth } from "@middlewares";
import { ResErr } from "@routes";
import { StudentService } from "@services";
import { logger } from "@shared";

import schema from "../student/schema/createSchema";

/**
 * @openapi
 * /api/secretary/agencies:
 *  put:
 *    summary: Update a student
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
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Student'
 *    tags:
 *      - secretary
 *    responses:
 *      '200':
 *        description: Updated student
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Student'
 *      '401':
 *        description: Invalid password
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 *      '404':
 *        description: Student not found
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
    "/:_id",
    secretaryAuth,
    param("_id").isMongoId(),
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

        const { _id } = req.params;

        // DEBUG check authentication
        try {
            const student = await StudentService.findOne({ _id });
            if (!student) {
                return res
                    .status(404)
                    .json({ err: "Student not found" } as ResErr);
            }

            const {
                googleId,
                firstName,
                lastName,
                fiscalNumber,
                email,
                pictureUrl,
                phoneNumber,
                fieldOfStudy,
                hasDrivingLicense,
                canTravel
            } = req.body;

            for (const prop in {
                googleId,
                firstName,
                lastName,
                fiscalNumber,
                email,
                pictureUrl,
                phoneNumber,
                fieldOfStudy,
                hasDrivingLicense,
                canTravel
            }) {
                if (req.body[prop]) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (student as any)[prop] = req.body[prop];
                    logger.debug(
                        `Prop "${prop} was updated to "${req.body[prop]}" in Student ${student._id}"`
                    );
                }
            }

            await StudentService.update(student);
            return res.json(student);
        } catch (err) {
            logger.error("Error while updating student");
            logger.error(err);

            return res
                .status(500)
                .json({ err: "Error while updating student" } as ResErr);
        }
    }
);

export default router;

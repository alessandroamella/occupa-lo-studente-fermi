import { Router } from "express";

import { isStudentLoggedIn } from "@middlewares";
import { ResErr } from "@routes";
import { StudentService } from "@services";
import { logger } from "@shared";

/**
 * @openapi
 * /api/student:
 *  delete:
 *    summary: Deletes current student from request object (if signed in)
 *    tags:
 *      - student
 *    responses:
 *      '200':
 *        description: Student was deleted (empty response)
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

router.delete("/", isStudentLoggedIn.isStudentLoggedIn, async (req, res) => {
    if (!req.student) {
        logger.error("req.student null with isLoggedIn middleware");
        return res.status(401).json({
            err: "You need to be logged in to view this page"
        } as ResErr);
    }
    try {
        await StudentService.delete(req.student);
        res.sendStatus(200);
    } catch (err) {
        logger.error("Error while deleting student");
        logger.error(err);
        res.status(500).json({ err: "Error while deleting student" } as ResErr);
    }
});

export default router;

import { Router } from "express";

import { isLoggedIn } from "@middlewares";

/**
 * @openapi
 * /api/student:
 *  get:
 *    summary: Get current student from request object (if signed in)
 *    tags:
 *      - student
 *    responses:
 *      '200':
 *        description: Student
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Student'
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

router.get("/", isLoggedIn.isStudentLoggedIn, (req, res) => {
    return res.json(req.student?.toObject());
});

export default router;

import { Router } from "express";

import { ResErr } from "@routes";

/**
 * @openapi
 * /api/student/current:
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

router.get("/", (req, res) => {
    if (req.student) {
       return res.json(req.student);
    }

    return res.status(401).json({ err: "Not logged in" } as ResErr);
});

export default router;

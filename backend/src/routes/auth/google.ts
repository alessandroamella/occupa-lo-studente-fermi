import { createConnection, getConnectionUrl } from "config/google";
import { Router } from "express";

const router = Router();

/**
 * @openapi
 * /api/auth/google:
 *  get:
 *    summary: Gets Google URL for authentication
 *    tags:
 *      - auth
 *    responses:
 *      '200':
 *        description: Auth URL
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GoogleAuthUrl'
 *      '500':
 *        description: Server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ResErr'
 */

router.get("/", (req, res) => {
    const auth = createConnection(); // this is from previous step
    const url = getConnectionUrl(auth);
    res.json({ url });
});

export default router;

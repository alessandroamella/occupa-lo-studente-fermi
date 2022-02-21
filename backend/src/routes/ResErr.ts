/**
 * @swagger
 *  components:
 *    schemas:
 *      ResErr:
 *        type: object
 *        required:
 *          - err
 *        properties:
 *          err:
 *            type: string
 *            description: Error message
 *            example: Error while loading data
 */

export interface ResErr {
    err: string;
}
export function isResErr(err: unknown): err is ResErr {
    return typeof err === "string";
}

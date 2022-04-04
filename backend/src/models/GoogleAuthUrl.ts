/**
 * @openapi
 *
 *  components:
 *    schemas:
 *      GoogleAuthUrl:
 *        type: object
 *        required:
 *          - url
 *        properties:
 *          url:
 *            type: string
 *            description: Google auth URL
 */

export interface GoogleAuthUrl {
    url: string;
}

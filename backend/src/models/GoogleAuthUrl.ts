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

export default interface GoogleAuthUrl {
    url: string;
}

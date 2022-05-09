import IsEmail from "isemail";
import { isValidPhoneNumber } from "libphonenumber-js";

import {
    DocumentType,
    getModelForClass,
    modelOptions,
    prop
} from "@typegoose/typegoose";

/**
 * @openapi
 *
 *  components:
 *    schemas:
 *      Student:
 *        type: object
 *        description: Student data as fetched from SPID authentication
 *        required:
 *          - googleId
 *          - firstName
 *          - lastName
 *          - fiscalNumber
 *          - email
 *          - pictureURL
 *          - phoneNumber
 *          - fieldOfStudy
 *          - hasDrivingLicense
 *          - canTravel
 *        properties:
 *          googleId:
 *            type: string
 *            description: Google ID for OAuth 2.0 authentication
 *          firstName:
 *            type: string
 *            description: Name
 *          lastName:
 *            type: string
 *            description: Surname
 *          fiscalNumber:
 *            type: string
 *            description: Fiscal number
 *          curriculum:
 *            type: string
 *            description: Student curriculum with markdown
 *          email:
 *            type: string
 *            format: email
 *            description: Email (must be @fermi.mo.it)
 *          pictureURL:
 *            type: string
 *            description: URL of the profile picture
 *          phoneNumber:
 *            type: string
 *            description: Phone number validated with phone.js
 *          fieldOfStudy:
 *            type: string
 *            enum:
 *              - it
 *              - electronics
 *              - chemistry
 *            description: Field of study of this student
 *          hasDrivingLicense:
 *            type: boolean
 *            description: Whether the student has a driving license
 *          canTravel:
 *            type: boolean
 *            description: Whether the student can travel independently
 */

@modelOptions({ schemaOptions: { collection: "Student", timestamps: true } })
export class StudentClass {
    @prop({ required: true })
    public googleId!: string;

    @prop({ required: true })
    public firstName!: string;

    @prop({ required: true })
    public lastName!: string;

    @prop({ required: true })
    public fiscalNumber!: string;

    @prop({ required: false })
    public curriculum?: string;

    @prop({ required: true, validate: [IsEmail.validate, "Invalid email"] })
    public email!: string;

    @prop({ required: true })
    public pictureURL!: string;

    @prop({
        required: true,
        validate: [
            (v: string) => isValidPhoneNumber(v, "IT"),
            "Invalid phone number"
        ]
    })
    public phoneNumber!: string;

    @prop({ required: true, enum: ["it", "electronics", "chemistry"] })
    public fieldOfStudy!: string;

    @prop({ required: true, default: false })
    public hasDrivingLicense!: boolean;

    @prop({ required: true, default: false })
    public canTravel!: boolean;
}

export type StudentDoc = DocumentType<StudentClass>;

export const Student = getModelForClass(StudentClass);

export interface CreateStudentData {
    googleId: string;
    firstName: string;
    lastName: string;
    fiscalNumber: string;
    curriculum?: string;
    email: string;
    pictureURL: string;
    phoneNumber: string;
    fieldOfStudy: "it" | "electronics" | "chemistry";
    hasDrivingLicense: boolean;
    canTravel: boolean;
}
export type StudentTempData = Omit<
    CreateStudentData,
    | "fiscalNumber"
    | "curriculum"
    | "phoneNumber"
    | "hasDrivingLicense"
    | "canTravel"
>;

import jwt from "jsonwebtoken";
import { FilterQuery } from "mongoose";

import { Envs } from "@config";

import {
    CreateStudentData,
    JobApplication,
    Student,
    StudentDoc
} from "@models";
import { logger } from "@shared";

export class StudentService {
    public static async create(data: CreateStudentData): Promise<StudentDoc> {
        logger.info(`Create student "${data.firstName} ${data.lastName}"`);
        return await Student.create(data);
    }

    public static async find(
        fields: FilterQuery<StudentDoc | null>
    ): Promise<StudentDoc[]> {
        return await Student.find(fields)
            .sort({ lastName: 1, firstName: 1 })
            .exec();
    }

    public static async findOne(
        fields: FilterQuery<StudentDoc | null>,
        populateJobApplications = true
    ): Promise<StudentDoc | null> {
        const q = Student.findOne(fields);
        if (populateJobApplications) q.populate("jobApplications");
        return await q.exec();
    }

    public static async delete(student: StudentDoc) {
        logger.debug(
            `Deleting student jobApplications: ${student.jobApplications.join(
                ", "
            )}`
        );
        await JobApplication.deleteMany({
            _id: { $in: student.jobApplications }
        });

        logger.debug(`Deleting student ${student._id}`);
        await student.deleteOne();
    }

    public static async update(studentDoc: StudentDoc) {
        logger.debug("Updating student with _id " + studentDoc._id);
        return await studentDoc.save();
    }

    public static createAuthCookie(student: StudentDoc): Promise<string> {
        return new Promise((resolve, reject) => {
            logger.debug(
                `Creating JWT auth cookie for student "${student._id}"`
            );
            jwt.sign(
                { student: student._id },
                Envs.env.JWT_SECRET,
                {},
                (err, cookie) => {
                    if (err) {
                        logger.warn(
                            "createAuthCookie failed: error while creating auth cookie"
                        );
                        logger.warn(err);
                        return reject(err);
                    } else if (!cookie) {
                        logger.debug("createAuthCookie cookie is undefined");
                        return reject("createAuthCookie cookie is undefined");
                    }

                    return resolve(cookie);
                }
            );
        });
    }

    public static async parseAuthCookie(
        jwtCookie: string
    ): Promise<StudentDoc> {
        return new Promise((resolve, reject) => {
            jwt.verify(
                jwtCookie,
                Envs.env.JWT_SECRET,
                {},
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (err, jwtPayload: any) => {
                    if (err) {
                        logger.debug(
                            "parseAuthCookie failed: error while parsing auth cookie"
                        );
                        logger.debug(err);
                        return reject(err);
                    }

                    if (!jwtPayload.student) {
                        return reject(
                            "parseAuthCookie jwtPayload has no student"
                        );
                    }

                    StudentService.findOne({
                        _id: jwtPayload.student
                    })
                        .then(obj =>
                            obj
                                ? resolve(obj)
                                : reject("parseAuthCookie can't find student")
                        )
                        .catch(err => {
                            logger.warn("parseAuthCookie failed");
                            logger.warn(err);
                            return reject(err);
                        });
                }
            );
        });
    }
}

export * from "./google";

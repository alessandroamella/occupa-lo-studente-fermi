import { FilterQuery } from "mongoose";

import {
    CreateStudentData,
    JobApplication,
    Student,
    StudentClass
} from "@models";
import { logger } from "@shared";
import { DocumentType } from "@typegoose/typegoose";

export class StudentService {
    public static async create(
        data: CreateStudentData
    ): Promise<DocumentType<StudentClass>> {
        return await Student.create(data);
    }

    public static async findOne(
        fields: FilterQuery<DocumentType<StudentClass> | null>
    ): Promise<DocumentType<StudentClass> | null> {
        return await Student.findOne(fields).exec();
    }

    public static async delete(student: DocumentType<StudentClass>) {
        logger.debug(
            `Deleting jobApplications for student ${
                student._id
            }: ${student.jobApplications.join(", ")}`
        );
        await JobApplication.deleteMany({
            _id: { $in: student.jobApplications }
        });
        logger.debug(`Deleting student ${student._id}`);
        await student.deleteOne();
    }
}

export * from "./auth";

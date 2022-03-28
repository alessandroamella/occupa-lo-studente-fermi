import { FilterQuery } from "mongoose";

import { CreateStudentData, Student, StudentClass } from "@models";
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
}

export * from "./auth";

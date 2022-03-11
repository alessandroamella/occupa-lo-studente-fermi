import { FilterQuery } from "mongoose";

import { CreateStudentData, Student, StudentClass } from "@models";
import { DocumentType } from "@typegoose/typegoose";
import { BeAnObject } from "@typegoose/typegoose/lib/types";

export class StudentAuthService {
    public static async createStudent(data: CreateStudentData) {
        const student = await Student.create(data);
        return student;
    }

    public static async findStudent(
        fields: FilterQuery<DocumentType<StudentClass, BeAnObject>>
    ) {
        return await Student.findOne(fields).exec();
    }
}

export * from "./agency";
export * from "./student";

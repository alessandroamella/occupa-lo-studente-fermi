import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { StudentAuthCookieManager } from "../routes/student/auth/StudentAuthCookieManager";

import { Envs } from "@config";

import { Agency, AgencyClass, StudentClass } from "@models";
import { logger } from "@shared";
import { ReturnModelType, mongoose } from "@typegoose/typegoose";
import { BeAnObject, DocumentType } from "@typegoose/typegoose/lib/types";

interface UserWithId {
    student?: string;
    agency?: string;
}

const { AUTH_COOKIE_NAME, JWT_SECRET } = Envs.env;

// enum _PossibleFields {
//     STUDENT = "student",
//     AGENCY = "agency"
// }
type _PossibleFields = "student" | "agency";

export class PopulateReq {
    public static async populateStudent(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        let student;
        try {
            student = await StudentAuthCookieManager.loadStudentAuthCookie(
                req,
                res
            );
        } catch (err) {
            logger.error("Error while loading student auth cookie");
            logger.error(err);
            return next();
        }
        if (!student) return PopulateReq._nullReq("student", req, next);

        logger.debug("populateReqStudent successful");
        req.student = student;
        return next();
    }

    // DEBUG - To refactor!!
    public static async populateAgency(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        return await PopulateReq._populateFields("agency", Agency, req, next);
    }

    private static _nullReq(
        field: _PossibleFields,
        req: Request,
        next: NextFunction
    ) {
        logger.debug("populateReq failed");

        req[field] = null;
        return next();
    }

    private static async _populateFields(
        fieldName: _PossibleFields,
        DbModel:
            | ReturnModelType<typeof StudentClass, BeAnObject>
            | ReturnModelType<typeof AgencyClass, BeAnObject>,
        req: Request,
        next: NextFunction
    ) {
        try {
            if (!req.signedCookies[AUTH_COOKIE_NAME as string]) {
                return PopulateReq._nullReq(fieldName, req, next);
            }

            const jwtPayload: UserWithId = jwt.verify(
                req.signedCookies[AUTH_COOKIE_NAME as string],
                JWT_SECRET as string
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as any;

            if (!jwtPayload[fieldName]) {
                return PopulateReq._nullReq(fieldName, req, next);
            }

            const obj = await DbModel.findOne({
                _id: jwtPayload[fieldName]
            }).exec();
            if (!obj) return PopulateReq._nullReq(fieldName, req, next);

            logger.debug("populateReq successful");

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            req[fieldName] = obj as DocumentType<any>;
            return next();
        } catch (err) {
            logger.debug(err);
            if (err instanceof mongoose.Error) {
                logger.error(err);
            }
            PopulateReq._nullReq("student", req, next);
        }
    }
}

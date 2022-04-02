import { FilterQuery } from "mongoose";

import { Agency, AgencyClass } from "@models";
import { logger } from "@shared";
import { DocumentType } from "@typegoose/typegoose";

export class AgencyService {
    public static async findOne(
        fields: FilterQuery<DocumentType<AgencyClass> | null>,
    ): Promise<DocumentType<AgencyClass> | null> {
        logger.debug("Finding single agency...");
        return await Agency.findOne(fields).exec();
    }
    
    public static async find(
        fields: FilterQuery<DocumentType<AgencyClass> | null>,
        skip = 0,
        limit = 100
    ): Promise<DocumentType<AgencyClass>[] | null> {
        logger.debug("Finding all agencies...");
        return await Agency.find(fields).skip(skip).limit(limit).sort({updatedAt: -1}).exec();
    }

    public static async create(newAgency: DocumentType<AgencyClass>) {
        logger.debug("Create agency with name " + newAgency.agencyName);
        return await Agency.create(newAgency);
    }

    public static async update(
        _id: string,
        newAgency: DocumentType<AgencyClass>
    ) {
        logger.debug("Update agency with _id " + _id);
        return await Agency.updateOne({ _id }, newAgency).exec();
    }
}

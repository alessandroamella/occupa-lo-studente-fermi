import { Agency, AgencyClass } from "@models";
import { logger } from "@shared";
import { DocumentType } from "@typegoose/typegoose";

export class AgencyService {
    public static async show(
        _id: string
    ): Promise<DocumentType<AgencyClass> | null> {
        try {
            logger.debug("Find agency with _id " + _id);
            return await Agency.findOne({ _id }).exec();
        } catch (err) {
            logger.error(err);
            return null;
        }
    }

    public static async create(newAgency: DocumentType<AgencyClass>) {
        try {
            logger.debug("Create agency with name " + newAgency.name);
            return await Agency.create(newAgency);
        } catch (err) {
            logger.error(err);
            return null;
        }
    }

    public static async update(
        _id: string,
        newAgency: DocumentType<AgencyClass>
    ) {
        try {
            logger.debug("Update agency with _id " + _id);
            return await Agency.updateOne({ _id }, newAgency).exec();
        } catch (err) {
            logger.error(err);
            return null;
        }
    }
}

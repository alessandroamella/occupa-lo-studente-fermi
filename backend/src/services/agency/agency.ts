import { logger } from "@shared";
import { DocumentType } from "@typegoose/typegoose";
import Agency, { AgencyClass } from "models/Agency";

class AgencyService {
    public static async show(
        _id: string
    ): Promise<DocumentType<AgencyClass> | null> {
        try {
            return await Agency.findOne({ _id }).exec();
        } catch (err) {
            logger.error(err);
            return null;
        }
    }

    public static async create(newAgency: DocumentType<any>) {
        try {
            return await Agency.create(newAgency).exec();
        } catch (err) {
            logger.error(err);
            return null;
        }
    }

    public static async update(_id: string, newAgency: DocumentType<any>) {
        try {
            return await Agency.updateOne({ _id }, newAgency).exec();
        } catch (err) {
            logger.error(err);
            return null;
        }
    }
}

export default AgencyService;

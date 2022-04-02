import cookieParser from "cookie-parser";
import express, { Express } from "express";
import { handleMalformedJsonBody } from "@middlewares";
import moment from "moment";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { Envs, loadConfig, specs as swaggerSpecs } from "@config";

import { PopulateReq } from "@middlewares";
import { Agency, AgencyClass, JobOffer, SecretaryClass, StudentClass } from "@models";
import apiRoutes from "@routes";
import { LoggerStream, logger } from "@shared";
import { DocumentType } from "@typegoose/typegoose";

const app: Express = express();

// Extend Express object
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            student: DocumentType<StudentClass> | null;
            agency: DocumentType<AgencyClass> | null;
            secretary?: DocumentType<SecretaryClass>;
        }
    }
}

// Swagger
if (Envs.env.NODE_ENV !== "production") {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpecs, { explorer: true })
    );
}

// Log requests
app.use(morgan("dev", { stream: new LoggerStream() }));

// Parse body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Parse cookies
app.use(cookieParser(Envs.env.COOKIE_SECRET));

// Custom middlewares
app.use(PopulateReq.populateAgency);
app.use(PopulateReq.populateStudent);
// Custom middleware to handle malformed JSON bodies
app.use(handleMalformedJsonBody);

// API Routes
app.use("/api", apiRoutes);

const PORT = Number(process.env.PORT) || 5000;
const IP = process.env.IP || "0.0.0.0";

loadConfig().then(() => {
    logger.info("Config finished loading");
});
app.listen(PORT, IP, () => {
    logger.info(`Server started at ${IP}:${PORT}`);
});

async function testData() {
    const agency = new Agency({
        responsibleFirstName: "Giuseppina",
        responsibleLastName: "Russo",
        responsibleFiscalNumber: "RSSGPP70A41F839C",
        email: "napoli.merda@gmail.com",
        websiteUrl:
            "http://minecraft.gamepedia.com/Formatting_codes#Color_codes",
        phoneNumber: "3924133359",
        agencyName: "Beppa Pizza",
        agencyDescription: "Migliore pizzeria di napoli",
        agencyAddress: "Via ASghfWUFWUFWEFIWEF, Agrigento",
        vatCode: "2201090368",
        jobOffers: []
    });

    const jobOffer = new JobOffer({
        agency: agency._id,
        title: "Programmatore Node",
        description:
            "Masse! Volevi. Ma secondo te?? Secondo te?? aljnbkausfd jgfwruvufgu gfadsukgfakl fhaewiyfgaewufaghkyiftgaw8 gfaweut7faweutfawuaewi7tdf",
        fieldOfStudy: "it",
        expiryDate: moment().add(3, "months").toDate(),
        mustHaveDiploma: false,
        jobApplications: []
    });

    agency.jobOffers.push(jobOffer._id);

    await agency.save();

    await jobOffer.save();
}

// testData();

import cookieParser from "cookie-parser";
import express, { Express } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { Envs, specs as swaggerSpecs } from "@config";

import { handleMalformedJsonBody } from "@middlewares";
import { PopulateReq } from "@middlewares";
import { AgencyClass, SecretaryClass, StudentClass } from "@models";
import apiRoutes from "@routes";
import { LoggerStream } from "@shared";
import { DocumentType } from "@typegoose/typegoose";

export const app: Express = express();

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

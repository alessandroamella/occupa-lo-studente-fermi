import cookieParser from "cookie-parser";
import express, { Express } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { Envs, loadConfig, specs as swaggerSpecs } from "@config";

import { PopulateReq } from "@middlewares";
import { AgencyClass, StudentClass } from "@models";
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

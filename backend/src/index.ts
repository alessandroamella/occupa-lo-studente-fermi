import { DocumentType } from "@typegoose/typegoose";
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { envs, loadConfig } from "./config";
import { specs as swaggerSpecs } from "./config/swagger";
import PopulateReq from "./middlewares/populateReq";
import { AgencyClass } from "./models/Agency";
import { StudentClass } from "./models/Student";
import apiRoutes from "./routes";
import { LoggerStream, logger } from "./shared";

const app = express();

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
if (envs.NODE_ENV !== "production") {
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

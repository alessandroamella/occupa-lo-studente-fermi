import { LoggerStream, logger } from "@shared";
import { specs as swaggerSpecs } from "config/swagger";
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import "./config";
import apiRoutes from "./routes";

const app = express();

// Swagger
if (process.env.NODE_ENV !== "production") {
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

// API Routes
app.use("/api", apiRoutes);

const PORT = Number(process.env.PORT) || 5000;
const IP = process.env.IP || "0.0.0.0";
app.listen(PORT, IP, () => {
    logger.info(`Server started at ${IP}:${PORT}`);
});

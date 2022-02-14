import { logger } from "@shared";
import swaggerUi from "swagger-ui-express";
import express from "express";
import { specs as swaggerSpecs } from "config/swagger";

const app = express();

// Swagger
if (process.env.NODE_ENV !== "production") {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpecs, { explorer: true })
    );
}

const PORT = Number(process.env.PORT) || 5000;
const IP = process.env.IP || "0.0.0.0";
app.listen(PORT, IP, () => {
    logger.info(`Server started at ${IP}:${PORT}`);
});

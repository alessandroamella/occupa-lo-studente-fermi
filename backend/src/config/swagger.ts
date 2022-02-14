import { logger } from "@shared";
import swaggerJsdoc from "swagger-jsdoc";

export const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Occupa lo studente",
            version: "1.0.0",
            description:
                "Progetto SSH occupa lo studente di Alessandro Amella e Yaroslav Pavlik"
        },
        servers: [
            {
                url: "http://localhost:5000/",
                description: "Documentazione API"
            }
        ]
    },
    apis: ["**/*.ts"]
};

logger.info(`APIs path at "${options.apis.join('", "')}"`);

export const specs = swaggerJsdoc(options);

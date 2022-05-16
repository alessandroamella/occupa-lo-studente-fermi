import { hashSync } from "bcrypt";
import { parsePhoneNumber } from "libphonenumber-js";

import { loadConfig } from "@config";

import { Agency, JobOffer } from "@models";
import { logger } from "@shared";

import { app } from "./app";

loadConfig().then(() => {
    logger.info("Config finished loading");
});

const PORT = Number(process.env.PORT) || 5000;
const IP = process.env.IP || "0.0.0.0";

app.listen(PORT, IP, () => {
    logger.info(`Server started at ${IP}:${PORT}`);
});

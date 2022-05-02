import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

import { Envs } from "@config";

import { logger } from "@shared";

export class EmailService {
    private static transporter: nodemailer.Transporter | null = null;

    private static _initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            EmailService.transporter = nodemailer.createTransport({
                host: Envs.env.MAIL_SERVER,
                auth: {
                    user: Envs.env.MAIL_USERNAME,
                    pass: Envs.env.MAIL_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            EmailService.transporter.verify((err, success): void => {
                if (err) {
                    logger.error(err);
                    return reject(err);
                }
                logger.info("Email ready: " + success);
                return resolve();
            });
        });
    }

    public static async sendMail(message: Mail.Options): Promise<void> {
        if (!EmailService.transporter) {
            await EmailService._initialize();
        }
        return new Promise((resolve, reject) => {
            if (!EmailService.transporter) {
                logger.error("EmailService.transporter null in sendMail");
                return reject("EmailService.transporter null");
            }
            EmailService.transporter.sendMail(message, (err, info) => {
                if (err) {
                    logger.error("Error while sending email");
                    logger.error(err);
                    return reject(err);
                }
                return resolve();
            });
        });
    }
}

export default EmailService;

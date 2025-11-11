"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../../config/env");
const logger_1 = require("../logger");
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: env_1.env.SMTP_HOST,
            port: env_1.env.SMTP_PORT,
            secure: env_1.env.SMTP_PORT === 465,
            auth: env_1.env.SMTP_AUTH_DISABLED ? undefined : {
                user: env_1.env.SMTP_USERNAME,
                pass: env_1.env.SMTP_PASSWORD,
            },
        });
    }
    compileTemplate(template, variables) {
        const file = path_1.default.join(__dirname, 'templates', `${template}.hbs`);
        const source = fs_1.default.readFileSync(file, 'utf-8');
        const tpl = handlebars_1.default.compile(source);
        return tpl(variables);
    }
    async sendOtpEmail(to, code) {
        if (env_1.env.SMTP_AUTH_DISABLED) {
            logger_1.logger.warn({ to }, 'SMTP disabled; skipping email send');
            return;
        }
        const html = this.compileTemplate('otp', { code });
        await this.transporter.sendMail({
            from: env_1.env.SMTP_SENDER_EMAIL,
            to,
            subject: 'Seu código de verificação Turbofy',
            html,
        });
        logger_1.logger.info({ to }, 'OTP email sent');
    }
}
exports.EmailService = EmailService;

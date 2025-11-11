import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { env } from '../../config/env';
import { logger } from '../logger';

type TemplateName = 'otp';

export class EmailService {
  private transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_AUTH_DISABLED ? undefined : {
      user: env.SMTP_USERNAME,
      pass: env.SMTP_PASSWORD,
    },
  });

  private compileTemplate(template: TemplateName, variables: Record<string, unknown>): string {
    const file = path.join(__dirname, 'templates', `${template}.hbs`);
    const source = fs.readFileSync(file, 'utf-8');
    const tpl = handlebars.compile(source);
    return tpl(variables);
  }

  async sendOtpEmail(to: string, code: string): Promise<void> {
    if (env.SMTP_AUTH_DISABLED) {
      logger.warn({ to }, 'SMTP disabled; skipping email send');
      return;
    }
    const html = this.compileTemplate('otp', { code });
    await this.transporter.sendMail({
      from: env.SMTP_SENDER_EMAIL,
      to,
      subject: 'Seu código de verificação Turbofy',
      html,
    });
    logger.info({ to }, 'OTP email sent');
  }
}
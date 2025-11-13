import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { env } from '../../config/env';
import { logger } from '../logger';

type TemplateName = 'otp' | 'password-reset';

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

  async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
    if (env.SMTP_AUTH_DISABLED) {
      logger.warn({ to }, 'SMTP disabled; skipping password reset email');
      return;
    }
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = this.compileTemplate('password-reset', { resetUrl });
    await this.transporter.sendMail({
      from: env.SMTP_SENDER_EMAIL,
      to,
      subject: 'Redefinição de senha - Turbofy',
      html,
    });
    logger.info({ to }, 'Password reset email sent');
  }

  async sendGenericEmail(to: string, subject: string, html: string): Promise<void> {
    if (env.SMTP_AUTH_DISABLED) {
      logger.warn({ to }, 'SMTP disabled; skipping generic email');
      return;
    }
    await this.transporter.sendMail({
      from: env.SMTP_SENDER_EMAIL,
      to,
      subject,
      html,
    });
    logger.info({ to }, 'Generic email sent');
  }
}

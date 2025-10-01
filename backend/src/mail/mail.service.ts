import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const emailUser = this.configService.get<string>('MAIL_USER');
    const emailPass = this.configService.get<string>('MAIL_PASSWORD');

    if (!emailUser || !emailPass) {
      this.logger.error('Missing email credentials in environment variables!');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  async sendMail(
    to: string | string[],
    subject: string,
    html: string,
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.configService.get<string>('MAIL_DEFAULT_EMAIL'),
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);

      this.logger.log(
        `Email sent to ${Array.isArray(to) ? to.join(', ') : to}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${Array.isArray(to) ? to.join(', ') : to}`,
        error.stack,
      );
      return false;
    }
  }
}

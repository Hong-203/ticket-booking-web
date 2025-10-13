import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendMail(to: string, subject: string, html: string): Promise<boolean> {
    const apiKey = this.configService.get('BREVO_API_KEY');
    const apiUrl = this.configService.get('BREVO_API_URL');
    const senderEmail = this.configService.get('BREVO_SENDER_EMAIL');
    const senderName = this.configService.get('BREVO_SENDER_NAME');

    this.logger.debug('📨 BREVO CONFIG:', {
      apiUrl,
      senderEmail,
      senderName,
      apiKey: apiKey ? apiKey.slice(0, 15) + '...' : '❌ Not found',
    });

    try {
      const response = await axios.post(
        apiUrl,
        {
          sender: { email: senderEmail, name: senderName },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        },
        {
          headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(`✅ Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(
        `❌ Failed to send email to ${to}: ${JSON.stringify(error.response?.data || error.message)}`,
      );

      return false;
    }
  }
}

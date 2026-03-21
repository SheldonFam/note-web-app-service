import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(
      this.configService.get<string>('RESEND_API_KEY', ''),
    );
    this.from = this.configService.get<string>(
      'MAIL_FROM',
      'noreply@notes.local',
    );
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:5173',
    );
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn(`RESEND_API_KEY not set. Reset URL: ${resetUrl}`);
      return;
    }

    await this.resend.emails.send({
      from: this.from,
      to: email,
      subject: 'Reset your password',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      `,
    });

    this.logger.log(`Password reset email sent to ${email}`);
  }
}

import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendActivationMail(to: string, link: string) {
    const html = `
      <div>
        <h1>Follow the link below and Activate your account</h1>
        <a href="${link}">${link}</a>
      </div>
    `;

    await this.mailerService.sendMail({
      from: process.env.EMAIL_ID,
      to,
      subject: `${process.env.API_URL} Activation`,
      html,
    });
  }
}

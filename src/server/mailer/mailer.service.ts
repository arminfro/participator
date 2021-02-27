import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { Mailer } from 'nodemailer-react';
import Welcome from './mails/welcome';

@Injectable()
export class MailerService {
  private mailer;

  private templates = {
    welcome: Welcome,
  };

  private config = {
    defaults: {
      from: {
        name: 'Participator',
        address: process.env.EMAIL_SENDER,
      },
    },
    transport: {
      host: process.env.EMAIL_HOST,
      secure: true,
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASS,
      },
    },
  };

  constructor(@Inject(Logger) private readonly logger: LoggerService) {
    // todo, print to console if env variables not set
    this.mailer = Mailer(this.config, this.templates);
  }

  sendWelcome(props: { name: string; email: string }) {
    this.send('welcome', props.email, props);
  }

  private send(template: string, to: string, props: any) {
    this.logger.log(
      `E-Mail Template, ${template}, with props ${props}`,
      'MailerService',
    );
    const smtpSupport = [
      'EMAIL_HOST',
      'EMAIL_PASS',
      'EMAIL_SENDER',
    ].every((value) => isNotEmpty(value));
    if (smtpSupport) {
      this.mailer.send(template, props, { to });
    } else {
      this.logger.log(
        `E-Mail Template, ${template}, with props ${props}`,
        'MailerService',
      );
    }
  }
}

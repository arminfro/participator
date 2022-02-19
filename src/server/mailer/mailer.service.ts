import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { Mailer } from 'nodemailer-react';
import PasswordReset from './mails/password-reset';
import Welcome from './mails/welcome';

@Injectable()
export class MailerService {
  private mailer;

  constructor(@Inject(Logger) private readonly logger: LoggerService) {
    this.mailer = Mailer(this.config, this.templates);
  }

  private templates = {
    welcome: Welcome,
    resetPassword: PasswordReset,
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

  sendWelcome(props: { name: string; email: string }) {
    this.send('welcome', props.email, props);
  }

  resetPassword(props: { url: string; email: string }) {
    this.send('resetPassword', props.email, props);
  }

  private send(template: string, to: string, props: any) {
    const smtpSupport = ['EMAIL_HOST', 'EMAIL_PASS', 'EMAIL_SENDER'].every(
      (value) => isNotEmpty(process.env[value]),
    );
    if (smtpSupport) {
      this.mailer.send(template, props, { to });
    } else {
      this.logger.log(
        `E-Mail Template, ${template} isn't called with props ${JSON.stringify(
          props,
        )}`,
        'MailerService',
      );
    }
  }
}

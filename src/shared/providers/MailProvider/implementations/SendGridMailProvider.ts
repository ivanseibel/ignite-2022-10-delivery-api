import fs from 'fs';
import handlebars from 'handlebars';

import sgMail from '@sendgrid/mail';

import { IMailProvider } from '../IMailProvider';

class SendGridMailProvider implements IMailProvider {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendMail(
    to: string,
    subject: string,
    variables: object,
    template: string
  ): Promise<void> {
    const templateFileContent = fs.readFileSync(template).toString('utf-8');

    const templateParse = handlebars.compile(templateFileContent);

    const templateHTML = templateParse(variables);

    const msg = {
      to,
      from: 'abramente@abramente.com',
      subject,
      html: templateHTML,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

export { SendGridMailProvider };

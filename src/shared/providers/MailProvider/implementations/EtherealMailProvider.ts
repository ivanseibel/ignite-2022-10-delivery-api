import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';
import { injectable } from 'tsyringe';

import { IMailProvider } from '../IMailProvider';

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    nodemailer
      .createTestAccount()
      .then((account) => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        this.client = transporter;
      })
      .catch((error) => {
        console.log(
          '🚀 ~ file: EtherealMailProvider.ts ~ line 25 ~ EtherealMailProvider ~ constructor ~ error',
          error
        );
      });
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

    const message = await this.client.sendMail({
      to,
      from: 'Rent X <noreply@email.com>',
      subject,
      html: templateHTML,
    });

    console.log(
      '🚀 ~ file: EtherealMailProvider.ts ~ line 40 ~ EtherealMailProvider ~ sendMail ~ message',
      message
    );

    console.log(
      '🚀 ~ file: EtherealMailProvider.ts ~ line 45 ~ EtherealMailProvider ~ sendMail ~ nodemailer.getTestMessageUrl(message)',
      nodemailer.getTestMessageUrl(message)
    );
  }
}

export { EtherealMailProvider };

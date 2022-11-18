import { IMailProvider } from '../IMailProvider';

class MailProviderInMemory implements IMailProvider {
  message: any[] = [];

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    template: string
  ): Promise<void> {
    this.message.push({
      to,
      subject,
      variables,
    });
  }
}

export { MailProviderInMemory };

interface IMailProvider {
  sendMail(
    to: string,
    subject: string,
    variables: any,
    template: string
  ): Promise<void>;
}

export { IMailProvider };

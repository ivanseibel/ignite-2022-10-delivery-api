import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import AppError from '@shared/errors/AppError';
import { IDateProvider } from '@shared/providers/DateProvider/IDateProvider';
import { DateFnsDateProvider } from '@shared/providers/DateProvider/implementations/DateFnsDateProvider';
import { IMailProvider } from '@shared/providers/MailProvider/IMailProvider';
import { MailProviderInMemory } from '@shared/providers/MailProvider/in-memory/MailProviderInMemory';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { SendForgottenPasswordMailUseCase } from './SendForgottenPasswordMailUseCase';

let sendForgottenPasswordMailUseCase: SendForgottenPasswordMailUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;
let usersTokensRepository: IUsersTokensRepository;
let dateProvider: IDateProvider;
let mailProvider: IMailProvider;

describe('Send Forgotten Password Mail', () => {
  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    usersTokensRepository = new UsersTokensRepositoryInMemory();
    dateProvider = new DateFnsDateProvider();
    mailProvider = new MailProviderInMemory();
    sendForgottenPasswordMailUseCase = new SendForgottenPasswordMailUseCase(
      usersRepository,
      usersTokensRepository,
      dateProvider,
      mailProvider
    );
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able to send a forgotten password mail to user', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    const user = await createUserUseCase.execute({
      name: 'Hettie Crawford',
      email: 'vacijsas@uh.sc',
      password: '123',
      driver_license: 'vAfc1t',
    });

    await sendForgottenPasswordMailUseCase.execute(user.email);

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send an email if user does not exists', async () => {
    expect.assertions(2);

    try {
      await sendForgottenPasswordMailUseCase.execute('invalid-email');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toEqual('User does not exist');
    }
  });

  it('should be able to create an users token', async () => {
    const generateTokenMail = jest.spyOn(usersTokensRepository, 'create');

    const user = await createUserUseCase.execute({
      name: 'Hettie Crawford',
      email: 'kek@ko.ac',
      password: '123',
      driver_license: '082386',
    });

    await sendForgottenPasswordMailUseCase.execute(user.email);

    expect(generateTokenMail).toBeCalled();
  });
});

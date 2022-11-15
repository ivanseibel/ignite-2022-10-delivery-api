import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import AppError from '@shared/errors/AppError';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      driver_license: '000123',
      email: 'johndoe@email.com',
      password: '1234',
      name: 'John Doe',
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty('token');
  });

  it('should not be able to authenticate a nonexistent user', async () => {
    expect.assertions(2);

    try {
      await authenticateUserUseCase.execute({
        email: 'johndoe@email.com',
        password: '1234',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toEqual('Email or password incorrect');
    }
  });

  it('should not be able to authenticate with incorrect password', async () => {
    expect.assertions(2);

    try {
      const user: ICreateUserDTO = {
        driver_license: '9999',
        email: 'johndoe@email.com',
        password: '1234',
        name: 'John Doe',
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'incorrectPassword',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toEqual('Email or password incorrect');
    }
  });
});

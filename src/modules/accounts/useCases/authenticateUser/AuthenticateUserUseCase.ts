import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import AppError from '@shared/errors/AppError';
import { IDateProvider } from '@shared/providers/DateProvider/IDateProvider';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email or password incorrect', 401);
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError('Email or password incorrect', 401);
    }

    const token = sign({}, auth.token.secret, {
      subject: user.id,
      expiresIn: auth.token.expiresIn,
    });

    const refresh_token = sign({ email }, auth.refreshToken.secret, {
      subject: user.id,
      expiresIn: auth.refreshToken.expiresIn,
    });

    await this.usersTokensRepository.create({
      user_id: user.id,
      expires_date: this.dateProvider.addDays(auth.refreshToken.expiresInDays),
      refresh_token,
    });

    return {
      user: {
        email: user.email,
        name: user.name,
      },
      token,
      refresh_token,
    };
  }
}

export { AuthenticateUserUseCase };

import { verify, sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/providers/DateProvider/IDateProvider';

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute(refresh_token: string): Promise<ITokenResponse> {
    const { email, sub: user_id } = verify(
      refresh_token,
      auth.refreshToken.secret
    ) as IPayload;

    const userToken =
      await this.usersTokensRepository.findByUserIdAndRefreshToken(
        user_id,
        refresh_token
      );

    if (!userToken) {
      throw new Error('Refresh token does not exists');
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const newRefreshToken = sign({ email }, auth.refreshToken.secret, {
      subject: user_id,
      expiresIn: auth.refreshToken.expiresIn,
    });

    await this.usersTokensRepository.create({
      user_id,
      refresh_token: newRefreshToken,
      expires_date: this.dateProvider.addDays(auth.refreshToken.expiresInDays),
    });

    const newToken = sign({}, auth.token.secret, {
      subject: user_id,
      expiresIn: auth.token.expiresIn,
    });

    return { token: newToken, refresh_token: newRefreshToken };
  }
}

export { RefreshTokenUseCase };

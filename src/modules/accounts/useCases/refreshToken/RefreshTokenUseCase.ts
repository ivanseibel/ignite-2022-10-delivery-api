import { verify, sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

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
      process.env.REFRESH_TOKEN_SECRET
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

    const newRefreshToken = sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
      subject: user_id,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });

    await this.usersTokensRepository.create({
      user_id,
      refresh_token: newRefreshToken,
      expires_date: this.dateProvider.addDays(
        Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS)
      ),
    });

    const newToken = sign({}, process.env.TOKEN_SECRET, {
      subject: user_id,
      expiresIn: process.env.TOKEN_EXPIRES_IN,
    });

    return { token: newToken, refresh_token: newRefreshToken };
  }
}

export { RefreshTokenUseCase };

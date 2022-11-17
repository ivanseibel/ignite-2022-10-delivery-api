import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SendForgottenPasswordMailUseCase } from './SendForgottenPasswordMailUseCase';

class SendForgottenPasswordMailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgottenPasswordEmailUseCase = container.resolve(
      SendForgottenPasswordMailUseCase
    );

    await sendForgottenPasswordEmailUseCase.execute(email);

    return response.status(204).send();
  }
}

export { SendForgottenPasswordMailController };

import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateSpecificationUseCase } from './CreateSpecificationUseCase';

class CreateSpecificationController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { name, description } = request.body;

      const createCategoryUseCase = container.resolve(
        CreateSpecificationUseCase
      );
      await createCategoryUseCase.execute({ name, description });

      return response.status(201).send();
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }

      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export { CreateSpecificationController };

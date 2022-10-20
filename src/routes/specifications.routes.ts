import { Router } from 'express';

import { SpecificationsRepository } from '../modules/cars/repositories/SpecificationsRepository';
import { CreateSpecificationService } from '../modules/cars/services/CreateSpecificationService';

const specificationsRoutes = Router();

const specificationsRepository = new SpecificationsRepository();

specificationsRoutes.post('/', (request, response) => {
  try {
    const { name, description } = request.body;

    const createSpecificationService = new CreateSpecificationService(
      specificationsRepository
    );

    createSpecificationService.execute({ name, description });

    return response.json({ message: 'Specification created!' });
  } catch (error) {
    return response.json({ error: error.message }).status(400);
  }
});

specificationsRoutes.get('/', (request, response) => {
  const all = specificationsRepository.list();

  return response.json(all);
});

export { specificationsRoutes };

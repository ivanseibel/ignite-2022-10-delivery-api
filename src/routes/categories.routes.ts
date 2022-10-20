import { Router } from 'express';

import { CategoriesRepository } from '../modules/cars/repositories/CategoriesRepository';
import { CreateCategoryService } from '../modules/cars/services/CreateCategoryService';

const categoriesRoutes = Router();

const categoriesRepository = new CategoriesRepository();

categoriesRoutes.post('/', (request, response) => {
  try {
    const { name, description } = request.body;

    const createCategoryService = new CreateCategoryService(
      categoriesRepository
    );

    createCategoryService.execute({ name, description });

    return response.json({ message: 'Category created!' });
  } catch (error) {
    return response.json({ error: error.message }).status(400);
  }
});

categoriesRoutes.get('/', (request, response) => {
  const all = categoriesRepository.list();

  return response.json(all);
});

export { categoriesRoutes };

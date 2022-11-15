import { CategoriesRepositoryInMemory } from '@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory';
import AppError from '@shared/errors/AppError';

import { CreateCategoryUseCase } from './CreateCategoryUseCase';

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe('Create a new category', () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory
    );
  });

  it('should be able to create a new category', async () => {
    const newCategory = {
      name: 'Category Test',
      description: 'Category description Test',
    };

    const category = await createCategoryUseCase.execute(newCategory);

    expect(category).toHaveProperty('id');
    expect(category.name).toEqual('Category Test');
  });

  it('should not be able to create a new category if the name already exists', async () => {
    expect.assertions(2);

    try {
      const newCategory = {
        name: 'Category Test',
        description: 'Category description Test',
      };

      await createCategoryUseCase.execute(newCategory);

      await createCategoryUseCase.execute(newCategory);
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toEqual('Category already exists');
    }
  });
});

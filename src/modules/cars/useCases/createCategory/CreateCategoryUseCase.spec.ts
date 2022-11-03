import AppError from '@errors/AppError';
import { CategoriesRepositoryInMemory } from '@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory';

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

    await createCategoryUseCase.execute(newCategory);

    const category = await categoriesRepositoryInMemory.findByName(
      'Category Test'
    );

    expect(category).toHaveProperty('id');
    expect(category.name).toEqual('Category Test');
  });

  it('should not be able to create a new category if the name already exists', async () => {
    expect(async () => {
      const newCategory = {
        name: 'Category Test',
        description: 'Category description Test',
      };

      await createCategoryUseCase.execute(newCategory);

      await createCategoryUseCase.execute(newCategory);
    }).rejects.toBeInstanceOf(AppError);
  });
});

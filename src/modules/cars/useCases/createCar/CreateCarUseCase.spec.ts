import 'dotenv/config';
import AppError from '@shared/errors/AppError';

import { CarsRepositoryInMemory } from '../../repositories/in-memory/CarsRepositoryInMemory';
import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Create a new car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('should be able to create a new car', async () => {
    const car = await createCarUseCase.execute({
      name: 'Car Test 1',
      description: 'Car description Test',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Car brand Test',
      category_id: 'category_id',
    });

    expect(car).toHaveProperty('id');
  });

  it('should not be able to create a new car with an existing license plate', async () => {
    expect.assertions(2);

    try {
      await createCarUseCase.execute({
        name: 'Car Test 2',
        description: 'Car description Test',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
        brand: 'Car brand Test',
        category_id: 'category_id',
      });

      await createCarUseCase.execute({
        name: 'Car Test 2',
        description: 'Car description Test',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
        brand: 'Car brand Test',
        category_id: 'category_id',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toEqual('Car already exists');
    }
  });

  it('should be able to create a new car with available true by default', async () => {
    const car = await createCarUseCase.execute({
      name: 'Car Test 3',
      description: 'Car description Test',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Car brand Test',
      category_id: 'category_id',
    });

    expect(car.available).toBe(true);
  });
});

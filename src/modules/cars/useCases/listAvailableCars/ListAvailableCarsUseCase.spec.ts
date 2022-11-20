import 'dotenv/config';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { CreateCarUseCase } from '../createCar/CreateCarUseCase';
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let createCarUseCase: CreateCarUseCase;

describe('List all cars', () => {
  beforeAll(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('should be able to list all available cars', async () => {
    const car = await createCarUseCase.execute({
      name: 'Car 1',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Car_brand',
      category_id: 'category',
      available: true,
    });

    await createCarUseCase.execute({
      name: 'Car 1',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'ABC-1235',
      fine_amount: 60,
      brand: 'Car_brand',
      category_id: 'category',
      available: false,
    });

    const cars = await listAvailableCarsUseCase.execute();

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by category', async () => {
    const car = await createCarUseCase.execute({
      name: 'Car 2',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'ABC-1236',
      fine_amount: 60,
      brand: 'Car_brand',
      category_id: '12345',
      available: true,
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: '12345',
    });

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by brand', async () => {
    const car = await createCarUseCase.execute({
      name: 'Car 3',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'ABC-1237',
      fine_amount: 60,
      brand: 'Car_brand_test',
      category_id: 'category',
      available: true,
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: 'Car_brand_test',
    });

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by name', async () => {
    const car = await createCarUseCase.execute({
      name: 'Car 4',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'ABC-1238',
      fine_amount: 60,
      brand: 'Car_brand',
      category_id: 'category',
      available: true,
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: 'Car 4',
    });

    expect(cars).toEqual([car]);
  });
});

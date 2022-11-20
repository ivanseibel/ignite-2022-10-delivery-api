import 'dotenv/config';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import AppError from '@shared/errors/AppError';

import { CreateCarUseCase } from '../createCar/CreateCarUseCase';
import { CreateSpecificationUseCase } from '../createSpecification/CreateSpecificationUseCase';
import { CreateCarSpecificationUseCase } from './createCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let createSpecificationUseCase: CreateSpecificationUseCase;
let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe('Create Car Specification', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    createSpecificationUseCase = new CreateSpecificationUseCase(
      specificationsRepositoryInMemory
    );
  });

  it('it should be able to add new specifications to a car', async () => {
    await createSpecificationUseCase.execute({
      name: 'test',
      description: 'test',
    });

    await createSpecificationUseCase.execute({
      name: 'test2',
      description: 'test2',
    });

    const specifications = await specificationsRepositoryInMemory.list();

    let car = await createCarUseCase.execute({
      name: 'Car 1',
      description: 'Car description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Car brand',
      category_id: 'category',
    });

    const specifications_id = specifications.map((specification) => {
      return specification.id;
    });

    await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });

    car = await carsRepositoryInMemory.findByLicensePlate('ABC-1234');

    expect(car.specifications.length).toBe(2);
  });

  it('should not be able to add a new specification to a now-existent car', async () => {
    expect.assertions(2);

    try {
      const car_id = '1234';
      const specifications_id = ['54321'];

      await createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toEqual('Car does not exists');
    }
  });
});

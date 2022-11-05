import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { CreateCarUseCase } from '../createCar/CreateCarUseCase';
import { FindCarByLicensePlateUseCase } from './FindCarByLicensePlateUseCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let createCarUseCase: CreateCarUseCase;
let findCarByLicensePlateUseCase: FindCarByLicensePlateUseCase;

describe('Find car by license plate', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    findCarByLicensePlateUseCase = new FindCarByLicensePlateUseCase(
      carsRepositoryInMemory
    );
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('should be able to find a car by license plate', async () => {
    await createCarUseCase.execute({
      name: 'Car Test',
      description: 'Car description Test',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 60,
      brand: 'Car brand Test',
      category_id: 'category_id',
    });

    const car = await findCarByLicensePlateUseCase.execute('ABC-1234');

    expect(car).toHaveProperty('id');
  });
});

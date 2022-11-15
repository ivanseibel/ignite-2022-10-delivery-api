import { add } from 'date-fns';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { CreateCarUseCase } from '@modules/cars/useCases/createCar/CreateCarUseCase';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import AppError from '@shared/errors/AppError';
import { DateFnsDateProvider } from '@shared/providers/DateProvider/implementations/DateFnsDateProvider';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let expectedReturnDate: Date;
let dateFnsDateProvider: DateFnsDateProvider;
let carsRepository: CarsRepositoryInMemory;
let createCarUseCase: CreateCarUseCase;

let car1;
let car2: Car;

describe('Create Rental', () => {
  beforeEach(async () => {
    dateFnsDateProvider = new DateFnsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepository = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dateFnsDateProvider,
      carsRepository
    );
    createCarUseCase = new CreateCarUseCase(carsRepository);

    expectedReturnDate = add(new Date(), {
      hours: 25,
    });

    car1 = await createCarUseCase.execute({
      name: 'Car Name 1',
      description: 'Car 1 Description',
      daily_rate: 100,
      license_plate: 'ABC-1234',
      fine_amount: 100,
      brand: 'Car 1 Brand',
      category_id: 'Car 1 category',
    });

    car2 = await createCarUseCase.execute({
      name: 'Car Name 2',
      description: 'Car 2 Description',
      daily_rate: 200,
      license_plate: 'ABC-1235',
      fine_amount: 200,
      brand: 'Car 2 Brand',
      category_id: 'Car 2 category',
    });
  });

  it('should be able to create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: car1.id,
      expected_return_date: expectedReturnDate,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if there is another open to the same user', async () => {
    expect.assertions(2);
    try {
      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: car1.id,
        expected_return_date: expectedReturnDate,
      });

      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: car2.id,
        expected_return_date: expectedReturnDate,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toEqual('There is a rental in progress for user');
    }
  });

  it('should not be able to create a new rental if there is another open to the same car', async () => {
    expect.assertions(2);

    try {
      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: car1.id,
        expected_return_date: expectedReturnDate,
      });

      await createRentalUseCase.execute({
        user_id: '123456',
        car_id: car1.id,
        expected_return_date: expectedReturnDate,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toEqual('Car is unavailable');
    }
  });

  it('should not be able to create a new rental with invalid return time', async () => {
    expect.assertions(2);

    try {
      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: 'test',
        expected_return_date: add(new Date(), {
          hours: 23,
        }),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toEqual('Invalid return time');
    }
  });
});

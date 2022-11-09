import { add } from 'date-fns';

import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import AppError from '@shared/errors/AppError';
import { DateFnsDateProvider } from '@shared/providers/DateProvider/implementations/DateFnsDateProvider';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let expectedReturnDate: Date;
let dateFnsDateProvider: DateFnsDateProvider;

describe('Create Rental', () => {
  beforeEach(() => {
    dateFnsDateProvider = new DateFnsDateProvider();
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dateFnsDateProvider
    );
    expectedReturnDate = add(new Date(), {
      hours: 25,
    });
  });

  it('should be able to create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: '121212',
      expected_return_date: expectedReturnDate,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if there is another open to the same user', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: '121212',
        expected_return_date: expectedReturnDate,
      });

      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: '121212',
        expected_return_date: expectedReturnDate,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if there is another open to the same car', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: 'test',
        expected_return_date: expectedReturnDate,
      });

      await createRentalUseCase.execute({
        user_id: '123456',
        car_id: 'test',
        expected_return_date: expectedReturnDate,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental with invalid return time', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: 'test',
        expected_return_date: add(new Date(), {
          hours: 23,
        }),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});

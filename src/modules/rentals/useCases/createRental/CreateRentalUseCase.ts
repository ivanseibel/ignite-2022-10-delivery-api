import { injectable, inject } from 'tsyringe';

import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import AppError from '@shared/errors/AppError';
import { IDateProvider } from '@shared/providers/DateProvider/IDateProvider';

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

const MINIMUM_HOURS = 24;

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('DateFnsDateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({
    user_id,
    car_id,
    expected_return_date,
  }: IRequest): Promise<Rental> {
    const openRentalByCar = await this.rentalsRepository.findOpenRentalByCar(
      car_id
    );

    if (openRentalByCar) {
      throw new AppError('Car is unavailable');
    }

    const openRentalByUser = await this.rentalsRepository.findOpenRentalByUser(
      user_id
    );

    if (openRentalByUser) {
      throw new AppError('There is a rental in progress for user!');
    }

    const dateNow = this.dateProvider.dateNow();
    const compare = this.dateProvider.diffInHours(
      new Date(),
      expected_return_date
    );

    if (compare < MINIMUM_HOURS) {
      throw new AppError('Invalid return time!');
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    return rental;
  }
}

export { CreateRentalUseCase };

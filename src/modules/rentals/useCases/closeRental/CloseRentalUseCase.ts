import { injectable, inject } from 'tsyringe';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import AppError from '@shared/errors/AppError';
import { IDateProvider } from '@shared/providers/DateProvider/IDateProvider';

interface IRequest {
  id: string;
}

@injectable()
class CloseRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}

  async execute({ id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id);

    if (!rental) {
      throw new AppError('Rental does not exists');
    }

    if (rental.end_date) {
      throw new AppError('Rental is already closed');
    }

    const diffInHoursExpected = this.dateProvider.diffInHours(
      rental.start_date,
      this.dateProvider.dateNow() < rental.expected_return_date
        ? this.dateProvider.dateNow()
        : rental.expected_return_date
    );

    const car = await this.carsRepository.findById(rental.car_id);

    let amount = (car.daily_rate / 24) * diffInHoursExpected;

    const diffInHoursExceeded = this.dateProvider.diffInHours(
      rental.expected_return_date,
      this.dateProvider.dateNow()
    );

    if (diffInHoursExceeded > 0) {
      amount += Math.ceil(diffInHoursExceeded / 24) * car.fine_amount;
    }

    rental.end_date = this.dateProvider.dateNow();
    rental.total = amount;

    const closedRental = await this.rentalsRepository.update(rental);

    await this.carsRepository.toggleCarAvailability(car.id, true);

    return closedRental;
  }
}

export { CloseRentalUseCase };

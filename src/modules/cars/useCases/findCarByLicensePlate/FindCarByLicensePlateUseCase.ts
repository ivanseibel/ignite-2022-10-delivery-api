import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

class FindCarByLicensePlateUseCase {
  constructor(private carsRepository: ICarsRepository) {}

  async execute(license_plate: string): Promise<Car> {
    return this.carsRepository.findByLicensePlate(license_plate);
  }
}

export { FindCarByLicensePlateUseCase };

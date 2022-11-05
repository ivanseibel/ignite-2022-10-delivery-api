import { inject, injectable } from 'tsyringe';
import { v4 as uuidV4 } from 'uuid';

import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  name: string;
  description: string;
  daily_rate: number;
  license_plate: string;
  fine_amount: number;
  brand: string;
  category_id: string;
}

@injectable()
class CreateCarUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}

  async execute({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
  }: IRequest): Promise<void> {
    const carAlreadyExists = await this.carsRepository.findByLicensePlate(
      license_plate
    );

    if (carAlreadyExists) {
      throw new AppError('Car already exists!');
    }

    await this.carsRepository.create({
      id: uuidV4() as string,
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      available: true,
      category_id,
      created_at: new Date(),
    });
  }
}

export { CreateCarUseCase };

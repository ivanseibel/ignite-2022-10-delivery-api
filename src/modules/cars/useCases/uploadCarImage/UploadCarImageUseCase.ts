import { inject, injectable } from 'tsyringe';

import { CarImage } from '@modules/cars/infra/typeorm/entities/CarImage';
import { ICarImagesRepository } from '@modules/cars/repositories/ICarImagesRepository';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

interface IRequest {
  car_id: string;
  images_name: string[];
}

@injectable()
class UploadCarImageUseCase {
  constructor(
    @inject('CarImagesRepository')
    private carImagesRepository: ICarImagesRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}

  async execute({ car_id, images_name }: IRequest): Promise<CarImage[]> {
    const carImages = images_name.map((image_name) =>
      this.carImagesRepository.create(car_id, image_name)
    );

    return Promise.all(carImages);
  }
}

export { UploadCarImageUseCase };

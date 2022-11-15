import { getRepository, Repository } from 'typeorm';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { IListAvailableCarsDTO } from '@modules/cars/dtos/IListAvailableCarsDTO';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

import { Car } from '../entities/Car';

class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async toggleCarAvailability(id: string, new_status: boolean): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update()
      .set({ available: new_status })
      .where('id = :id')
      .setParameters({ id })
      .execute();
  }

  async findById(id: string): Promise<Car> {
    return this.repository.findOne(id);
  }

  async update(car: Car): Promise<Car> {
    return this.repository.save(car);
  }

  async listAvailable(filters?: IListAvailableCarsDTO): Promise<Car[]> {
    const carsQuery = this.repository
      .createQueryBuilder('c')
      .where('available = :available', { available: true });

    if (filters.brand) {
      carsQuery.andWhere('c.brand = :brand', { brand: filters.brand });
    }

    if (filters.category_id) {
      carsQuery.andWhere('c.category_id = :category_id', {
        category_id: filters.category_id,
      });
    }

    if (filters.name) {
      carsQuery.andWhere('c.name = :name', { name: filters.name });
    }

    const cars = await carsQuery.getMany();

    return cars;
  }

  async create(data: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create(data);

    return this.repository.save(car);
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.repository.findOne({ license_plate });
  }
}

export { CarsRepository };

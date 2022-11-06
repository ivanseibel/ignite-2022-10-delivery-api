import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { IListAvailableCarsDTO } from '@modules/cars/dtos/IListAvailableCarsDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICarsRepository } from '../ICarsRepository';

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async update(car: Car): Promise<void> {
    const findIndex = this.cars.findIndex((findCar) => findCar.id === car.id);

    this.cars[findIndex] = car;
  }

  async findById(id: string): Promise<Car> {
    return this.cars.find((car) => car.id === id);
  }

  async listAvailable(filters: IListAvailableCarsDTO): Promise<Car[]> {
    const { category_id, brand, name } = filters || {
      category_id: null,
      brand: null,
      name: null,
    };

    let cars = this.cars.filter((car) => car.available);

    if (category_id)
      cars = cars.filter((car) => car.category_id === category_id);

    if (brand) cars = cars.filter((car) => car.brand === brand);

    if (name) cars = cars.filter((car) => car.name === name);

    return cars;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find((car) => car.license_plate === license_plate);
  }

  async create(data: ICreateCarDTO): Promise<void> {
    const car = new Car();

    Object.assign(car, data);

    this.cars.push(car);
  }
}

export { CarsRepositoryInMemory };

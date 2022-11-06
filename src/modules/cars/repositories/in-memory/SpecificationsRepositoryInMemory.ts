import { ICreateSpecificationDTO } from '@modules/cars/dtos/ICreateSpecificationDTO';
import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';

import { ISpecificationsRepository } from '../ISpecificationsRepository';

class SpecificationsRepositoryInMemory implements ISpecificationsRepository {
  private specifications: Specification[] = [];

  list(): Promise<Specification[]> {
    return Promise.resolve(this.specifications);
  }

  async create({ name, description }: ICreateSpecificationDTO): Promise<void> {
    const specification = new Specification();

    Object.assign(specification, {
      name,
      description,
      created_at: new Date(),
    });

    this.specifications.push(specification);
  }

  async findByName(name: string): Promise<Specification> {
    return this.specifications.find(
      (specification) => specification.name === name
    );
  }

  async findByIds(ids: string[]): Promise<Specification[]> {
    return this.specifications.filter((specification) =>
      ids.includes(specification.id)
    );
  }
}

export { SpecificationsRepositoryInMemory };

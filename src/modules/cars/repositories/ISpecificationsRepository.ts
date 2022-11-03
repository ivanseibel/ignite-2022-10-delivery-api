import { ICreateSpecificationDTO } from '../dtos/ICreateSpecificationDTO';
import { Specification } from '../infra/typeorm/entities/Specification';

interface ISpecificationsRepository {
  findByName(name: string): Promise<Specification>;
  list(): Promise<Specification[]>;
  create({ name, description }: ICreateSpecificationDTO): Promise<void>;
}

export { ISpecificationsRepository };

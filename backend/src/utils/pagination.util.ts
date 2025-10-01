import {
  Repository,
  FindOptionsWhere,
  ObjectLiteral,
  FindManyOptions,
} from 'typeorm';
import { PaginationResult } from 'src/interface/pagination-result.interface';

export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  filters: FindOptionsWhere<T>,
  page: number = 1,
  limit: number = 10,
  options: Omit<FindManyOptions<T>, 'where' | 'skip' | 'take'> = {},
): Promise<PaginationResult<T>> {
  const skip = (page - 1) * limit;

  const total = await repository.count({ where: filters });

  const data = await repository.find({
    where: filters,
    skip,
    take: limit,
    ...options, // thêm phần này để truyền relations, order,...
  });

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
}

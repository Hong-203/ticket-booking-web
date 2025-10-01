import { PaginationResult } from 'src/interface/pagination-result.interface';
import { Seat } from 'src/seat/entities/seat.entity';
import { SelectQueryBuilder } from 'typeorm';

export async function customPaginateSeats(
  qb: SelectQueryBuilder<Seat>,
  page: number = 1,
  limit: number = 10,
): Promise<PaginationResult<Seat>> {
  const skip = (page - 1) * limit;

  const [data, total] = await qb
    .orderBy('SUBSTRING(seat.name, 1, 1)', 'ASC')
    .addOrderBy('CAST(SUBSTRING(seat.name, 2) AS UNSIGNED)', 'ASC')
    .skip(skip)
    .take(limit)
    .getManyAndCount();

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
}

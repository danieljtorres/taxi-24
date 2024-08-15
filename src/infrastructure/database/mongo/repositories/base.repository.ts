import { IBaseRepository } from '@Application/repositories/base.repository';
import { PaginationDTO } from '@Domain/dtos/common.dto';
import { SortEnum } from '@Domain/entities/common.entity';
import { getMongoSkip } from '@Utils/paginate';
import { Model, PipelineStage } from 'mongoose';

export abstract class BaseMongooseRepository<T, V>
  implements IBaseRepository<V>
{
  protected readonly model: Model<T>;

  protected constructor(model: Model<T>) {
    this.model = model;
  }

  async count(query: Record<string, any> = {}): Promise<number> {
    return await this.model.countDocuments(query);
  }

  async findAll(pagination: PaginationDTO, totalPages: number): Promise<V[]> {
    const { page, limit, sort } = pagination;

    const skip = getMongoSkip(page, limit, totalPages);

    const aggregation: PipelineStage[] = [
      { $sort: { name: sort == SortEnum.DESC ? -1 : 1 } },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    return await this.model.aggregate(aggregation);
  }
}

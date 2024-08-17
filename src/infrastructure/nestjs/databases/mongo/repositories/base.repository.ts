import { IBaseRepository } from '@Application/repositories/base.repository';
import { Pagination, SortEnum } from '@Domain/entities/common.entity';
import { getMongoSkip } from '@Utils/pagination';
import { Model, PipelineStage } from 'mongoose';

export abstract class BaseMongooseRepository<T> implements IBaseRepository<T> {
  protected readonly model: Model<T>;

  protected constructor(model: Model<T>) {
    this.model = model;
  }

  async count(query: Record<string, any> = {}): Promise<number> {
    return this.model.countDocuments(query);
  }

  async findById(id: string): Promise<T> {
    return this.model.findById(id);
  }

  async findAll(pagination: Pagination, totalPages: number): Promise<T[]> {
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

    return (await this.model.aggregate(aggregation)).map((doc) =>
      this.model.hydrate(doc),
    );
  }
}

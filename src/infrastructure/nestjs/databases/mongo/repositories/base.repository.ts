import { IBaseRepository } from '@Application/repositories/base.repository';
import { Pagination } from '@Domain/entities/common.entity';
import { getMongoSkip } from '@Utils/pagination';
import { Model } from 'mongoose';

export abstract class BaseMongooseRepository<T> implements IBaseRepository<T> {
  protected readonly model: Model<T>;

  protected constructor(model: Model<T>) {
    this.model = model;
  }

  async count(query: Record<string, any> = {}): Promise<number> {
    return this.model.countDocuments(query);
  }

  async findById(id: string): Promise<T> {
    return (await this.model.findById(id)).toJSON();
  }

  async findAll(
    query: Record<string, any>,
    pagination: Pagination,
    totalPages: number,
  ): Promise<T[]> {
    const { page, limit, sort } = pagination;

    const skip = getMongoSkip(page, limit, totalPages);

    return this.model
      .find(query, {}, { skip, limit })
      .sort(sort.toLowerCase())
      .lean();
  }
}

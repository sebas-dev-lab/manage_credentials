import {
  Repository,
  DeleteResult,
  UpdateResult,
  FindManyOptions,
  ObjectId,
  FindOptionsWhere,
  DeepPartial,
} from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import Logger from 'src/infrastructure/configurations/logs/winston.logs';

@Injectable()
export class BaseRepository<T> {
  public repository: Repository<T>;
  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.repository.find(options);
    } catch (error) {
      throw new ConflictException('');
    }
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    try {
      return await this.repository.count(options);
    } catch (error) {
      throw new ConflictException('');
    }
  }

  async findOne(options?: FindManyOptions<T>): Promise<T> {
    try {
      const entity = await this.repository.findOne(options);
      return entity;
    } catch (error) {
      throw new ConflictException('');
    }
  }

  async create(entity: any): Promise<T> {
    try {
      return await this.repository.save(entity);
    } catch (error) {
      Logger.error(error.stack);
      throw new ConflictException('');
    }
  }

  async createAndExecute(entity: any): Promise<T | undefined> {
    try {
      const createdEntity = this.repository.create(entity as DeepPartial<T>);
      const savedEntity = await this.repository.save(createdEntity);
      return savedEntity;
    } catch (error) {
      Logger.error(error.stack);
      throw new ConflictException('Error creating and executing entity.');
    }
  }

  async update(options: any, entity: any): Promise<UpdateResult> {
    try {
      return await this.repository.update(options, entity);
    } catch (error) {
      Logger.error(error.stack);
      throw new ConflictException('');
    }
  }

  async delete(options: any): Promise<DeleteResult> {
    try {
      return await this.repository.softDelete(options);
    } catch (error) {
      throw new ConflictException('');
    }
  }

  async destroy(
    options:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<any>,
  ): Promise<DeleteResult> {
    try {
      return await this.repository.delete(options);
    } catch (error) {
      throw new ConflictException('');
    }
  }

  async restore(options: any): Promise<UpdateResult> {
    try {
      return await this.repository.restore(options);
    } catch (error) {
      throw new ConflictException('');
    }
  }

  async query<T>(query: string, list?: Array<any>): Promise<any> {
    try {
      if (list) {
        return await this.repository.query(query, list);
      } else {
        return await this.repository.query(query);
      }
    } catch (error) {
      throw new ConflictException('');
    }
  }
}

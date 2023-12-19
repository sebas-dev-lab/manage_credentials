import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseRepository } from './generic.repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { SiteCredentials } from '../domain/creds_manager.entities/site_credentials.entity';
import { AddCredentialDTO } from 'src/modules/manageSiteCredentials/dto/addCredential.dto';
import { findUserBySiteId } from 'src/modules/manageSiteCredentials/sql/searchUserBySiteId.sql';
import { UpdateUsersCredentialsDTO } from 'src/modules/manageSiteCredentials/dto/updateUsersCredentials.dto';

@Injectable()
export class SiteCredentialsRepository extends BaseRepository<SiteCredentials> {
  constructor(
    @InjectRepository(SiteCredentials)
    repository: Repository<SiteCredentials>,
    private readonly _dataSource: DataSource,
  ) {
    super(repository);
  }

  async addCredentialsAndAssociatedWithUsers(
    data: Partial<AddCredentialDTO>,
  ): Promise<void> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const siteCredentials = new SiteCredentials();
      const { auth_users, ...values } = data;
      Object.assign(siteCredentials, values);

      await siteCredentials.hashPassword();

      await queryRunner.manager.save(SiteCredentials, siteCredentials);
      if (auth_users) {
        await Promise.all(
          auth_users.map(async (user_id) => {
            await queryRunner.manager
              .createQueryBuilder()
              .insert()
              .into('users_site_credentials')
              .values({
                authUsersId: user_id,
                siteCredentialsId: siteCredentials.id,
              })
              .execute();
          }),
        );
      }
      await queryRunner.commitTransaction();
    } catch (e: any) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException(e.message);
    } finally {
      await queryRunner.release();
    }
  }

  async getCredentialsWithPaginationAndSearch(
    searchTerm = '',
    currentPage = 1,
    pageSize = 20,
  ) {
    const queryRunner = this._dataSource.createQueryRunner();

    try {
      const siteCredentialsRepository =
        queryRunner.manager.getRepository(SiteCredentials);

      const queryBuilder = siteCredentialsRepository
        .createQueryBuilder('sc')
        .select([
          'sc.id',
          'sc.secret',
          'sc.ivp',
          'sc.site',
          'sc.username',
          'sc.note',
        ])
        .where(
          `
          LOWER(sc.site) LIKE LOWER(:searchTerm)
          OR LOWER(sc.username) LIKE LOWER(:searchTerm)
        `,
          { searchTerm: `%${searchTerm}%` },
        )
        .orderBy('sc.id')
        .skip((currentPage - 1) * pageSize)
        .take(pageSize);

      const [items, totalCount] = await queryBuilder
        .offset((currentPage - 1) * pageSize)
        .limit(pageSize)
        .getManyAndCount();

      const totalItems = items.length;
      const nextPage =
        currentPage * pageSize < totalCount ? currentPage + 1 : null;
      const previousPage = currentPage > 1 ? currentPage - 1 : null;

      return {
        items,
        meta: {
          totalCount,
          totalItems,
          totalPages: Math.ceil(totalCount / pageSize),
          currentPage,
          nextPage,
          previousPage,
        },
      };
    } catch (error) {
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getSiteById(id: number) {
    try {
      const site = await this.findOne({
        where: { id: id },
        select: {
          id: true,
          secret: true,
          ivp: true,
          site: true,
          username: true,
          note: true,
          data_created: true,
          data_modified: true,
        },
      });

      if (!site) {
        throw new NotFoundException('Site not found');
      }

      const users = await this._dataSource.manager.query(findUserBySiteId(id));

      return {
        ...site,
        users,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateUsersIdsFromSite(
    siteId: number,
    users: Partial<UpdateUsersCredentialsDTO>,
  ) {
    try {
      await this.repository.manager.transaction(
        async (transactionManager: EntityManager): Promise<void> => {
          await Promise.all(
            users.delete_users.map(async (userId) => {
              await transactionManager
                .createQueryBuilder()
                .delete()
                .from('users_site_credentials')
                .where('siteCredentialsId = :siteId', { siteId })
                .andWhere('authUsersId = :userId', { userId })
                .execute();
            }),
          );

          await Promise.all(
            users.add_users.map(async (authUsersId) => {
              await transactionManager
                .createQueryBuilder()
                .insert()
                .into('users_site_credentials')
                .values({ siteCredentialsId: siteId, authUsersId })
                .execute();
            }),
          );
        },
      );
    } catch (e) {
      console.log(e);
      throw new ConflictException(e.message);
    }
  }
}

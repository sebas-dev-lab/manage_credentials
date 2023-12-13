import { Injectable } from '@nestjs/common';
import { BaseRepository } from './generic.repositories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRoles } from '../domain/creds_manager.entities/auth_roles.entity';

@Injectable()
export class AuthRoleRepository extends BaseRepository<AuthRoles> {
  constructor(
    @InjectRepository(AuthRoles)
    repository: Repository<AuthRoles>,
  ) {
    super(repository);
  }
}

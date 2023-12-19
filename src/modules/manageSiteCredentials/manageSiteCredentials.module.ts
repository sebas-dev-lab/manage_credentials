import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteCredentialsRepository } from 'src/core/repositories/site_credentials.repository';
import { SiteCredentialsControllers } from './controllers/siteCredentials.controllers';
import { SiteCredentials } from 'src/core/domain/creds_manager.entities/site_credentials.entity';
import { ManageSiteCredentialservices } from './services/manageCredential.service';
@Module({
  imports: [TypeOrmModule.forFeature([SiteCredentials])],
  providers: [SiteCredentialsRepository, ManageSiteCredentialservices],
  controllers: [SiteCredentialsControllers],
  exports: [],
})
export class ManageSiteCredentials {}

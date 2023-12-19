import { ForbiddenException, Injectable } from '@nestjs/common';
import CommonResponse, {
  ResponseService,
} from 'src/common/utils/set_response.utils';
import { AddCredentialDTO } from '../dto/addCredential.dto';
import { passwordRegex } from 'src/common/utils/regex_control.utils';
import { SiteCredentialsRepository } from 'src/core/repositories/site_credentials.repository';
import { ILike } from 'typeorm';
import { SearchCredentialsWithPaginationDTO } from '../dto/searchCredentials.dto';

@Injectable()
export class ManageSiteCredentialservices extends CommonResponse {
  constructor(
    private readonly _siteCredentialRepository: SiteCredentialsRepository,
  ) {
    super();
  }

  async addCredential(
    data: Partial<AddCredentialDTO>,
  ): Promise<ResponseService> {
    const controlPassword = passwordRegex.test(data.secret);
    if (!controlPassword) throw new ForbiddenException('Invalid password');

    const controlCredential = await this._siteCredentialRepository.findOne({
      where: {
        site: ILike(`%${data.site}%`),
      },
    });

    if (controlCredential) throw new ForbiddenException('Site Already Exists');

    await this._siteCredentialRepository.addCredentialsAndAssociatedWithUsers(
      data,
    );
    this.setSuccess(200, 'Credentials successfully added');
    return this.setSend();
  }

  async getCredentials(
    query: Partial<SearchCredentialsWithPaginationDTO>,
  ): Promise<ResponseService> {
    const data =
      await this._siteCredentialRepository.getCredentialsWithPaginationAndSearch(
        query.term,
        query.page,
        query.limit,
      );
    this.setSuccess(200, 'Ok Sites', data);
    return this.setSend();
  }

  async getCredentialsById(id: number): Promise<ResponseService> {
    const data = await this._siteCredentialRepository.getSiteById(id);
    this.setSuccess(200, 'Ok Site', data);
    return this.setSend();
  }
}

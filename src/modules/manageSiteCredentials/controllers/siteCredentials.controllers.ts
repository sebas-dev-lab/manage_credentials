import {
  Controller,
  Post,
  Res,
  Body,
  Req,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ManageSiteCredentialservices } from '../services/manageCredential.service';
import { AddCredentialDTO } from '../dto/addCredential.dto';
import { SearchCredentialsWithPaginationDTO } from '../dto/searchCredentials.dto';
import { UpdateUsersCredentialsDTO } from '../dto/updateUsersCredentials.dto';

@Controller('manage-credentials')
export class SiteCredentialsControllers {
  constructor(
    private readonly _addCredentialService: ManageSiteCredentialservices,
  ) {}

  @Post()
  async addCredential(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: AddCredentialDTO,
  ): Promise<any> {
    const v = await this._addCredentialService.addCredential(data);
    return res.status(v.code).json(v);
  }

  @Get()
  async getCredentials(
    @Req() req: Request,
    @Res() res: Response,
    @Query() data: SearchCredentialsWithPaginationDTO,
  ): Promise<any> {
    const v = await this._addCredentialService.getCredentials(data);
    return res.status(v.code).json(v);
  }

  @Get(':site_id')
  async getCredentialById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('site_id') site_id: number,
  ): Promise<any> {
    const v = await this._addCredentialService.getCredentialsById(site_id);
    return res.status(v.code).json(v);
  }

  @Patch(':site_id')
  async updateUsersFromCredentials(
    @Req() req: Request,
    @Res() res: Response,
    @Param('site_id') site_id: number,
    @Body() data: UpdateUsersCredentialsDTO,
  ): Promise<any> {
    const v = await this._addCredentialService.updateUsersFromCredentials(
      site_id,
      data,
    );
    return res.status(v.code).json(v);
  }

  @Get('/allowed-users/:user_id')
  async getAllowedUserSiteCredentialControllers(
    @Req() req: Request,
    @Res() res: Response,
    @Param('user_id') user_id: number,
  ): Promise<any> {
    const v = await this._addCredentialService.getAllowedUserSiteCredentialsService(user_id);
    return res.status(v.code).json(v);
  }
}

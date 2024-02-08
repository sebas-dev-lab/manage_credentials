import { Controller, Get } from '@nestjs/common';
import {
  Body,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common/decorators';
import { Response } from 'express';
import { SearchUsersServices } from '../services/searchUsers.service';
import { SearchUsersWithPaginationDto } from '../dto/searchUsers.dto';
import { RegisterUsersDto } from '../dto/registerUsers.dto';
import { ManageUserServices } from '../services/manageUsers.service';
import { UpdateUsersDto } from '../dto/updateUsers.dto';

@Controller('manage-intern-users')
export class ManageUsersControllers {
  constructor(
    private readonly _searchUsersServices: SearchUsersServices,
    private readonly _manageUsersService: ManageUserServices,
  ) {}

  @Get()
  async getApiVersionController(
    @Res() res: Response,
    @Query() search: SearchUsersWithPaginationDto,
  ): Promise<any> {
    const v = await this._searchUsersServices.findUsers(search);
    return res.status(v.code).json(v);
  }

  @Post()
  async registerUser(
    @Res() res: Response,
    @Body() data: RegisterUsersDto,
  ): Promise<any> {
    const v = await this._manageUsersService.registerUser(data);
    return res.status(v.code).json(v);
  }

  @Patch('/:user_id')
  async updateUser(
    @Res() res: Response,
    @Body() data: UpdateUsersDto,
    @Param('user_id') user_id: number,
  ): Promise<any> {
    const v = await this._manageUsersService.updateUser(user_id, data);
    return res.status(v.code).json(v);
  }
}

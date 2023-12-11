import { Controller, Get } from '@nestjs/common';
import { Body, Post, Query, Res } from '@nestjs/common/decorators';
import { Response } from 'express';
import { SearchUsersServices } from '../services/searchUsers.service';
import { SearchUsersWithPaginationDto } from '../dto/searchUsers.dto';
import { RegisterUsersDto } from '../dto/registerUsers.dto';
import { ManageUserServices } from '../services/manageUsers.service';

@Controller('manage-users')
export class ManageUsersControllers {
    constructor(
        private readonly _searchUsersServices: SearchUsersServices,
        private readonly _manageUsersService: ManageUserServices,
    ) { }

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
        @Body() search: RegisterUsersDto,
    ): Promise<any> {
        const v = await this._manageUsersService.registerUser(search);
        return res.status(v.code).json(v);
    }
}

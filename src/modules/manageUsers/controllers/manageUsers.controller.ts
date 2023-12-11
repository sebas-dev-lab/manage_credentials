import { Controller, Get } from '@nestjs/common';
import { Res } from '@nestjs/common/decorators';
import { Response } from 'express';

@Controller('manage-users')
export class AppController {
    constructor() { }

    @Get()
    async getApiVersionController(@Res() res: Response): Promise<any> {
        //const v = await this.appService.getVersionService();
        //return res.status(v.code).json(v);
    }
}

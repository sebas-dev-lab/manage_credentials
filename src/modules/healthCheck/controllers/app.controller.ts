import { Controller, Get } from '@nestjs/common';
import { Res } from '@nestjs/common/decorators';
import { Response } from 'express';
import { AppService } from '../services/app.service';

@Controller('healthcheck')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('version')
  async getApiVersionController(@Res() res: Response): Promise<any> {
    const v = await this.appService.getVersionService();
    return res.status(v.code).json(v);
  }
}

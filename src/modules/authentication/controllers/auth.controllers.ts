import { Controller, Post, Res, Body, Req } from '@nestjs/common';
import { SigninAuthenticationService } from '../services/signin.service';
import { SigninDto } from '../dto/signin.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly _signinService: SigninAuthenticationService) {}

  @Post('login')
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: SigninDto,
  ): Promise<any> {
    const ip = req.ip;
    const userAgent = req.get('user-agent');

    const v = await this._signinService.signin(data, {
      userAgent,
      ip,
    });
    return res.status(v.code).json(v);
  }
}

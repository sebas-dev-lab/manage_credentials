import { Controller, Post, Res, Body, Req } from '@nestjs/common';
import { SigninAuthenticationService } from '../services/signin.service';
import { SigninDto } from '../dto/signin.dto';
import { Request, Response } from 'express';
import { SigninValidationDTO } from '../dto/signin-validation.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authenticaion')
export class AuthController {
  constructor(private readonly _signinService: SigninAuthenticationService) {}

  @Post('signin')
  @ApiResponse({ status: 201, description: 'Login User' })
  @ApiResponse({ status: 401, description: 'Unauthorized password' })
  @ApiResponse({ status: 409, description: 'Somethin was wrong' })
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

  @Post('signin-validation')
  @ApiResponse({ status: 201, description: 'Validate Token' })
  async signinValidation(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: SigninValidationDTO,
  ): Promise<any> {
    const user_id = req.authContext.user.user_id;
    const v = await this._signinService.signinValidation(data, user_id);
    return res.status(v.code).json(v);
  }
}

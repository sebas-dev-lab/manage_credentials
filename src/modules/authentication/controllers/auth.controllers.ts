import { Controller, Post, Res, Body } from '@nestjs/common';
import { SigninAuthenticationService } from '../services/signin.service';
import { SigninDto } from '../dto/signin.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly _signinService: SigninAuthenticationService) { }

    @Post('login')
    async login(
        @Res() res: Response,
        @Body() data: SigninDto,
    ): Promise<any> {
        const v = await this._signinService.signin(data);
        return res.status(v.code).json(v);
    }
}
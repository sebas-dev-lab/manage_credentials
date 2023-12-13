import {
  Injectable,
  NestMiddleware,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { AuthUseCase } from 'src/infrastructure/useCases/authorization/auth.usecase';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authUseCase: AuthUseCase,
  ) {}
  async use(@Req() req: Request, res: Response, next: NextFunction) {
    // ============= Control token ============== //
    const auth_token =
      typeof req.headers.authorization === 'string'
        ? req.headers.authorization.split(' ')[1]
        : '';

    const url = req.baseUrl.split('/')[3];
    const ip = req.ip;
    const userAgent = req.get('user-agent');
    if (!auth_token) {
      throw new UnauthorizedException('Unauthorized access');
    }

    const decode = await this.jwtService.verifyAsync(auth_token, {
      secret: 'your-secret-key',
      ignoreExpiration: true,
    });

    if (!decode) {
      throw new UnauthorizedException('Unauthorized access');
    }

    if (!decode?.sid) {
      throw new UnauthorizedException('Unauthorized access');
    }

    // ============= Control Session User ============== //
    const user = await this.authUseCase.validateUserByJwt(decode, {
      ip,
      userAgent,
    });

    if (!user) {
      throw new UnauthorizedException('Unauthorized access');
    }

    // ============= Control Role Permission ============== //
    await this.authUseCase.permissionControl(user.auth_role.id, url.trim());

    // ============= Save in context request ============== //
    req.authContext = {
      user: {
        user_id: user.id,
        user_email: user.email,
        role_id: user.auth_role.id,
      },
    };

    next();
  }
}

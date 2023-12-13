import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthUseCase } from './auth.usecase';
import { loginDataType } from 'src/modules/authentication/types/login_data.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authUseCase: AuthUseCase) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key',
    });
  }

  async validate(payload: any, login_data: loginDataType) {
    const user = await this.authUseCase.validateUserByJwt(payload, login_data);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}

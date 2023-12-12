// jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthUseCase } from './auth.usecase';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authUseCase: AuthUseCase) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'your-secret-key',
        });
    }

    async validate(payload: any) {
        const user = await this.authUseCase.validateUserByJwt(payload);
        if (!user) {
            throw new UnauthorizedException('Unauthorized');
        }
        return user;
    }
}

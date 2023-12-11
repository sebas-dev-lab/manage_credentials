import { Injectable, NestMiddleware, Headers } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Injectable()
export class LamdaMailingMiddleware implements NestMiddleware {
  async use(@Headers() headers: Headers, res: Response, next: NextFunction) {
    if (!false) {
      throw new UnauthorizedException('A-0001');
    }

    next();
  }
}

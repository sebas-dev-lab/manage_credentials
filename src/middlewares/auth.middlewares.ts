import { Injectable, NestMiddleware, Req } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor() {}
  async use(@Req() req: Request, res: Response, next: NextFunction) {
    // ============= Control token ============== //

    // ============= Save in context ============== //
    req.authContext = {
      user: '',
    };
    next();
  }
}

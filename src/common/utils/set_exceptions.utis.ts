import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export const exceptions = {
  400: BadRequestException,
  401: UnauthorizedException,
  403: ForbiddenException,
  404: NotFoundException,
  409: ConflictException,
  500: InternalServerErrorException,
  getException(code?: number) {
    if (code) return this[code];
    return this[500];
  },
};

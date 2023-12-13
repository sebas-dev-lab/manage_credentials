import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import Logger from 'src/infrastructure/configurations/loggingConfiguration/winston.logs';

export class PasswordAuthEncryptUseCase {
  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      const hashPassword = await bcrypt.hash(password, salt);
      return hashPassword;
    } catch (err) {
      Logger.error(err.message);
      throw new ConflictException(err.message);
    }
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (err) {
      Logger.error(err.message);
      throw new ConflictException(err.message);
    }
  }
}
